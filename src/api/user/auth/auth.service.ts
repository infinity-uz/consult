import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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
import { RedisService } from 'src/core/redis/redis.service';
import {
  ConfirmPhoneNumberDto,
  TypeRequest,
} from './dto/registerPhoneNumber-doctor.dto';
import { ConfirmOtpDto } from './dto/confirmOtp.dto';
import { updatePhoneNumber } from './dto/updatePhoneNumber.dto';

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

    const user = await (this.prisma[model] as any).findUnique({
      where: { id: data?.id },
    });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }
    res.clearCookie(tokenKey);

    return successRes({});
  }

  async generateOtp(phoneNumber: string, length = 6): Promise<string> {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    await this.redis.set(phoneNumber, otp, 5);

    return otp;
  }

  async sendOTP(dto: ConfirmPhoneNumberDto) {
    const { phoneNumber, model, type } = dto;

    if (type == TypeRequest.REGISTR) {
      const exists = await (this.prisma[model] as any).findUnique({
        where: { phoneNumber },
      });

      if (exists) throw new ConflictException(`Phone number already exists`);

      const data = await this.redis.get<string>(phoneNumber);

      if (data) throw new ConflictException(`You got a one-time code`);

      const otp = await this.generateOtp(phoneNumber);
      return successRes({
        url: `api/v1/auth/confirmOTP`,
        otp,
        requestMethod: 'POST',
      });
    }

    if (type == TypeRequest.SIGNIN) {
      const exists = await (this.prisma[model] as any).findUnique({
        where: { phoneNumber, isActive: true, isDeleted: false },
      });
      if (!exists)
        throw new NotFoundException(
          `No active ${model} found for this phone number.`,
        );

      const data = await this.redis.get<string>(phoneNumber);

      if (data)
        throw new ConflictException(
          `You can only send an OTP once in 5 minutes`,
        );

      const otp = await this.generateOtp(phoneNumber);
      return successRes({
        url: `api/v1/auth/confirmOTP`,
        otp,
        requestMethod: 'POST',
      });
    }

    if (type == TypeRequest.UPDATEPHNUMBER) {
      const exists = await (this.prisma[model] as any).findUnique({
        where: { phoneNumber },
      });

      if (exists) throw new ConflictException('Phone Number already exsists');

      const otp = await this.generateOtp(phoneNumber);
      return successRes({
        url: `api/v1/auth/confirmOTP`,
        otp,
        requestMethod: 'POST',
      });
    }
  }

  async verifyOtp(phoneNumber: string, otp: string) {
    const data = await this.redis.get<string>(phoneNumber);

    if (!data) throw new BadRequestException('otp expired');

    if (otp !== data) {
      throw new BadRequestException('otp expired or incorect');
    }
  }
  async confirmOtp(res: Response, dto: ConfirmOtpDto) {
    const { otp, phoneNumber, model } = dto;

    await this.verifyOtp(phoneNumber, otp);

    
    const user = await (this.prisma[model] as any).findUnique({
      where: { phoneNumber },
    });
    
    if (!user) {
      return successRes({ url: `api/v1/${model}/registr` });
    } else if (user.isActive === false || user.isDeleted == true) {
      throw new ForbiddenException(`${model.toUpperCase()} isn't active`);
    }
    
    const payload: IToken = {
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    };
    
    const accessToken = await this.jwt.accessToken(payload);
    const refreshToken = await this.jwt.refreshToken(payload);
    await this.jwt.writeCookie(res, `${model}Token`, refreshToken, 15);
    
    await this.redis.del(phoneNumber);
    
    return successRes({ token: accessToken });
  }

  async updatePhoneNumber(id: number, dto: updatePhoneNumber) {
    const { model, otp, phoneNumber } = dto;
    await this.verifyOtp(phoneNumber, otp);
    
    const updatingUser = await (this.prisma[model] as any).update({
      where: { id },
      data: { phoneNumber },
    });
    
    await this.redis.del(phoneNumber);

    return successRes(updatingUser);
  }
}
