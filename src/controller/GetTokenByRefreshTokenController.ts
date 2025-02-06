
import { Controller, Param, Post } from '@nestjs/common';
import { IOpenIdToken, OpenIdService } from '@ts-core/openid-common';
import { GET_TOKEN_REFRESH_TOKEN_URL } from '../service/proxy';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${GET_TOKEN_REFRESH_TOKEN_URL}/:token`)
export class GetTokenByRefreshTokenController {
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
    public async execute<T extends IOpenIdToken>(@Param() token: string): Promise<T> {
        return this.openid.getTokenByRefreshToken<T>(token);
    }
}
