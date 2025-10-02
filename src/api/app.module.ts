import { Module } from '@nestjs/common';
import { AdminModule } from './user/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { BookDoctorTimeModule } from './book-doctor-time/book-doctor-time.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    AdminModule,
    BookDoctorTimeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
