import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Team } from './team.model'
import { TeamRole } from './team-role.model'
import { User } from './user.model'

@Entity('team_user_roles')
export class TeamUserRole {
  @PrimaryColumn()
  team_id: string
  @OneToOne(() => Team, { eager: true })
  @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
  team: Team

  @PrimaryColumn({ unique: true })
  user_id: string
  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User

  @Column()
  team_role_id: string
  @OneToOne(() => TeamRole, { eager: true })
  @JoinColumn({ name: 'team_role_id', referencedColumnName: 'id' })
  team_role: TeamRole

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
