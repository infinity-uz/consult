import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CryptoService } from 'src/infrastructure/crypto/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';

@Module({
  controllers: [AdminController],
  providers: [AdminService, CryptoService, TokenService],
})
export class AdminModule {}
