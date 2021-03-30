import * as bcrypt from 'bcryptjs'
import { Exclude } from 'class-transformer'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { UserSocialProvider } from './user-social-provider.model'
import { TeamUserRole } from './team-user-role.model'

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Exclude()
  @Column({ nullable: true })
  password: string

  @OneToMany(
    () => UserSocialProvider,
    (socialProvider: UserSocialProvider) => socialProvider.user_id,
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  social_providers: UserSocialProvider[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({ nullable: true, type: 'timestamp with time zone' })
  last_logged_in_at: Date

  @Column({ nullable: true })
  avatar_url: string

  @OneToMany(
    () => TeamUserRole,
    (teamUserRole: TeamUserRole) => teamUserRole.user,
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  team_user_roles: TeamUserRole[]

  @BeforeInsert()
  async hashPassword() {
    this.password = this.password
      ? await bcrypt.hash(this.password, bcrypt.genSaltSync(12))
      : null
  }

  @BeforeInsert()
  async generateId() {
    this.id = this.id || uuid()
  }
}
