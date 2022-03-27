const UserDto = require('../dtos/user')
const User = require('../models/user')

const registerUser = async body => {
  try {
    const newUser = await User.register(body)

    const accessToken = newUser.generateAccessToken()
    return new UserDto.UserRegistrationDto(newUser, accessToken)
  } catch (error) {
    throw error
  }
}

module.exports = { registerUser }
