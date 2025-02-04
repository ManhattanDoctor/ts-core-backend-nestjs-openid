
import { Controller, Get, UseGuards } from '@nestjs/common';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { OpenIdBearer, OpenIdPublic } from '../decorator';
import { GET_USER_INFO } from '../service/proxy';
import { IOpenIdUser, OpenIdService } from '@ts-core/openid-common';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(GET_USER_INFO)
export class GetUserInfoController {
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

    @Get()
    @OpenIdPublic(false)
    @UseGuards(OpenIdGuard)
    public async execute<T extends IOpenIdUser>(@OpenIdBearer() bearer: IOpenIdBearer<T>): Promise<T> {
        return this.openid.getUserInfo<T>(bearer.token);
    }
}
