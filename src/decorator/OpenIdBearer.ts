import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IOpenIdBearer } from '../guard';

export const OpenIdBearer = createParamDecorator((data: unknown, context: ExecutionContext): IOpenIdBearer => {
    let request = <IOpenIdBearer>context.switchToHttp().getRequest();
    return { user: request.user, token: request.token }
})
