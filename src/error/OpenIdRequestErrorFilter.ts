import { ArgumentsHost, Catch } from '@nestjs/common';
import { ExtendedErrorFilter, IExceptionFilter } from '@ts-core/backend-nestjs';
import { OpenIdRequestError } from './OpenIdRequestError';
import * as _ from 'lodash';

@Catch(OpenIdRequestError)
export class OpenIdRequestErrorFilter implements IExceptionFilter<OpenIdRequestError> {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public instanceOf(item: any): item is OpenIdRequestError {
        return OpenIdRequestError.instanceOf(item);
    }

    public catch(error: OpenIdRequestError, host: ArgumentsHost): any {
        return ExtendedErrorFilter.catch(error, host, error.status);
    }
}
