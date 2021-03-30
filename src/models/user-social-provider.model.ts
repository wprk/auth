import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.model'

export enum ProviderName {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

@Entity('user_social_providers')
export class UserSocialProvider {
  @PrimaryColumn()
  user_id: string
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User

  @PrimaryColumn()
  provider_name: string

  @Column()
  provider_id: string

  @Column()
  access_token: string

  @Column()
  refresh_token: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
