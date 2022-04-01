const { body } = require('express-validator')
const RoleEnum = require('../../util/rolesEnum')


const PostUserRules = () => {
  return [
    body(['username', 'role'])
      .exists()
      .trim()
      .notEmpty()
      .toLowerCase(),
      
    body('role')
      .isIn([RoleEnum.seller.roleName,
            RoleEnum.buyer.roleName]),

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

const BuyRules = () => {
  return [
    body(['productId', 'amount'])
      .exists()
      .isInt()
  ]
}

module.exports = { PostUserRules, LoginUserRules, BuyRules }

