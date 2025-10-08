import { Module } from '@nestjs/common';
import { ChatModule } from './post/chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './user/admin/admin.module';
import { PrismaModule } from 'src/core/prisma.module';
import { ServiceModule } from './service/service.module';
import { SpecialityModule } from './speciality/speciality.module';


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
    ServiceModule,
    SpecialityModule
  ],
  controllers: [],
})
export class AppModule { }
