import { registerAs } from '@nestjs/config'

export default registerAs('cors', () => ({
    credentials: true,
    origin: [
        process.env.SERVER_FRONTENT_HOST || 'http://localhost:3000',
    ],
}))
