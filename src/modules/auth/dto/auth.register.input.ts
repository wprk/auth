import { IsString } from 'class-validator'

export class AuthRegisterInput {
  @IsString()
  email: string

  @IsString()
  first_name: string

  @IsString()
  last_name: string
}
