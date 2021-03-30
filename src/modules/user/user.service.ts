import { classToClass } from 'class-transformer'
import { Injectable, BadRequestException, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOneOptions } from 'typeorm'

import { AuthLocalRegisterInput } from '../auth/dto/auth.local-register.input'
import { AuthRegisterInput } from '../auth/dto/auth.register.input'
import { UserFindAllInput } from './dto/user.find-all.input'
import { UsersResponseDto } from './dto/users.response.dto'
import { UserResponseDto } from './dto/user.response.dto'
import { User } from 'src/models/user.model'
import { UserSocialProvider } from 'src/models/user-social-provider.model'
import { getAsFindManyOptions } from 'src/utils/repository-find-options.util'
import { AuthSocialRegisterInput } from '../auth/dto/auth.social-register.input'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSocialProvider)
    private readonly userSocialProviderRepository: Repository<
      UserSocialProvider
    >,
  ) {}

  async create(newUser: AuthLocalRegisterInput): Promise<User> {
    if (
      (await this.userRepository.count({ where: { email: newUser.email } })) >=
      1
    ) {
      throw new BadRequestException(
        `Account already exists for ${newUser.email}.`,
      )
    }

    const user = this.userRepository.create(newUser)
    await this.userRepository.save(user)

    return classToClass(user)
  }

  async findAll(criteria: UserFindAllInput): Promise<UsersResponseDto> {
    const total = await this.userRepository.count(
      getAsFindManyOptions(criteria),
    )
    const users = await this.userRepository.find(getAsFindManyOptions(criteria))

    return {
      data: classToClass(users),
      limit: criteria.limit,
      page: criteria.page,
      total,
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } })
  }

  async findOneById(
    id: string,
    options: FindOneOptions<User> = {},
  ): Promise<User | undefined> {
    return await this.userRepository.findOne(id, options)
  }

  async findOrCreateByProvider(
    provider: string,
    id: string,
    newUser: AuthSocialRegisterInput,
    accessToken: string = '',
    refreshToken: string = '',
  ): Promise<User> {
    try {
      let userSocialProvider = await this.userSocialProviderRepository.findOne({
        where: { provider_name: provider, provider_id: id },
        relations: ['user'],
      })

      if (userSocialProvider) {
        await this.userSocialProviderRepository.update(
          {
            user_id: userSocialProvider.user_id,
            provider_name: provider,
          },
          { access_token: accessToken, refresh_token: refreshToken },
        )

        return classToClass(userSocialProvider.user)
      }

      let user: User
      const exists = await this.userRepository.count({
        where: { email: newUser.email },
      })
      if (exists && newUser.email_verified) {
        user = await this.userRepository.findOne({
          where: { email: newUser.email },
        })
      } else if (exists && !newUser.email_verified) {
        throw new HttpException(
          'An account with this email address already exists but cannot be linked.' +
            ' Please verify your email address with your social login provider.',
          422,
        )
      }
      delete newUser.email_verified

      if (!user) {
        const userObj = this.userRepository.create(newUser)
        user = await this.userRepository.save(userObj)
      }

      const userSocialProviderObj = this.userSocialProviderRepository.create({
        user_id: user.id,
        provider_name: provider,
        provider_id: id,
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      await this.userSocialProviderRepository.save(userSocialProviderObj)

      return classToClass(user)
    } catch (e) {
      console.error(e)
    }
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne(id)

    return {
      data: classToClass(user),
    }
  }
}
