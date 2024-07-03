import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async storeToken(service: string, accessToken: string): Promise<Token> {
    const token = new Token();
    token.service = service;
    token.accessToken = accessToken;
    return this.tokenRepository.save(token);
  }

  async getToken(service: string): Promise<Token | undefined> {
    return this.tokenRepository.findOne({
      where: { service },
      order: { createdAt: 'DESC' },
    });
  }
}
