const unableToLogin = () => {
  return {
    code: 401,
    errors: [{ password: 'Please recheck your email and password' }]
  }
}

module.exports = { unableToLogin }
