class UserDto {
    constructor(user) {
        this.id = user.id
        this.username = user.username
        this.deposit = user.deposit
        this.role = user.role
    }
}

class UserRegistrationDto {
    constructor(user, accessToken) {
        const userDto = new UserDto(user)
        return {
            user: userDto,
            refreshToken: user.refreshToken[0].token,
            accessToken
        }
    }
}

class UserLoginDto {
    constructor(user, refreshToken, accessToken) {
        const userDto = new UserDto(user)
        return {
            user: userDto,
            refreshToken: refreshToken,
            accessToken
        }
    }
}
class UserRefreshDto {
    constructor(user, accessToken) {
        const userDto = new UserDto(user)
        return {
            user: userDto,
            accessToken
        }
    }
}

module.exports = { UserDto, UserRegistrationDto, UserLoginDto, UserRefreshDto }