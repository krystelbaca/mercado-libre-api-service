import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  private accessToken: string;

  constructor(private configService: ConfigService) {}
  async exchangeCodeForToken(code: string) {
    const appId = this.configService.get<string>('MERCADO_LIBRE_APP_ID');
    const clientSecret = this.configService.get<string>(
      'MERCADO_LIBRE_CLIENT_SECRET',
    );
    const redirectUri = this.configService.get<string>(
      'MERCADO_LIBRE_REDIRECT_URI',
    );

    try {
      const response = await axios.post(
        'https://api.mercadolibre.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: appId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      console.log('Authentication response:', response.data);
      this.accessToken = response.data.access_token;
    } catch (error) {
      if (error.response) {
        console.log('Error response data', error.response.data);
      }

      console.error('Error config', error.config);
    }
  }

  async getPrice(productName: string): Promise<number> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const searchResponse = await axios.get(
      'https://api.mercadolibre.com/sites/MLM/search',
      {
        params: { q: productName },
        headers: { Authorization: `Bearer ${this.accessToken}` },
      },
    );

    const firstProduct = searchResponse.data.results[0];
    return firstProduct.price;
  }
}
