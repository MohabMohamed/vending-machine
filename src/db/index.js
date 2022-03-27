const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../../config/database.js')[env]
const db = {}

let sequelize
if (env == 'test') {
  sequelize = new Sequelize(config.uri)
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
