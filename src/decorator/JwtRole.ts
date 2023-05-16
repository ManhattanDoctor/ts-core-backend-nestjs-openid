
import { SetMetadata } from '@nestjs/common';
import * as _ from 'lodash';
import { JwtGuard } from '../guard';

export const JwtRole = (role: string | Array<string>) => SetMetadata(JwtGuard.META_ROLE, { isAny: false, role });