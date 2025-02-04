
import { SetMetadata } from '@nestjs/common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdResourceScope = (name: string | Array<string>) => SetMetadata(OpenIdGuard.META_RESOURCE_SCOPE, name);