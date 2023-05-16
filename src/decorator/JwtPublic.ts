
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { JwtGuard } from '../guard';
import * as _ from 'lodash';

export const JwtPublic = (isSkipAuthentication: boolean = true) =>
    applyDecorators(
        SetMetadata(JwtGuard.META_IS_PUBLIC, true),
        SetMetadata(JwtGuard.META_IS_SKIP_AUTHENTICATION, isSkipAuthentication),
    );