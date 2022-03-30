const Product = require('../models/product')
const { ProductDto, ProductInfoDto } = require('../dtos/product')
const productError = require('../errors/productError')

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
  if (!product) throw new productError.productNotFound()

  return new ProductInfoDto(product, product.seller.username)
}

const getAllProducts = async body => {
  const products = await Product.findAll({ ...body, include: 'seller' })
  if (!products) throw new productError.productNotFound()

  return products.map(
    product => new ProductInfoDto(product, product.seller.username)
  )
}

module.exports = { insertProduct, getProduct, getAllProducts }
