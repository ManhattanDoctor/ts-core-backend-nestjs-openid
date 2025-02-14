
import { Controller, Get, UseGuards } from '@nestjs/common';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { OpenIdBearer, OpenIdSkipValidation } from '../decorator';
import { GET_USER_INFO_URL } from '../service/proxy';
import { IOpenIdToken, IOpenIdUser, OpenIdService, OpenIdTokenUndefinedError } from '@ts-core/openid-common';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(GET_USER_INFO_URL)
export class GetUserInfoController {
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

    @Get()
    @OpenIdSkipValidation()
    @UseGuards(OpenIdGuard)
    public async execute<T extends IOpenIdToken, U extends IOpenIdUser>(@OpenIdBearer() bearer: IOpenIdBearer<T, U>): Promise<U> {
        if (_.isNil(bearer.token)) {
            throw new OpenIdTokenUndefinedError();
        }
        return this.service.getUserInfo<U>(bearer.token.value);
    }
}
