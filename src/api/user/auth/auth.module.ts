import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from 'src/infrastructure/token/Token';
import { RedisModule } from 'src/core/redis/redis.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [RedisModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
