import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtBearer } from '../guard';

export const JwtBearer = createParamDecorator((data: unknown, context: ExecutionContext): IJwtBearer => {
    let request = <IJwtBearer>context.switchToHttp().getRequest();
    return { user: request.user, token: request.token }
});
