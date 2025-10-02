import { Module } from '@nestjs/common';
import { AdminModule } from './user/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { DoctorModule } from './user/doctor/doctor.module';
import { RedisModule } from 'src/core/redis/redis.module';

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
    DoctorModule,
    RedisModule
  ],
  controllers: [],
})
export class AppModule {}
