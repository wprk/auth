import { registerAs } from '@nestjs/config'

export default registerAs('auth', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  anonymous: {
    enabled: process.env.ANONYMOUS_ENABLED || false,
  },
  google: {
    enabled: process.env.GOOGLE_ENABLED || false,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  facebook: {
    enabled: process.env.FACEBOOK_ENABLED || false,
    callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  },
}))
