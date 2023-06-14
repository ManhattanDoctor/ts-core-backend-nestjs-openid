
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
    public async execute<T extends IJwtUser>(@JwtBearer() bearer: IJwtBearer<T>): Promise<T> {
        return this.openid.getUserInfo<T>(bearer.token);
    }
}
