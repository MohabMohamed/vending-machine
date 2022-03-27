const express = require('express')
const UserController = require('../controllers/user')
const rules = require('../middleware/validators/userRoles')
const validate = require('../middleware/validators/validator')

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

module.exports = router
