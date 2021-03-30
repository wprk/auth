import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class PaginationInput {
  @Transform(parseInt)
  @IsInt()
  @IsOptional()
  @Min(0)
  limit: number = 5

  @Transform(parseInt)
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number = 1
}
