import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  RequestMethod,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { config } from 'src/config/envConfig';
import { successRes } from 'src/infrastructure/response/success';
import { IToken } from 'src/infrastructure/token/interface';
import { TokenService } from 'src/infrastructure/token/Token';
import { PrismaClient } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma.service';
import { ConfirmPhoneNumberDto } from 'src/common/dto/registerPhoneNumber-doctor.dto';
import { RedisService } from 'src/core/redis/redis.service';
import { ConfirmOtpDto } from 'src/common/dto/confirmOtp-doctor.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: TokenService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async newToken(model: keyof PrismaClient, token: string) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const user = await (this.prisma[model] as any).findUnique({
      where: { id: data?.id },
    });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }

    if (user.isActive === true) {
      throw new ForbiddenException('This user is not active');
    }
    const paylod: IToken = {
      id: user.id,
      isActive: user.is_active,
      role: user.role,
    };
    const accessToken = await this.jwt.accessToken(paylod);
    return successRes({ token: accessToken });
  }

  async signOut(
    model: keyof PrismaClient,
    token: string,
    res: Response,
    tokenKey: string,
  ) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }
    console.log(model);

    const user = await (this.prisma[model] as any).findUnique({
      where: { id: data?.id },
    });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }
    res.clearCookie(tokenKey);

    return successRes({});
  }

  generateOtp(length = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    return otp;
  }

  async sendOTP(model: keyof PrismaClient, dto: ConfirmPhoneNumberDto) {
    const { phoneNumber } = dto;
    const exists = await (this.prisma[model] as any).findUnique({
      where: { phoneNumber },
    });

    if (exists) throw new ConflictException(`Phone number alreadey exists`);

    const otp = this.generateOtp();
    await this.redis.set(phoneNumber, otp, 5);

    return successRes({
      url: `api/v1/${String(model)}/confirmOTP`,
      otp,
      requestMethod: 'POST',
    });
  }

  async confirmOtp(model: string, dto: ConfirmOtpDto) {
    const { otp, phoneNumber } = dto;
    const data = await this.redis.get<string>(phoneNumber);

    if (!data) throw new BadRequestException('otp expired') as any;

    if (otp == data) {
      await this.redis.del(phoneNumber);
      return { message: 'success', statusCode: 200 };
    }
    throw new BadRequestException('otp expired or incorect');
  }
}
