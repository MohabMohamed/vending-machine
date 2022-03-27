class UserDto {
  constructor (user) {
    this.id = user.id
    this.username = user.username
    this.deposit = user.deposit
    this.role = user.role
  }
}

class UserRegistrationDto {
  constructor (user, accessToken) {
    const userDto = new UserDto(user)
    return {
      user: userDto,
      refreshToken: user.refreshToken[0].token,
      accessToken
    }
  }
}

module.exports = { UserDto, UserRegistrationDto }
