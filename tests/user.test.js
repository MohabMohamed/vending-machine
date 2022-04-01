const request = require('supertest')
const dbFixture = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')
const RefreshToken = require('../src/models/refreshToken')
const { buyer } = require('../src/util/rolesEnum')
const Product = require('../src/models/product')



beforeEach(dbFixture.setupDatabase)
afterAll(dbFixture.cleanDB)

const agent = request.agent(app)

test('Should register new user', async() => {
    const response = await agent.post('/users').send({
        username: "johndoe",
        password: '1234avwM!#',
        role: 'seller'
    }).expect(201)

    const createdUserId = parseInt(response.body.user.id)

    const user = User.findByPk(createdUserId)
    expect(user).not.toBeNull()

    ResponseRefreshToken = response.body.refreshToken
    const refreshToken = await RefreshToken.findOne({
        where: {
            userId: createdUserId,
            token: ResponseRefreshToken
        }
    })

    expect(refreshToken).not.toBeNull()
    expect(refreshToken.token).toBe(ResponseRefreshToken)
})



test('Should login the user', async() => {
    const response = await agent.post('/users/login').send({
        username: 'mohabmohamed',
        password: '1234b0i@(bvw'
    }).expect(200)

    ResponseRefreshToken = response.body.refreshToken


    const refreshToken = await RefreshToken.findOne({
        where: {
            userId: response.body.user.id,
            token: ResponseRefreshToken
        }
    })


    expect(refreshToken).not.toBeNull()
    expect(refreshToken.token).toBe(ResponseRefreshToken)
})

test("Shouldn't login the user for wrong credentials", async() => {
    const response = await agent.post('/users/login').send({
        username: 'mohabmohamed',
        password: 'not the right password'
    }).expect(401)
})


test('should logout the user', async() => {

    let matchedRefreshToken = await RefreshToken.findOne({ where: { token: dbFixture.firstRefreshToken } })
    expect(matchedRefreshToken).not.toBeNull()
    const token = `Bearer ${dbFixture.firstRefreshToken}`

    await agent.get('/users/logout').set('Authorization', token).send().expect(200)

    matchedRefreshToken = await RefreshToken.findOne({ where: { token: dbFixture.firstRefreshToken } })

    expect(matchedRefreshToken).toBeNull()
})
test('should let buyer deposit coins in his account', async () => {
  const loginResponse = await agent
    .post('/users/login')
    .send({
      username: dbFixture.secondUser.username,
      password: dbFixture.secondUser.password
    })
    .expect(200)

  const userAccessToken = loginResponse.body.accessToken
  const token = `Bearer ${userAccessToken}`

  const buyerOldData = await User.findByPk(dbFixture.secondUserId)

  const coins = [20, 5]
  let coinsSum = 25

  const requestResponse = await agent
    .post('/deposit')
    .set('Authorization', token)
    .send({ coins })
    .expect(200)

  coinsSum += buyerOldData.deposit
  expect(requestResponse.body.deposit).toBe(coinsSum)

  const buyerNewData = await User.findByPk(dbFixture.secondUserId)

  expect(buyerNewData.deposit).toBe(coinsSum)
})

test('should let buyer buy a product', async () => {
  const loginResponse = await agent
    .post('/users/login')
    .send({
      username: dbFixture.secondUser.username,
      password: dbFixture.secondUser.password
    })
    .expect(200)

  const userAccessToken = loginResponse.body.accessToken
  const token = `Bearer ${userAccessToken}`

  const buyerOldData = await User.findByPk(dbFixture.secondUserId)
  const sellerOldData = await User.findByPk(dbFixture.firstUserId)
  const productOldData = await Product.findByPk(dbFixture.secondProductId)

  const amount = 3
  const totalPrice = dbFixture.secondProduct.cost * amount
  const requestBody = {
    productId: dbFixture.secondProductId,
    amount
  }

  const requestResponse = await agent
    .post('/buy')
    .set('Authorization', token)
    .send(requestBody)
    .expect(200)

  expect(requestResponse.body.totalSpent).toBe(totalPrice)
  expect(requestResponse.body.productName).toBe(productOldData.productName)
  expect(requestResponse.body.amount).toBe(amount)
  expect(requestResponse.body.change.sort()).toStrictEqual(
    [
      { coinValue: 20, amount: 2 },
      { coinValue: 5, amount: 1 }
    ].sort()
  )

  const buyerNewData = await User.findByPk(dbFixture.secondUserId)
  const sellerNewData = await User.findByPk(dbFixture.firstUserId)
  const productNewData = await Product.findByPk(dbFixture.secondProductId)

  expect(buyerNewData.deposit).toBe(0)
  expect(sellerNewData.deposit).toBe(sellerOldData.deposit + totalPrice)
  expect(productNewData.amountAvailable).toBe(
    productOldData.amountAvailable - amount
  )
})
