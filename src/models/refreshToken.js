const db = require('../db')
const { DataTypes } = require('sequelize')
const { wrongToken } = require('../errors/tokenError')

const RefreshToken = db.sequelize.define(
  'RefreshToken',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(400),
      allowNull: false
    }
  },
  {
    tableName: 'RefreshToken'
  }
)

RefreshToken.getUserByToken = async refreshToken => {
  const matchedRefreshToken = await RefreshToken.findOne({
    where: {
      token: refreshToken
    },
    include: 'user'
  })
  if (!matchedRefreshToken) {
    throw wrongToken()
  }
  return { user: matchedRefreshToken.user, matchedRefreshToken }
}

RefreshToken.associate = models => {
  RefreshToken.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
    onUpdate: 'cascade',
    onDelete: 'cascade'
  })
}

module.exports = RefreshToken
