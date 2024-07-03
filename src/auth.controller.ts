import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller('auth')
export class AuthController {
  private readonly clientId: string;
  private readonly redirectUri: string;

  constructor(
    private configService: ConfigService,
    private readonly appService: AppService,
  ) {
    this.clientId = this.configService.get<string>('MERCADO_LIBRE_APP_ID');
    this.redirectUri = this.configService.get<string>(
      'MERCADO_LIBRE_REDIRECT_URI',
    );
  }

  @Get('login')
  @Redirect()
  login() {
    const authorizationUrl = `https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    return { url: authorizationUrl };
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    await this.appService.exchangeCodeForToken(code);
    return 'Authentication successful! You can now close this window.';
  }
}
