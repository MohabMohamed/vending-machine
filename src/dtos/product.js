class ProductDto {
  constructor (product) {
    this.id = product.id
    this.productName = product.productName
    this.amountAvailable = product.amountAvailable
    this.cost = product.cost
    this.sellerId = product.sellerId
  }
}

module.exports = { ProductDto }
