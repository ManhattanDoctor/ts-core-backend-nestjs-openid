
import { SetMetadata } from '@nestjs/common';
import { JwtGuard } from '../guard';
import * as _ from 'lodash';

export const JwtAnyRole = (role: string | Array<string>) => SetMetadata(JwtGuard.META_ROLE, { isAny: true, role });