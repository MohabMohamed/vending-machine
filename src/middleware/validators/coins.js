const { body } = require('express-validator')
const validCoins = require('../../util/validCoins')
const coinsRules = () => {
  return [
    body('coins')
      .exists()
      .notEmpty()
      .toLowerCase()
      .isArray()
      .withMessage('coins is not array')
      .custom(coins => {
        if (!coins.every(Number.isInteger)) {
          throw new Error('coins should be an array of integers')
        }

        if (coins.every(coin => validCoins.includes(coin))) {
          return true
        }
        throw new Error(`the only valid coins: ${validCoins}`)
      })
  ]
}

module.exports = { coinsRules }
