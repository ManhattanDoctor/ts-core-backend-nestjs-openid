
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { OpenIdBearer, OpenIdSkipValidation } from '../decorator';
import { VALIDATE_RESOURCE_URL } from '../service/proxy';
import { IOpenIdUser, OpenIdResourceValidationOptions, OpenIdService, OpenIdTokenUndefinedError } from '@ts-core/openid-common';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(VALIDATE_RESOURCE_URL)
export class ValidateResourceController {
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
    public async execute<T extends IOpenIdUser>(@Body() options: OpenIdResourceValidationOptions, @OpenIdBearer() bearer: IOpenIdBearer<T>): Promise<void> {
        if (_.isNil(bearer.token)) {
            throw new OpenIdTokenUndefinedError();
        }
        return this.service.validateResource(bearer.token, options);
    }
}
