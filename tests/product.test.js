const request = require('supertest')
const dbFixture = require('./fixtures/db')
const app = require('../src/app')
const Product = require('../src/models/product')


beforeEach(dbFixture.setupDatabase)
afterAll(dbFixture.cleanDB)

const agent = request.agent(app)


test('Should let seller add a product', async() => {
    const loginResponse = await agent.post('/users/login').send({
        username: 'mohabmohamed',
        password: '1234b0i@(bvw'
    }).expect(200)


    const userAccessToken = loginResponse.body.accessToken

    const token = `Bearer ${userAccessToken}`

    const productToInsert = {
        productName: 'power horse',
        cost: 2500,
        amountAvailable: 20
    }

    const requestResponse = await agent.post('/products').set(
        'Authorization', token).send(productToInsert).expect(201)


    expect(requestResponse.body.productName).toBe('power horse')

    const product = await Product.findOne({ where: { productName: productToInsert.productName } })

    expect(product).not.toBeNull()
    expect(product.id).toBe(requestResponse.body.id)
})

test('Shouldn\'t let buyer add a product', async() => {
    const loginResponse = await agent.post('/users/login').send({
        username: 'elonmusk',
        password: '1234b0i@(bvw'
    }).expect(200)


    const userAccessToken = loginResponse.body.accessToken

    const token = `Bearer ${userAccessToken}`

    const productToInsert = {
        productName: 'power horse',
        cost: 2500,
        amountAvailable: 20
    }

    await agent.post('/products').set(
        'Authorization', token).send(productToInsert).expect(401)


    const product = await Product.findOne({ where: { productName: productToInsert.productName } })

    expect(product).toBeNull()

})

test('should get the info of product', async() => {
    const requestResponse = await agent.get(`/products/${dbFixture.firstProductId}`).
    send().expect(200)


    expect(requestResponse.body.productName).toBe(dbFixture.firstProduct.productName)

})

test('shouldn\'t get the info of not found product', async() => {
    const requestResponse = await agent.get(`/products/100`).
    send().expect(404)


    expect(requestResponse.body.productName).toBeUndefined()

})

test('should get one product', async() => {
    const requestResponse = await agent.get('/products/?limit=1').
    send().expect(200)

    expect(requestResponse.body.length).toBe(1)

})

test('should get two products', async() => {
    const requestResponse = await agent.get('/products/?limit=2&&offset=0').
    send().expect(200)

    expect(requestResponse.body.length).toBe(2)


})
test("Should let seller delete it's product", async() => {
    const loginResponse = await agent
        .post('/users/login')
        .send({
            username: 'mohabmohamed',
            password: '1234b0i@(bvw'
        })
        .expect(200)

    const userAccessToken = loginResponse.body.accessToken
    const token = `Bearer ${userAccessToken}`

    let product = await Product.findByPk(dbFixture.firstProductId)

    expect(product).not.toBeNull()

    const requestResponse = await agent
        .delete(`/products/${dbFixture.firstProductId}`)
        .set('Authorization', token)
        .send()
        .expect(200)

    product = await Product.findByPk(dbFixture.firstProductId)

    expect(product).toBeNull()

    expect(requestResponse.body.productName).toBe(
        dbFixture.firstProduct.productName
    )
    expect(requestResponse.body.id).toBe(dbFixture.firstProductId)
})




test("Should let seller update it's product", async() => {
    const loginResponse = await agent
        .post('/users/login')
        .send({
            username: 'mohabmohamed',
            password: '1234b0i@(bvw'
        })
        .expect(200)

    const userAccessToken = loginResponse.body.accessToken

    const token = `Bearer ${userAccessToken}`

    let product = await Product.findByPk(dbFixture.firstProductId)

    expect(product).not.toBeNull()

    const newFields = { productName: "potato", cost: 45 }
    const requestResponse = await agent
        .put(`/products/${dbFixture.firstProductId}`)
        .set('Authorization', token)
        .send(newFields)
        .expect(200)

    product = await Product.findByPk(dbFixture.firstProductId)

    expect(product.productName).toBe(newFields.productName)
    expect(product.cost).toBe(newFields.cost)


    expect(requestResponse.body.productName).toBe(
        newFields.productName
    )
})