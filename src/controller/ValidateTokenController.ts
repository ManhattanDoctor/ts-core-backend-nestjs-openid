
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { IJwtBearer, JwtGuard } from '../guard';
import { JwtBearer, JwtPublic } from '../decorator';
import { VALIDATE_TOKEN } from '../service/proxy';
import { IJwtOfflineValidationOptions, OpenIdService } from '../service';
import * as _ from 'lodash';
import { IJwtUser } from '../lib';
// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(VALIDATE_TOKEN)
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
    @JwtPublic(false)
    @UseGuards(JwtGuard)
    public async execute<T extends IJwtUser>(@Body() options: IJwtOfflineValidationOptions, @JwtBearer() bearer: IJwtBearer<T>): Promise<void> {
        return this.openid.validateToken(bearer.token, !_.isEmpty(options) ? options : null);
    }
}
