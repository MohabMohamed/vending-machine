const Product = require('../models/product')
const { ProductDto, ProductInfoDto } = require('../dtos/product')

const insertProduct = async (body, user) => {
  const product = await Product.create({
    productName: body.productName,
    amountAvailable: body.amountAvailable,
    cost: body.cost,
    sellerId: user.id
  })

  return new ProductDto(product)
}

const getProduct = async body => {
  const product = await Product.findByPk(body.productId, { include: 'seller' })

  return new ProductInfoDto(product, product.seller.username)
}

module.exports = { insertProduct, getProduct }
