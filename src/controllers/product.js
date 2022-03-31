const Product = require('../models/product')
const { ProductDto, ProductInfoDto } = require('../dtos/product')
const productError = require('../errors/productError')
const { sequelize } = require('../models/index')
const { unAuthorized } = require('../errors/userError')
const dbError = require('../errors/dbError')
const { BaseError } = require('sequelize')

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

const deleteProduct = async (productId, sellerId) => {
  const transaction = await sequelize.transaction()
  try {
    const product = await Product.findByPk(productId, {
      transaction,
      include: 'seller'
    })

    if (!product) {
      throw productError.productNotFound()
    }

    if (sellerId !== product.seller.id) {
      throw new unAuthorized()
    }
    await Product.destroy({
      where: { id: product.id },
      transaction
    })

    await transaction.commit()

    return new ProductDto(product)
  } catch (error) {
    await transaction.rollback()

    if (error instanceof BaseError) {
      throw new dbError.unexposedDbError()
    } else {
      throw error
    }
  }
}

const updateProduct = async (productId, updatedFields, sellerId) => {
  const transaction = await sequelize.transaction()
  try {
    const product = await Product.findByPk(productId, {
      transaction
    })

    if (!product) {
      throw productError.productNotFound()
    }

    if (sellerId !== product.sellerId) {
      throw new unAuthorized()
    }
    await product.update(updatedFields)
    await transaction.commit()

    return new ProductDto(product)
  } catch (error) {
    await transaction.rollback()

    if (error instanceof BaseError) {
      throw new dbError.unexposedDbError()
    } else {
      throw error
    }
  }
}

module.exports = {
  insertProduct,
  getProduct,
  getAllProducts,
  deleteProduct,
  updateProduct
}
