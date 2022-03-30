const db = require('../../src/models')
const User = require('../../src/models/user')
const RefreshToken = require('../../src/models/refreshToken')
const Product = require('../../src/models/product')
const RoleEnum = require('../../src/util/rolesEnum')
const rolesEnum = require('../../src/util/rolesEnum')

let firstUserId = 1
const firstUser = {
    id: firstUserId,
    role: RoleEnum.seller.roleName,
    username: 'mohabmohamed',
    password: '1234b0i@(bvw',
    deposit: 20
}

let secondUserId = 2
const secondUser = {
    id: secondUserId,
    roleId: rolesEnum.buyer.roleName,
    username: 'elonmusk',
    password: '1234b0i@(bvw',
    deposit: 50
}

const firstRefreshToken = User.generateRefreshToken()
const secondRefreshToken = User.generateRefreshToken()


let firstProductId = 1
const firstProduct = {
    id: firstProductId,
    productName: 'oreo',
    cost: 4,
    amountAvailable: 25
}


const setupDatabase = async() => {
    await User.destroy({ where: {} })
    await RefreshToken.destroy({ where: {} })
    await Product.destroy({ where: {} })

    firstUser.refreshToken = { token: firstRefreshToken }
    const user1 = await User.create(firstUser, {
        include: ['refreshToken']
    })
    firstUserId = user1.id

    secondUser.refreshToken = { token: secondRefreshToken }
    const user2 = await User.create(secondUser, {
        include: ['refreshToken']
    })
    secondUserId = user2.id

    const product1 = await Product.create({...firstProduct, sellerId: firstUserId })
    firstProductId = product1.id
}



const cleanDB = async() => {
    db.sequelize.close()
}

module.exports = {
    setupDatabase,
    cleanDB,
    firstRefreshToken,
    secondRefreshToken,
    firstUserId,
    secondUserId,
    firstProduct,
    firstProductId
}