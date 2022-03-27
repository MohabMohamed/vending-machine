const { body } = require('express-validator')

const PostUserRules = () => {
  return [
    body(['username', 'role'])
      .trim()
      .notEmpty()
      .toLowerCase(),

    body(
      'password',
      'Password should be 8 characters long and should contain numbers and symbols'
    ).isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 0,
      minUppercase: 0
    })
  ]
}

module.exports = { PostUserRules }
