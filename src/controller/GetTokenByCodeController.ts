
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
    public async execute<T extends IJwtToken>(@Body() params: JwtCode): Promise<T> {
        return this.openid.getTokenByCode<T>(params);
    }
}
