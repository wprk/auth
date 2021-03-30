import { IsString, IsBoolean } from 'class-validator'
import { AuthRegisterInput } from './auth.register.input'

export class AuthSocialRegisterInput extends AuthRegisterInput {
  @IsBoolean()
  email_verified: boolean

  @IsString()
  avatar_url: string
}
