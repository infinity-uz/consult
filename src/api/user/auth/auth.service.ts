import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { config } from 'src/config/envConfig';
import { successRes } from 'src/infrastructure/response/success';
import { IToken } from 'src/infrastructure/token/interface';
import { TokenService } from 'src/infrastructure/token/Token';
import { PrismaClient } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: TokenService,
    private readonly prisma: PrismaService,
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
}
