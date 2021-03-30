import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UsersResponseDto } from './dto/users.response.dto'
import { UserFindAllInput } from './dto/user.find-all.input'
import { UserResponseDto } from './dto/user.response.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async findAll(
    @Query() criteria: UserFindAllInput,
  ): Promise<UsersResponseDto> {
    return await this.userService.findAll(criteria)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/current')
  async findCurrent(@Request() req: any): Promise<UserResponseDto> {
    return await this.userService.findOne(req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return await this.userService.findOne(id)
  }
}
