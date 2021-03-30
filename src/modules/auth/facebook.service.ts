import { Injectable, HttpService, HttpException } from '@nestjs/common'

@Injectable()
export class FacebookService {
  constructor(private readonly httpService: HttpService) {}

  async me(accessToken: string): Promise<any> {
    const url = new URL(
      `/me?fields=first_name,last_name,email,picture.type(small)&access_token=${accessToken}`,
      'https://graph.facebook.com',
    )

    const response = await this.httpService.get(url.toString()).toPromise()

    if (response.status !== 200) {
      throw new HttpException(
        'Unable to get account details from Facebook.',
        500,
      )
    }

    return { ...response.data }
  }
}
