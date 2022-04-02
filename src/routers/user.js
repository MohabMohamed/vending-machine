const express = require('express')
const UserController = require('../controllers/user')
const userRules = require('../middleware/validators/userRoles')

const validate = require('../middleware/validators/validator')
const Auth = require('../middleware/auth')
const coinsRules = require('../middleware/validators/coins')
const RolesEnum = require('../util/rolesEnum')

const router = new express.Router()

router.post('/users', userRules.PostUserRules(), validate, async (req, res) => {
  try {
    const responseData = await UserController.registerUser(req.body)
    res.status(201).send(responseData)
  } catch (error) {
    const statusCode = error.code || 400
    res.status(statusCode).send(error)
  }
})

router.post(
  '/users/login',
  userRules.LoginUserRules(),
  validate,
  async (req, res) => {
    try {
      const responseData = await UserController.loginUser(req.body)

      res.status(200).send(responseData)
    } catch (error) {
      const statusCode = error.code || 400
      res.status(statusCode).send(error)
    }
  }
)

router.get('/users/logout', Auth.authenticateRefreshToken, async (req, res) => {
  try {
    await UserController.logoutUser({
      refreshToken: req.refreshToken,
      refreshTokenObj: req.refreshTokenObj
    })

    res.send({ ok: true })
  } catch (e) {
    res.status(401).send()
  }
})

router.post(
  '/deposit',
  Auth.authenticate,
  Auth.authorize(RolesEnum.buyer.roleName),
  coinsRules.coinsRules(),
  validate,
  async (req, res) => {
    try {
      const responseData = await UserController.deposit(
        req.user.id,
        req.body.coins
      )

      res.status(200).send(responseData)
    } catch (error) {
      const statusCode = error.code || 400
      res.status(statusCode).send(error)
    }
  }
)

router.post(
  '/buy',
  Auth.authenticate,
  Auth.authorize(RolesEnum.buyer.roleName),
  userRules.BuyRules(),
  validate,
  async (req, res) => {
    try {
      const responseData = await UserController.buy(
        req.user.id,
        req.body.productId,
        req.body.amount
      )

      res.status(200).send(responseData)
    } catch (error) {
      const statusCode = error.code || 400
      res.status(statusCode).send(error)
    }
  }
)

router.get(
  '/reset',
  Auth.authenticate,
  Auth.authorize(RolesEnum.buyer.roleName),
  async (req, res) => {
    try {
      const responseData = await UserController.reset(req.user.id)

      res.status(200).send(responseData)
    } catch (error) {
      const statusCode = error.code || 400
      res.status(statusCode).send(error)
    }
  }
)

module.exports = router
