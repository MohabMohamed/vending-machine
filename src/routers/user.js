const express = require('express')
const UserController = require('../controllers/user')
const rules = require('../middleware/validators/userRoles')
const validate = require('../middleware/validators/validator')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', rules.PostUserRules(), validate, async (req, res) => {
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
  rules.LoginUserRules(),
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

router.get('/users/logout', auth.authenticateRefreshToken, async (req, res) => {
  try {
    UserController.logoutUser({
      refreshToken: req.refreshToken,
      refreshTokenObj: req.refreshTokenObj
    })

    res.send({ ok: true })
  } catch (e) {
    res.status(401).send()
  }
})

module.exports = router
