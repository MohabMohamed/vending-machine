module.exports = class UserDto {
  constructor (user) {
    this.username = user.username
    this.deposit = user.deposit
    this.role = user.role
  }
}
