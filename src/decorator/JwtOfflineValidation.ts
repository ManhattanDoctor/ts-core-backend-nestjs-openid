
import { SetMetadata } from '@nestjs/common';
import { JwtGuard } from '../guard';
import { IJwtOfflineValidationOptions } from '../service';
import * as _ from 'lodash';

export const JwtOfflineValidation = (item?: IJwtOfflineValidationOptions) => SetMetadata(JwtGuard.META_OFFLINE_VALIDATION_OPTIONS, !_.isNil(item) ? item : {});