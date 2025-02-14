
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdSkipValidation = () =>
    applyDecorators(
        SetMetadata(OpenIdGuard.META_IS_SKIP_VALIDATION, true),
    )