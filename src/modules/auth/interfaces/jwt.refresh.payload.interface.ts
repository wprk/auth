import { JwtPayload } from './jwt.payload.interface'

export interface JwtRefreshPayload extends JwtPayload {
  incrementId: number
  type: 'refresh_token'
}
