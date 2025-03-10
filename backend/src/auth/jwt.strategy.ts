import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import { AuthService } from "./auth.service"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies["access_token"],
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<string>("JWT_SECRET"),
      ignoreExpiration: false,
    })
  }

  async validate(payload: any) {
    const user = await this.authService.validateUserByEmail(payload.email)

    if (!user) {
      throw new UnauthorizedException()
    }

    const { password: _, ...result } = user
    return user
  }
}
