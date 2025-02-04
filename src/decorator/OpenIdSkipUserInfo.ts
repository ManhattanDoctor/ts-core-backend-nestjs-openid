
import { SetMetadata } from '@nestjs/common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdSkipUserInfo = (value: boolean = true) => SetMetadata(OpenIdGuard.META_IS_SKIP_USER_INFO, value);