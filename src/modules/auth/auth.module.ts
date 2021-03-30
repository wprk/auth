import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module, HttpModule } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { FacebookService } from './facebook.service'
import { FacebookStrategy } from './strategies/facebook.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { JwtRenewStrategy } from './strategies/jwt-renew.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.accessTokenSecret'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UserModule,
  ],
  providers: [
    AuthService,
    FacebookService,
    FacebookStrategy,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtRenewStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
