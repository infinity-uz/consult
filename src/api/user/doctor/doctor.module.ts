import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { AuthModule } from '../auth/auth.module';
import { CryptoService } from 'src/infrastructure/crypto/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';

@Module({
  imports:[AuthModule],
  controllers: [DoctorController],
  providers: [DoctorService ],
})
export class DoctorModule {}
