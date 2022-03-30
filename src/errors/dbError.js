const unexposedDbError = () => {
  return {
    code: 500,
    errors: ['something wrong happened please try again later']
  }
}

module.exports = { unexposedDbError }
