
import { Controller, Get, UseGuards } from '@nestjs/common';
import { IJwtBearer, JwtGuard } from '../guard';
import { JwtBearer, JwtPublic } from '../decorator';
import { IJwtUser } from '../lib';
import { GET_USER_INFO } from '../service/proxy';
import { OpenIdService } from '../service';

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
    @JwtPublic(false)
    @UseGuards(JwtGuard)
    public async execute(@JwtBearer() bearer: IJwtBearer): Promise<IJwtUser> {
        return this.openid.getUserInfo(bearer.token);
    }
}
