import { Module } from '@nestjs/common';
import { BookDoctorTimeService } from './book-doctor-time.service';
import { BookDoctorTimeController } from './book-doctor-time.controller';
import { PrismaModule } from 'src/core/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [BookDoctorTimeController],
  providers: [BookDoctorTimeService],
})
export class BookDoctorTimeModule {}
