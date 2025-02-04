
import { SetMetadata } from '@nestjs/common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdAnyRole = (role: string | Array<string>) => SetMetadata(OpenIdGuard.META_ROLE, { isAny: true, role });