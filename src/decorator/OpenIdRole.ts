
import { SetMetadata } from '@nestjs/common';
import * as _ from 'lodash';
import { OpenIdGuard } from '../guard';

export const OpenIdRole = (role: string | Array<string>, isAny?: boolean) => SetMetadata(OpenIdGuard.META_VALIDATE_ROLE, { role, isAny });