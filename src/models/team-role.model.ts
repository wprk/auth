import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Team } from './team.model'
import { User } from './user.model'

@Entity('team_roles')
export class TeamRole {
  @PrimaryColumn()
  id: string

  @Column()
  team_id: string
  @OneToOne(() => Team)
  @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
  team: Team

  @Column()
  name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column()
  updated_by: string
  @OneToOne(() => User)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updater: User
}
