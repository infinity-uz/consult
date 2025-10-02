import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { config } from 'src/config/envConfig';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    //  Agar route @Roles('public') bo'lsa — token talab qilinmaydi
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    
    if (roles?.includes('public')) return true;

    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization as string | undefined;

    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = auth.slice(7);
    try {
      const data = this.jwt.verify(token, { secret: config.TOKEN.ACCESS_KEY });
      if (data?.isActive != true) {
        throw new ForbiddenException('User is not active');
      }
      req.user = data;
      return true;
    } catch (error) {
      const errorObject = {
        statusCode: error?.response ? 403 : 401,
        error: {
          message: error?.response
            ? error?.message
            : 'Token expired or incorrect',
        },
      };
      throw new HttpException(
        errorObject.error.message,
        errorObject.statusCode,
      );
    }
  }
}
