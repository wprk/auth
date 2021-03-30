import { JwtPayload } from './jwt.payload.interface'

export interface JwtAccessPayload extends JwtPayload {
  type: 'access_token'
}
