import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './user/admin/admin.module';
import { PrismaModule } from 'src/core/prisma.module';
import { DoctorModule } from './user/doctor/doctor.module';
import { RedisModule } from 'src/core/redis/redis.module';
import { AuthModule } from './user/auth/auth.module';
import { PateintModule } from './user/pateint/pateint.module';
import { SpecialityModule } from './post/speciality/speciality.module

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),

    WalletModule,
    BookDoctorTimeModule,
    ServiceModule,
    SpecialityModule,
    ImageModule,
    DoctorDocumentModule,
    BookDoctorModule,
    PaymentModule,
    PateintModule,

  ],
  controllers: [],
})
export class AppModule {}
