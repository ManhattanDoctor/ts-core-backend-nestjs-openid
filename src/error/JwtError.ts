import { JwtErrorCode } from './JwtErrorCode';
import { ExtendedError } from '@ts-core/common';
import * as _ from 'lodash';

export class JwtError<T = void> extends ExtendedError<T, JwtErrorCode> {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static instanceOf(item: any): item is JwtError {
        return item instanceof JwtError || Object.values(JwtErrorCode).includes(item.code);
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(code: JwtErrorCode, public details: T, public status: number = ExtendedError.HTTP_CODE_BAD_REQUEST) {
        super('', code, details);
        this.message = this.constructor.name;
    }
}

// --------------------------------------------------------------------------
//
//  Errors
//
// --------------------------------------------------------------------------

export class RequestUndefinedError extends JwtError {
    constructor() {
        super(JwtErrorCode.REQUEST_UNDEFINED);
    }
}
export class RequestHeaderUndefinedError extends JwtError {
    constructor() {
        super(JwtErrorCode.REQUEST_HEADER_UNDEFINED);
    }
}
export class TokenUndefinedError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_UNDEFINED);
    }
}
export class TokenNotActiveError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_NOT_ACTIVE);
    }
}
export class TokenInvalidError extends JwtError<string> {
    constructor(message: string) {
        super(JwtErrorCode.TOKEN_INVALID, message);
    }
}
export class TokenInvalidSignatureError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_INVALID_SIGNATURE);
    }
}
export class TokenExpiredError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_EXPIRED);
    }
}
export class TokenNotSignedError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_NOT_SIGNED);
    }
}
export class TokenStaleError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_STALE);
    }
}
export class TokenWrongTypeError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_WRONG_TYPE);
    }
}
export class TokenWrongIssError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_WRONG_ISS);
    }
}
export class TokenWrongAudienceError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_WRONG_AUDIENCE);
    }
}
export class TokenWrongClientIdError extends JwtError {
    constructor() {
        super(JwtErrorCode.TOKEN_WRONG_CLIENT_ID);
    }
}
export class TokenRoleForbiddenError extends JwtError<string> {
    constructor(role: string) {
        super(JwtErrorCode.TOKEN_ROLE_FORBIDDEN, role, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}
export class TokenRoleInvalidTypeError extends JwtError<string> {
    constructor(type: string) {
        super(JwtErrorCode.TOKEN_ROLE_INVALID_TYPE, type);
    }
}
export class TokenResourceInvalidError extends JwtError<any> {
    constructor(details: any) {
        super(JwtErrorCode.TOKEN_RESOURCE_INVALID, details);
    }
}
export class TokenResourceForbiddenError extends JwtError<string> {
    constructor(resource: string) {
        super(JwtErrorCode.TOKEN_RESOURCE_FORBIDDEN, resource, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}
export class TokenResourceScopeForbiddenError extends JwtError<string> {
    constructor(scope: string) {
        super(JwtErrorCode.TOKEN_RESOURCE_SCOPE_FORBIDDEN, scope, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}
