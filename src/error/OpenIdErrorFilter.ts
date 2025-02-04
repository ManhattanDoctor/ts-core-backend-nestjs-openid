import { ArgumentsHost, Catch } from '@nestjs/common';
import { ExtendedErrorFilter, IExceptionFilter } from '@ts-core/backend-nestjs';
import { OpenIdError } from '@ts-core/openid-common';
import * as _ from 'lodash';

@Catch(OpenIdError)
export class OpenIdErrorFilter implements IExceptionFilter<OpenIdError> {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public instanceOf(item: any): item is OpenIdError {
        return OpenIdError.instanceOf(item);
    }

    public catch(error: OpenIdError, host: ArgumentsHost): any {
        return ExtendedErrorFilter.catch(error, host, error.status);
    }
}
