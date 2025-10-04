import {
  ExecutionContext,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const CookieGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    try {
      const request = context.switchToHttp().getRequest();
      const refreshToken = request.cookies[data];
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }
      return refreshToken;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // allaqachon status va message bilan
      }
      // Boshqa xatolar uchun
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  },
);
