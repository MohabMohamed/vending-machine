const db = require('../../src/db')
const User = require('../../src/models/user')
const RefreshToken = require('../../src/models/refreshToken')
const Product = require('../../src/models/product')

const setupDatabase = async() => {
    await User.destroy({ where: {} })
    await RefreshToken.destroy({ where: {} })
    await Product.destroy({ where: {} })


}


const cleanDB = async() => {
    db.sequelize.close()
}

module.exports = { setupDatabase, cleanDB }