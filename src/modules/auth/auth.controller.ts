import { Request as RequestType, Response as ResponseType } from 'express'
import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseGuards,
  Get,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { AuthLoginInput } from './dto/auth.login.input'
import { AuthLoginResponseDto } from './dto/auth.login.response.dto'
import { AuthLogoutResponseDto } from './dto/auth.logout.response.dto'
import { AuthRegisterResponseDto } from './dto/auth.register.response.dto'
import { AuthTokenRefreshInput } from './dto/auth.token.refresh.input'
import { AuthTokenRefreshResponseDto } from './dto/auth.token.refresh.response.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'
import { JwtRenewAuthGuard } from './guards/jwt-renew-auth.guard'
import { COOKIE_NAME } from './strategies/jwt-refresh.strategy'
import { AuthLocalRegisterInput } from './dto/auth.local-register.input'

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('auth/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Request() req: RequestType) {}

  @Get('/auth/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(
    @Request() req: any,
    @Response() res: ResponseType,
  ) {
    const { access_token } = await this.authService.loginWithProvider(req.user)
    const frontendHost = this.configService.get('server.frontend.host')

    return res.redirect(`${frontendHost}/login/callback/${access_token}`)
  }

  @Get('auth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req: RequestType) {}

  @Get('/auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Request() req: any, @Response() res: ResponseType) {
    const { access_token } = await this.authService.loginWithProvider(req.user)
    const frontendHost = this.configService.get('server.frontend.host')

    return res.redirect(`${frontendHost}/login/callback/${access_token}`)
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Body() login: AuthLoginInput,
    @Request() req: any,
    @Response() res: any,
  ): Promise<AuthLoginResponseDto> {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
      login.remember,
    )

    res.cookie(COOKIE_NAME, refresh_token, {
      httpOnly: true,
    })

    return res.send({
      data: {
        access_token,
      },
    })
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('auth/logout')
  async logout(@Response() res: any): Promise<AuthLogoutResponseDto> {
    res.cookie(COOKIE_NAME, '', {
      httpOnly: true,
    })

    return res.send({
      data: {
        success: true,
      },
    })
  }

  @Post('auth/register')
  async register(
    @Body() newUser: AuthLocalRegisterInput,
  ): Promise<AuthRegisterResponseDto> {
    return this.authService.register(newUser)
  }

  @UseGuards(JwtRenewAuthGuard)
  @Post('auth/token')
  async token(
    @Body() refresh: AuthTokenRefreshInput,
    @Request() req: any,
    @Response() res: any,
  ): Promise<AuthTokenRefreshResponseDto> {
    const { access_token, refresh_token } = await this.authService.refreshToken(
      req.user,
      refresh.remember,
    )

    res.cookie(COOKIE_NAME, refresh_token, {
      httpOnly: true,
    })

    return res.send({
      data: {
        access_token,
      },
    })
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('auth/token/refresh')
  async tokenRefresh(
    @Body() refresh: AuthTokenRefreshInput,
    @Request() req: any,
    @Response() res: any,
  ): Promise<AuthTokenRefreshResponseDto> {
    const { access_token, refresh_token } = await this.authService.refreshToken(
      req.user,
      refresh.remember,
    )

    res.cookie(COOKIE_NAME, refresh_token, {
      httpOnly: true,
    })

    return res.send({
      data: {
        access_token,
      },
    })
  }
}
