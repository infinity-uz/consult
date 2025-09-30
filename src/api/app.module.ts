import { Module } from '@nestjs/common';
import { AdminModule } from './user/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
