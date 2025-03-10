import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { AccessTokenResponseDto } from "./dto/access-token-response.dto"
import { LoginResponseDto } from "./dto/login-response.dto"
import { LoginDto } from "./dto/login.dto"
import { Response } from "express"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"
import { UsersService } from "src/users/users.service"

export interface AuthRequest extends Request {
  user: { id: number; email: string }
}

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async me(@Req() req: AuthRequest) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Пользователь не найден")
    }

    return this.usersService.findOne(req.user.id)
  }

  @Post("login")
  @ApiOperation({ summary: "Вход в систему" })
  @ApiResponse({
    status: 200,
    description: "Успешный вход",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: "Неверные учетные данные" })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(loginDto)

    if (!user) {
      throw new UnauthorizedException("Неверные учётные данные")
    }

    return this.authService.login(user, res)
  }

  @Post("logout")
  @ApiOperation({ summary: "Выход из системы" })
  @ApiResponse({
    status: 200,
    description: "Успешный выход",
  })
  @UseGuards(AuthGuard("jwt"))
  async logout(@Req() req: AuthRequest, @Res() res: Response) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Пользователь не найден")
    }

    const userId = req.user.id
    await this.usersService.updateRefreshToken(userId, null)

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })

    return res.status(200).json({ message: "Вы успешно вышли из системы" })
  }

  @Post("refresh")
  @ApiOperation({ summary: "Обновление токена" })
  @ApiResponse({
    status: 200,
    description: "Новый access token",
    type: AccessTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: "Refresh token недействителен" })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto)
  }
}
