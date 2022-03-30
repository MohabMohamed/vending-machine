const express = require('express')
const Auth = require('../middleware/auth')
const validate = require('../middleware/validators/validator')
const RolesEnum = require('../util/rolesEnum')
const ProductRoles = require('../middleware/validators/productRoles')
const ProductController = require('../controllers/product')
const router = new express.Router()
const defaultPagination = require('../util/defaultPagination')

router.post(
  '/products',
  Auth.authenticate,
  Auth.authorize(RolesEnum.seller.roleName),
  ProductRoles.PostProductRules(),
  validate,

  async (req, res) => {
    try {
      const responseData = await ProductController.insertProduct(
        req.body,
        req.user
      )
      res.status(201).send(responseData)
    } catch (error) {
      const statusCode = error.code || 400
      res.status(statusCode).send(error)
    }
  }
)

router.get('/products/:productId', async (req, res) => {
  try {
    const responseData = await ProductController.getProduct(req.params)
    res.status(200).send(responseData)
  } catch (error) {
    const statusCode = error.code || 404
    res.status(statusCode).send(error)
  }
})

router.get('/products', async (req, res) => {
  try {
    const pagination = Object.assign(defaultPagination)

    if (req.query.limit && req.query.limit > 0) {
      pagination.limit = req.query.limit
    }
    if (req.query.offset && req.query.offset > 0) {
      pagination.offset = req.query.offset
    }

    const responseData = await ProductController.getAllProducts(pagination)
    res.status(200).send(responseData)
  } catch (error) {
    const statusCode = error.code || 404
    res.status(statusCode).send(error)
  }
})

module.exports = router
