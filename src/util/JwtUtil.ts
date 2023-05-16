import { RequestHeaderUndefinedError, RequestUndefinedError } from '../error';
import * as _ from 'lodash';

export class JwtUtil {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static extractFromRequest(request: any): string {
        if (_.isNil(request)) {
            throw new RequestUndefinedError();
        }
        let headers = request.headers;
        if (_.isNil(headers)) {
            throw new RequestHeaderUndefinedError();
        }
        let authorization = headers.authorization;
        if (_.isEmpty(authorization)) {
            throw new RequestHeaderUndefinedError();
        }
        let array = authorization.split(' ');
        return array[0].toLowerCase() === 'bearer' ? array[1] : null;
    }
}
