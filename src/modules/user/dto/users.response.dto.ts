import { User } from '../../../../src/models/user.model'

export class UsersResponseDto {
  data: User[]
  page: number
  limit: number
  total: number
}
