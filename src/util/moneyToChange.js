const validCoins = require('./validCoins')

const moneyToChange = money => {
  if (money == 0) return []
  let coins = []
  for (let idx = validCoins.length - 1; idx >= 0 && money > 0; idx--) {
    if (money >= validCoins[idx]) {
      const numberOfCoins = Math.floor(money / validCoins[idx])
      coins.push({ coinValue: validCoins[idx], amount: numberOfCoins })
      money -= numberOfCoins * validCoins[idx]
    }
  }

  return coins
}

module.exports = moneyToChange
