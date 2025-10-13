import { Module } from '@nestjs/common';
import { ChatModule } from './post/chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './user/admin/admin.module';
import { PrismaModule } from 'src/core/prisma.module';
import { DoctorModule } from './user/doctor/doctor.module';
import { RedisModule } from 'src/core/redis/redis.module';
import { AuthModule } from './user/auth/auth.module';
import { PateintModule } from './user/pateint/pateint.module';
import { WalletModule } from './post/wallet/wallet.module';
import { BookDoctorTimeModule } from './post/book-doctor-time/book-doctor-time.module';
import { ServiceModule } from './post/service/service.module';
import { ImageModule } from './post/image/image.module';
import { DoctorDocumentModule } from './post/doctor-document/doctor-document.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    // user
    AdminModule,
    DoctorModule,
    PateintModule,
    // post
    BookDoctorTimeModule,
    AuthModule,
    ChatModule,
    WalletModule,
    ServiceModule,
    // ImageModule,
    DoctorDocumentModule,
    //database
    PrismaModule,
  ],
  controllers: [],
})
export class AppModule { }
