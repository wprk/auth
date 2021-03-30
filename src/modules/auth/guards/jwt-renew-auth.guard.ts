import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtRenewAuthGuard extends AuthGuard('jwt_renew') {}
