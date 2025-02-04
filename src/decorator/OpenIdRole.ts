
import { SetMetadata } from '@nestjs/common';
import * as _ from 'lodash';
import { OpenIdGuard } from '../guard';

export const OpenIdRole = (role: string | Array<string>) => SetMetadata(OpenIdGuard.META_ROLE, { isAny: false, role });