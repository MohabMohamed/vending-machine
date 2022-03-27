const request = require('supertest')
const dbFixture = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')
const RefreshToken = require('../src/models/refreshToken')

beforeEach(dbFixture.setupDatabase)
afterAll(dbFixture.cleanDB)

const agent = request.agent(app)

test('Should register new user', async() => {
    // const response = await agent.post('/users').send({
    //     username: "johndoe",
    //     password: '1234avw!#',
    //     role: 'seller'
    // }).expect(201)

    // const createdUserId = parseInt(response.body.user.id)

    // const user = User.findByPk(createdUserId)
    // expect(user).not.toBeNull()

    // ResponseRefreshToken = response.body.refreshToken
    // const refreshToken = await RefreshToken.findOne({
    //     where: {
    //         userId: createdUserId,
    //         token: ResponseRefreshToken
    //     }
    // })

    // expect(refreshToken).not.toBeNull()
    // expect(refreshToken.token).toBe(ResponseRefreshToken)
})