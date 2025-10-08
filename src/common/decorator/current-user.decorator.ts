import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IToken } from 'src/infrastructure/token/interface';

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): IToken => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	},
);