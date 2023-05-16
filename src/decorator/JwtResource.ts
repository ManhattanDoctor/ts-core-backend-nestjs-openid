
import { SetMetadata } from '@nestjs/common';
import { JwtGuard } from '../guard';
import * as _ from 'lodash';

export const JwtResource = (name: string) => SetMetadata(JwtGuard.META_RESOURCE, name);