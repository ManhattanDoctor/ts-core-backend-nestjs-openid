
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdPublic = (isSkipAuthentication: boolean = true) =>
    applyDecorators(
        SetMetadata(OpenIdGuard.META_IS_PUBLIC, true),
        SetMetadata(OpenIdGuard.META_IS_SKIP_AUTHENTICATION, isSkipAuthentication),
    );