
import { Controller, Param, Post } from '@nestjs/common';
import { IOpenIdToken, OpenIdService } from '@ts-core/openid-common';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`test/:token`)
export class GetTokenByRefreshTokenController {
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
    public async execute<T extends IOpenIdToken>(@Param('token') token: string): Promise<T> {
        return this.service.getTokenByRefreshToken<T>(token);
    }
}
