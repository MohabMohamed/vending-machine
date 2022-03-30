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


    userAccessToken = loginResponse.body.accessToken
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


    userAccessToken = loginResponse.body.accessToken
    const token = `Bearer ${userAccessToken}`

    const productToInsert = {
        productName: 'power horse',
        cost: 2500,
        amountAvailable: 20
    }

    const requestResponse = await agent.post('/products').set(
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