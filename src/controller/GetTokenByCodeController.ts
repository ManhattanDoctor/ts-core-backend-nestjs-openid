
import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IOpenIdCode, IOpenIdToken, OpenIdService } from '@ts-core/openid-common';
import { GET_TOKEN_BY_CODE } from '../service/proxy';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

class OpenIdCode implements IOpenIdCode {
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
    public async execute<T extends IOpenIdToken>(@Body() params: OpenIdCode): Promise<T> {
        return this.openid.getTokenByCode<T>(params);
    }
}
