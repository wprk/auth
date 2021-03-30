import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthService } from '../auth.service'

@Injectable()
export class JwtRenewStrategy extends PassportStrategy(Strategy, 'jwt_renew') {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('access_token'),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.accessTokenSecret'),
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
