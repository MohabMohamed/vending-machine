const unableToLogin = () => {
  return {
    code: 401,
    errors: [{ password: 'Please recheck your username and password' }]
  }
}

const existingUsername = () => {
  return {
    code: 409,
    errors: [{ email: 'There is an account with the same username' }]
  }
}

const unableToRegister = () => {
  return {
    code: 400,
    errors: ['Unable to register']
  }
}

module.exports = { unableToLogin, existingUsername, unableToRegister }
