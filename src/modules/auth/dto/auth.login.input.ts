import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class AuthLoginInput {
  @IsString()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsBoolean()
  remember?: boolean
}
