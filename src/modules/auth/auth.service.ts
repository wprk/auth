import * as bcrypt from 'bcryptjs'
import { classToClass } from 'class-transformer'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthLocalRegisterInput } from './dto/auth.local-register.input'
import { AuthRegisterResponseDto } from './dto/auth.register.response.dto'
import { AuthSuccessDto } from './dto/auth.success.dto'
import { JwtRefreshPayload } from './interfaces/jwt.refresh.payload.interface'
import { User } from 'src/models/user.model'
import { UserService } from '../user/user.service'
import { JwtAccessPayload } from './interfaces/jwt.access.payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateToken(token: JwtRefreshPayload): Promise<any> {
    const user = await this.userService.findOneById(token.userId)

    return classToClass(user)
  }

  async validateUserWithFacebook(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const id = profile.id
    const avatar_url = null // @TODO - profile.picture.data contains the image data but needs uploading
    const email = profile.email

    const user = await this.userService.findOrCreateByProvider(
      'facebook',
      id,
      {
        avatar_url,
        email,
        email_verified: true, // Always true (can't use fb login without verifying email)
        first_name: profile.first_name || profile.name.givenName || '',
        last_name: profile.last_name || profile.name.familyName || '',
      },
      accessToken,
      refreshToken,
    )

    if (user) return user

    return null
  }

  async validateUserWithGoogle(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const id = profile.id
    const avatar_url = profile.photos[0].value || null
    const email = profile.emails[0].value
    const email_verified = profile.emails[0].verified

    const user = await this.userService.findOrCreateByProvider(
      'google',
      id,
      {
        avatar_url,
        email,
        email_verified,
        first_name: profile.name.givenName || '',
        last_name: profile.name.familyName || '',
      },
      accessToken,
      refreshToken,
    )

    if (user) return user

    return null
  }

  async validateUserWithLocal(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email)

    if (user && user.password) {
      if (await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user

        return result
      }
    }

    return null
  }

  async login(user: User, remember: boolean = false): Promise<AuthSuccessDto> {
    const payload = { remember, userId: user.id }
    const claims = await this.getHasuraClaims(user.id)

    return {
      access_token: this.getAccessToken({ ...payload, ...claims }),
      refresh_token: this.getRefreshToken(
        { ...payload, incrementId: 1 },
        remember,
      ),
    }
  }

  async loginWithProvider(
    user: User,
    remember: boolean = false,
  ): Promise<AuthSuccessDto> {
    const payload = { remember, userId: user.id }
    const claims = await this.getHasuraClaims(user.id)

    return {
      access_token: this.getAccessToken({ ...payload, ...claims }),
      refresh_token: this.getRefreshToken(
        { ...payload, incrementId: 1 },
        remember,
      ),
    }
  }

  async refreshToken(
    user: User,
    remember: boolean = false,
  ): Promise<AuthSuccessDto> {
    const payload = { remember, userId: user.id }
    const claims = await this.getHasuraClaims(user.id)

    return {
      access_token: this.getAccessToken({ ...payload, ...claims }),
      refresh_token: this.getRefreshToken(
        { ...payload, incrementId: 1 },
        remember,
      ),
    }
  }

  async register(
    newUser: AuthLocalRegisterInput,
  ): Promise<AuthRegisterResponseDto> {
    const user = await this.userService.create(newUser)

    return {
      data: user,
    }
  }

  getAccessToken = (payload: any) => {
    const finalPayload: JwtAccessPayload = { type: 'access_token', ...payload }

    return this.jwtService.sign(finalPayload, {
      expiresIn: '60s',
      secret: this.configService.get('auth.accessTokenSecret'),
    })
  }

  getRefreshToken = (payload: any, remember: boolean = false) => {
    const expiresIn = remember ? '30d' : '1d'
    const finalPayload: JwtRefreshPayload = {
      type: 'refresh_token',
      ...payload,
    }

    return this.jwtService.sign(finalPayload, {
      expiresIn,
      secret: this.configService.get('auth.refreshTokenSecret'),
    })
  }

  getHasuraClaims = async (userId: string) => {
    return {
      'https://hasura.io/jwt/claims': {
        'X-Hasura-Allowed-Roles': ['anonymous', 'user'],
        'X-Hasura-Default-Role': 'user',
        'X-Hasura-User-Id': userId,
      },
    }
  }
}
