import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { User } from './user.model'

@Entity('teams')
export class Team {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  owner_id: string
  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  owner: User

  @Column({ nullable: true })
  stripe_payment_plan_id: string

  @Column({ nullable: true })
  stripe_subscription_id: string

  @Column({ nullable: true, type: 'timestamp with time zone' })
  trial_start: Date

  @Column({ nullable: true, type: 'timestamp with time zone' })
  trial_end: Date

  @CreateDateColumn()
  created_at: Date

  @Column({ type: 'boolean' })
  cancelling: boolean

  @OneToMany(
    () => User,
    (user: User) => user.id,
  )
  users: User[]
}
