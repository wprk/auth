import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-facebook'
import { config } from 'dotenv'

import { AuthService } from '../auth.service'
import { FacebookService } from '../facebook.service'

config()

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
    private readonly facebookService: FacebookService,
  ) {
    super({
      clientID: configService.get('auth.facebook.clientId'),
      clientSecret: configService.get('auth.facebook.clientSecret'),
      callbackURL: configService.get('auth.facebook.callbackUrl'),
      fbGraphVersion: 'v3.0',
      scope: ['email'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const account = await this.facebookService.me(accessToken)
    const user = await this.authService.validateUserWithFacebook(
      accessToken,
      refreshToken,
      {
        ...profile,
        ...account,
      },
    )

    done(null, user)
  }
}
