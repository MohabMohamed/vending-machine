const db = require('../db')
const { DataTypes } = require('sequelize')
const userError = require('../errors/userError')
const { UserDto } = require('../dtos/user')
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')
const jwt = require('../util/jwt')

const User = db.sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
      validate: {
        isLowercase: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deposit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        isNotNegative (value) {
          if (value < 0) throw new Error("deposit can't be a negative number")
        }
      }
    },
    role: {
      type: DataTypes.ENUM('buyer', 'seller')
    }
  },
  {
    tableName: 'User',
    hooks: {
      beforeSave: async (user, options) => {
        user.username = user.username.toLowerCase()
        user.password = await bcrypt.hash(user.password, 10)
      },
      beforeUpdate: async (user, options) => {
        user.username = user.username.toLowerCase()
        const { _previousDataValues, dataValues } = user
        if (
          await !bcrypt.compare(
            dataValues.password,
            _previousDataValues.password
          )
        ) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      }
    }
  }
)

User.findByCredentials = async (username, password) => {
  const user = await User.findOne({
    where: {
      username
    }
  })

  if (!user) {
    throw userError.unableToLogin()
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw userError.unableToLogin()
  }

  return user
}

User.prototype.toJSON = function () {
  return new UserDto(this.dataValues)
}

User.prototype.generateAccessToken = function () {
  const { id, username, role } = this.dataValues

  return jwt.sign(
    {
      id,
      username,
      role
    },
    process.env.ACCESS_JWT_SECRET,
    Number(process.env.ACCESS_TOKEN_LIFE_SPAN)
  )
}

User.generateRefreshToken = function () {
  return jwt.sign(
    { session: uuid() },
    process.env.REFRESH_JWT_SECRET,
    Number(process.env.REFRESH_TOKEN_LIFE_SPAN)
  )
}
User.register = async user => {
  const matchedUser = await User.findOne({
    where: {
      username: user.username
    }
  })

  if (matchedUser) {
    throw userError.existingUsername()
  }

  const refreshToken = User.generateRefreshToken()

  try {
    const newUser = await User.create(
      {
        ...user,
        refreshToken: { token: refreshToken }
      },
      {
        include: ['refreshToken']
      }
    )

    return newUser
  } catch (error) {
    throw error
  }
}

User.associate = models => {
  User.hasMany(models.Product, {
    foreignKey: 'sellerId',
    as: 'product',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })

  User.hasMany(models.RefreshToken, {
    foreignKey: 'userId',
    as: 'refreshToken',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
}

module.exports = User
