import { ExtendedError } from "@ts-core/common";
import { OpenIdRequestErrorCode } from "./OpenIdRequestErrorCode";

export class OpenIdRequestError extends ExtendedError<void, OpenIdRequestErrorCode> {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static instanceOf(item: any): item is OpenIdRequestError {
        return item instanceof OpenIdRequestError || Object.values(OpenIdRequestErrorCode).includes(item.code);
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(code: OpenIdRequestErrorCode, public status: number = ExtendedError.HTTP_CODE_BAD_REQUEST) {
        super('', code);
        this.message = this.constructor.name;
    }
}

export class OpenIdRequestUndefinedError extends OpenIdRequestError {
    constructor() {
        super(OpenIdRequestErrorCode.REQUEST_UNDEFINED);
    }
}
export class OpenIdRequestHeaderUndefinedError extends OpenIdRequestError {
    constructor() {
        super(OpenIdRequestErrorCode.REQUEST_HEADER_UNDEFINED, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}