
import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IJwtCode, IJwtToken } from '../lib';
import { GET_TOKEN_BY_CODE } from '../service/proxy';
import { OpenIdService } from '../service';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

class JwtCode implements IJwtCode {
    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsString()
    redirectUri: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(GET_TOKEN_BY_CODE)
export class GetTokenByCodeController {
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
    public async execute(@Body() params: JwtCode): Promise<IJwtToken> {
        return this.openid.getTokenByCode(params);
    }
}
