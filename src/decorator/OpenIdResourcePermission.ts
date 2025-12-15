
import { SetMetadata, applyDecorators } from '@nestjs/common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdResourcePermission = (name: string, scope?: string | Array<string>) => {
    return applyDecorators(
        SetMetadata(OpenIdGuard.META_VALIDATE_RESOURCE, name),
        SetMetadata(OpenIdGuard.META_VALIDATE_RESOURCE_SCOPE, scope),
    );
}