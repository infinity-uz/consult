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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    RedisModule,
    AdminModule,
    DoctorModule,
    AuthModule,
    ChatModule,
    PateintModule,

  ],
  controllers: [],
})
export class AppModule {}
