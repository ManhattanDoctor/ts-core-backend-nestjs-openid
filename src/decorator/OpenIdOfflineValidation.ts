
import { SetMetadata } from '@nestjs/common';
import { IOpenIdOfflineValidationOptions } from '@ts-core/openid-common';
import { OpenIdGuard } from '../guard';
import * as _ from 'lodash';

export const OpenIdOfflineValidation = (item?: IOpenIdOfflineValidationOptions) => SetMetadata(OpenIdGuard.META_OFFLINE_VALIDATION_OPTIONS, !_.isNil(item) ? item : {});