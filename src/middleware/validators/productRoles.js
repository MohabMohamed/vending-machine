const { body } = require('express-validator')

const PostProductRules = () => {
  return [
    body('productName')
      .exists()
      .trim()
      .notEmpty()
      .toLowerCase(),
    body(['amountAvailable', 'cost'])
      .exists()
      .notEmpty()
      .isInt()
  ]
}

const PutProductRules = () => {
  return [
    body('productName')
      .optional()
      .trim()
      .toLowerCase(),
    body(['amountAvailable', 'cost'])
      .optional()
      .isInt()
  ]
}

module.exports = { PostProductRules, PutProductRules }
