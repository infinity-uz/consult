import { Module } from '@nestjs/common';
import { AdminModule } from './user/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma.module';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';

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
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
