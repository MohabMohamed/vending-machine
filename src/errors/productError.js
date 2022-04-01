const productNotFound = () => {
  return {
    code: 404,
    errors: ['product not found']
  }
}

const notEnoughAmountAvailable = () => {
  return {
    code: 400,
    errors: ['not enough amount available']
  }
}

module.exports = {
productNotFound, notEnoughAmountAvailable

}
