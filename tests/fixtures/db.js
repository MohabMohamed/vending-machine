const db = require('../../src/models')
const User = require('../../src/models/user')
const RefreshToken = require('../../src/models/refreshToken')
const Product = require('../../src/models/product')
const RoleEnum = require('../../src/util/rolesEnum')
const rolesEnum = require('../../src/util/rolesEnum')

const firstUserId = 1
const firstUser = {
    id: firstUserId,
    role: RoleEnum.seller.roleName,
    username: 'mohabmohamed',
    password: '1234b0i@(bvw',
    deposit: 20
}

const secondUserId = 2
const secondUser = {
    id: secondUserId,
    roleId: rolesEnum.buyer.roleName,
    username: 'elonmusk',
    password: '1234b0i@(bvw',
    deposit: 50
}

const firstRefreshToken = User.generateRefreshToken()
const secondRefreshToken = User.generateRefreshToken()

const setupDatabase = async() => {
    await User.destroy({ where: {} })
    await RefreshToken.destroy({ where: {} })
    await Product.destroy({ where: {} })

    firstUser.refreshToken = { token: firstRefreshToken }
    await User.create(firstUser, {
        include: ['refreshToken']
    })

    secondUser.refreshToken = { token: secondRefreshToken }
    await User.create(secondUser, {
        include: ['refreshToken']
    })
}


const cleanDB = async() => {
    db.sequelize.close()
}

module.exports = { setupDatabase, cleanDB }