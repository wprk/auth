import { IsBoolean, IsOptional } from 'class-validator'

export class AuthTokenRefreshInput {
  @IsOptional()
  @IsBoolean()
  remember?: boolean
}
