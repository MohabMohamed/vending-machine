const jwt = require('../util/jwt')
const { wrongToken } = require('../errors/tokenError')
const RefreshToken = require('../models/refreshToken')
const { unAuthorized } = require('../errors/userError')

const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]
    if (!accessToken) {
      throw wrongToken()
    }
    const { payload, expired } = jwt.verify(
      accessToken,
      process.env.ACCESS_JWT_SECRET
    )
    if (payload) {
      req.accessToken = accessToken
      req.user = payload
      return next()
    } else {
      throw wrongToken()
    }
  } catch (error) {
    const statusCode = error.code || 401
    res.status(statusCode).send(error)
  }
}

const authenticateRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization.split(' ')[1]
    if (!refreshToken) {
      throw wrongToken()
    }

    const { payload, expired } = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET
    )

    if (!payload || expired) {
      throw wrongToken()
    }
    if (payload) {
      const { user, matchedRefreshToken } = await RefreshToken.getUserByToken(
        refreshToken
      )
      if (!user) {
        throw wrongToken()
      }
      req.refreshToken = refreshToken
      req.refreshTokenObj = matchedRefreshToken
      req.user = user
      return next()
    }
  } catch (error) {
    const statusCode = error.code || 401
    res.status(statusCode).send(error)
  }
}

const authorize = role => {
  return async (req, res, next) => {

    try {
      if (role != req.user.role) {
        throw unAuthorized()
      }
      next()
    } catch (error) {
      res.status(error.code).send(error)
    }
  }
}

module.exports = { authenticate, authenticateRefreshToken, authorize }
