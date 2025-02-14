
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { OpenIdBearer, OpenIdSkipValidation } from '../decorator';
import { VALIDATE_TOKEN_URL } from '../service/proxy';
import { IOpenIdUser, IOpenIdOfflineValidationOptions, OpenIdService, OpenIdTokenUndefinedError, IOpenIdToken } from '@ts-core/openid-common';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(VALIDATE_TOKEN_URL)
export class ValidateTokenController {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private service: OpenIdService) { }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Post()
    @OpenIdSkipValidation()
    @UseGuards(OpenIdGuard)
    public async execute<T extends IOpenIdToken, U extends IOpenIdUser>(@Body() options: IOpenIdOfflineValidationOptions, @OpenIdBearer() bearer: IOpenIdBearer<T, U>): Promise<void> {
        if (_.isNil(bearer.token)) {
            throw new OpenIdTokenUndefinedError();
        }
        return this.service.validateToken(bearer.token.value, !_.isEmpty(options) ? options : null);
    }
}
