const { body } = require('express-validator')

const PostProductRules = () => {
  return [
    body(['productName', 'amountAvailable', 'cost'])
      .trim()
      .notEmpty()
      .toLowerCase()
  ]
}

module.exports = { PostProductRules }
