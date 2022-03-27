const db = require('../../src/db')
const User = require('../../src/models/user')
const RefreshToken = require('../../src/models/refreshToken')

const setupDatabase = async() => {
    await User.destroy({ where: {} })
    await RefreshToken.destroy({ where: {} })
    await Permission.destroy({ where: {} })


}


const cleanDB = async() => {
    db.sequelize.close()
}

module.exports = { setupDatabase, cleanDB }