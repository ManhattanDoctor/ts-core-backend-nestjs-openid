
import { SetMetadata } from '@nestjs/common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdGetUserInfo = (value: boolean = true) => SetMetadata(OpenIdGuard.META_IS_GET_USER_INFO, value);