
import { SetMetadata } from '@nestjs/common';
import { JwtGuard } from '../guard';
import * as _ from 'lodash';

export const JwtResourceScope = (name: string | Array<string>) => SetMetadata(JwtGuard.META_RESOURCE_SCOPE, name);