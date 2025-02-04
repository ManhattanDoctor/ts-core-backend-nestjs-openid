
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { OpenIdBearer, OpenIdPublic } from '../decorator';
import { VALIDATE_TOKEN_URL } from '../service/proxy';
import { IOpenIdUser, IOpenIdOfflineValidationOptions, OpenIdService } from '@ts-core/openid-common';
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

    constructor(private openid: OpenIdService) { }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Post()
    @OpenIdPublic(false)
    @UseGuards(OpenIdGuard)
    public async execute<T extends IOpenIdUser>(@Body() options: IOpenIdOfflineValidationOptions, @OpenIdBearer() bearer: IOpenIdBearer<T>): Promise<void> {
        return this.openid.validateToken(bearer.token, !_.isEmpty(options) ? options : null);
    }
}
