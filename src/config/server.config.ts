import { registerAs } from '@nestjs/config'

export default registerAs('server', () => ({
  host: process.env.SERVER_HOST || 'http://localhost',
  port: process.env.SERVER_PORT || 8000,
  frontend: {
    host: process.env.SERVER_FRONTENT_HOST || 'http://localhost:3000',
  },
}))
