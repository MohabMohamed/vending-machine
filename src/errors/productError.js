const productNotFound = () => {
  return {
    code: 404,
    errors: ['product not found']
  }
}

module.exports = {
  productNotFound
}
