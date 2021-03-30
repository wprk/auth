import { IsString } from 'class-validator'

import { AuthRegisterInput } from './auth.register.input'

export class AuthLocalRegisterInput extends AuthRegisterInput {
  @IsString()
  password: string
}
