const UserDto = require('../dtos/user')
const User = require('../models/user')
const RefreshToken = require('../models/refreshToken')

const registerUser = async body => {
  try {
    const newUser = await User.register(body)

    const accessToken = newUser.generateAccessToken()
    return new UserDto.UserRegistrationDto(newUser, accessToken)
  } catch (error) {
    throw error
  }
}

const loginUser = async body => {
  const user = await User.findByCredentials(body.username, body.password)
  const accessToken = user.generateAccessToken()

  const refreshToken = User.generateRefreshToken()

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    role: user.role
  })

  return new UserDto.UserLoginDto(user, refreshToken, accessToken)
}

module.exports = { registerUser, loginUser }
