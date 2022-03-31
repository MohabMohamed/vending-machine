const { body } = require('express-validator')

const PostUserRules = () => {
  return [
    body(['username', 'role'])
      .exists()
      .trim()
      .notEmpty()
      .toLowerCase(),

    body(
      'password',
      'Password should be 8 characters long and should contain numbers and symbols'
    )
      .exists()
      .isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 0,
        minUppercase: 0
      })
  ]
}

const LoginUserRules = () => {
  return [
    body('username')
      .exists()
      .trim()
      .notEmpty()
      .toLowerCase(),

    body('password')
      .exists()
      .notEmpty()
  ]
}

module.exports = { PostUserRules, LoginUserRules }
