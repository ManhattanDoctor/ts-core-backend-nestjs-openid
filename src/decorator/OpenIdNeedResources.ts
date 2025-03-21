
import { SetMetadata, applyDecorators } from '@nestjs/common';
import { OpenIdResourceValidationOptions } from '@ts-core/openid-common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdNeedResources = (options?: OpenIdResourceValidationOptions) => {
    return applyDecorators(
        SetMetadata(OpenIdGuard.META_IS_NEED_RESOURCES, true),
        SetMetadata(OpenIdGuard.META_NEED_RESOURCES_OPTIONS, options),
    );
}