const Product = require('../models/product')
const { ProductDto } = require('../dtos/product')

const insertProduct = async (body, user) => {
  try {
    const product = await Product.create({
      productName: body.productName,
      amountAvailable: body.amountAvailable,
      cost: body.cost,
      sellerId: user.id
    })

    return new ProductDto(product)
  } catch (error) {
    throw error
  }
}

module.exports = { insertProduct }
