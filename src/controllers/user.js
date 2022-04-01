const UserDto = require('../dtos/user')
const User = require('../models/user')
const RefreshToken = require('../models/refreshToken')
const UserError = require('../errors/userError')
const { sequelize } = require('../models/index')
const dbError = require('../errors/dbError')
const { BaseError } = require('sequelize')


const registerUser = async body => {
  try {
    const newUser = await User.register(body)

    const accessToken = newUser.generateAccessToken()
    return new UserDto.UserRegistrationDto(newUser, accessToken)
  } catch (error) {
    throw error
  }
}

const loginUser = async body => {
  const user = await User.findByCredentials(body.username, body.password)
  const accessToken = user.generateAccessToken()

  const refreshToken = User.generateRefreshToken()

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    role: user.role
  })

  return new UserDto.UserLoginDto(user, refreshToken, accessToken)
}

const logoutUser = async body => {
  if (!body.refreshToken || !body.refreshTokenObj) {
    throw new Error()
  }
  await body.refreshTokenObj.destroy()
}

const deposit = async (buyerId, coins) => {
  const coinSum = coins.reduce((sum, coin) => sum + coin, 0)
  const transaction = await sequelize.transaction()

  try {
    const buyer = await User.findByPk(buyerId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!buyer) {
      throw new UserError.userNotFound()
    }

    const newBuyer = await buyer.increment('deposit', {
      by: coinSum,
      transaction
    })

    await transaction.commit()
    return new UserDto.UserDto(newBuyer)
  } catch (error) {
    await transaction.rollback()

    if (error instanceof BaseError) {
      throw new dbError.unexposedDbError()
    } else {
      throw error
    }
  }
}

module.exports = { registerUser, loginUser, logoutUser, deposit }

