import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UsersService } from "src/users/users.service"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { LoginDto } from "./dto/login.dto"
import { Response } from "express"
import { User } from "src/users/entities/user.entity"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(loginDto.email)

    if (!user) {
      throw new UnauthorizedException("Пользователь с таким email не найден")
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password
    )

    if (!isValidPassword) {
      throw new UnauthorizedException("Неверный пароль")
    }

    const { password: _, ...result } = user

    return user
  }

  async validateUserByEmail(email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email)

    if (!user) {
      throw new UnauthorizedException("Войдите в систему или зарегистрируйтесь")
    }

    return user
  }

  async login(user: { email: string; id: number }, res: Response) {
    const payload = { email: user.email, sub: user.id }
    const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" })

    await this.usersService.updateRefreshToken(user.id, refreshToken)

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 час
    })

    const response = await this.usersService.findOneByEmail(user.email)

    if (!response) {
      throw new UnauthorizedException("Пользователь не найден")
    }

    return res.json({ message: "Успешный вход", user: response })
  }

  async refreshToken(token: RefreshTokenDto) {
    try {
      const decoded = this.jwtService.verify(token.refresh_token)
      const user = await this.usersService.findOneByEmail(decoded.email)

      if (!user || user.refreshToken !== token.refresh_token) {
        throw new UnauthorizedException("Неверный refresh token")
      }

      const newAccessToken = this.jwtService.sign(
        { email: user.email, sub: user.id },
        { expiresIn: "1h" }
      )

      return { access_token: newAccessToken }
    } catch (error) {
      throw new UnauthorizedException("Недействительный refresh token")
    }
  }
}
