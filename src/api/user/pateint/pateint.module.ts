import { Module } from '@nestjs/common';
import { PateintService } from './pateint.service';
import { PateintController } from './pateint.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[AuthModule],
  controllers: [PateintController],
  providers: [PateintService],
})
export class PateintModule {}
