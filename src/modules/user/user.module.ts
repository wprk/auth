import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User } from '../../models/user.model'
import { UserSocialProvider } from 'src/models/user-social-provider.model'

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSocialProvider])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
