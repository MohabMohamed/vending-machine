const request = require('supertest')
const dbFixture = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')
const RefreshToken = require('../src/models/refreshToken')

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