import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Token } from './token.entity';
import { TokenService } from './token.service';
import { MercadoLibreController } from './mercado-libre.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'username',
      password: 'password',
      database: 'subscriptions',
      entities: [Token],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  controllers: [MercadoLibreController],
  providers: [TokenService],
})
export class AppModule {}
