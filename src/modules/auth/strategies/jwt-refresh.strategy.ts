import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'

import { AuthService } from '../auth.service'

export const COOKIE_NAME = 'token'

var cookieExtractor = function(req: any): string | null {
  if (req && req.cookies) {
    return req.cookies[COOKIE_NAME] ?? null
  }

  return null
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt_refresh',
) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.refreshTokenSecret'),
    })
  }

  async validate(payload: any) {
    const user = await this.authService.validateToken(payload)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
