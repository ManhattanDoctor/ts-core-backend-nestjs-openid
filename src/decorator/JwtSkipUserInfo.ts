
import { SetMetadata } from '@nestjs/common';
import { JwtGuard } from '../guard';
import * as _ from 'lodash';

export const JwtSkipUserInfo = (value: boolean = true) => SetMetadata(JwtGuard.META_IS_SKIP_USER_INFO, value);