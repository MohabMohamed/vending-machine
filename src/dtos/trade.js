class BuyDto {
  constructor (totalSpent, productName, amount, change) {
    this.totalSpent = totalSpent
    this.productName = productName
    this.amount = amount
    this.change = change
  }
}

class ResetDto {
  constructor (change) {
    this.change = change
  }
}

module.exports = { BuyDto, ResetDto }
