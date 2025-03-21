
import { SetMetadata } from '@nestjs/common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdResource = (name: string) => SetMetadata(OpenIdGuard.META_VALIDATE_RESOURCE, name);