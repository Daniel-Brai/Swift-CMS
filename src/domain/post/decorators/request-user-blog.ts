import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Blog = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const blogHeader = req.headers['X-Blog-Id'];
    if (blogHeader) {
      return blogHeader;
    }
    return null;
  },
);
