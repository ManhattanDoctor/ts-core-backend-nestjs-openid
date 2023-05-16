import { ArgumentsHost, Catch } from '@nestjs/common';
import { JwtError } from './JwtError';
import * as _ from 'lodash';
import { ExtendedErrorFilter, IExceptionFilter } from '@ts-core/backend-nestjs';

@Catch(JwtError)
export class JwtErrorFilter implements IExceptionFilter<JwtError> {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public instanceOf(item: any): item is JwtError {
        return JwtError.instanceOf(item);
    }

    public catch(error: JwtError, host: ArgumentsHost): any {
        return ExtendedErrorFilter.catch(error, host, error.status);
    }
}
