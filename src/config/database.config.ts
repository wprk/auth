import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_DATABASE || '',
  use_ssl: process.env.DATABASE_SECURE === 'true' || false,

  entities: [
      '/**/*.model{.ts,.js}'
  ],
  auto_load_entities: process.env.DATABASE_AUTO_LOAD_ENTITIES || true,
  logging: process.env.DATABASE_LOGGING || false,
}))
