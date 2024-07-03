import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { TokenService } from './token.service';

@Controller('mercado-libre')
export class MercadoLibreController {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private tokenService: TokenService,
  ) {
    this.clientId = this.configService.get<string>('MERCADO_LIBRE_CLIENT_ID');
    this.clientSecret = this.configService.get<string>(
      'MERCADO_LIBRE_CLIENT_SECRET',
    );
    this.redirectUri = this.configService.get<string>(
      'MERCADO_LIBRE_REDIRECT_URI',
    );
  }

  @Get('callback')
  async getToken(@Query('code') code: string, @Res() res) {
    console.log('Received authorization code:', code);

    const tokenUrl = 'https://api.mercadolibre.com/oauth/token';
    const params = {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(tokenUrl, null, { params }),
      );
      console.log('Received response from token endpoint:', response.data);
      const accessToken = response.data.access_token;

      await this.tokenService.storeToken('mercado-libre', accessToken);
      res.send('Authentication successful, you can now use the access token.');
    } catch (error) {
      console.error(
        'Error getting access token:',
        error.response?.data || error.message,
      );
      res.status(500).send('Failed to get access token.');
    }
  }

  @Get('price')
  async getPrice(@Query('product') product: string): Promise<any> {
    // This is a placeholder implementation
    return {
      Nombre: product,
      Descripción: 'Mocked Description',
      Precio: 22000,
      Imagen: 'https://mocked-image-url.com',
      URL: 'https://mocked-url.com',
    };
  }
}
