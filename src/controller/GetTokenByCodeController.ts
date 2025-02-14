
import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IOpenIdCode, IOpenIdRefreshable, OpenIdService } from '@ts-core/openid-common';
import { GET_TOKEN_BY_CODE_URL } from '../service/proxy';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

class OpenIdCode implements IOpenIdCode {
    @ApiProperty()
    @IsString()
    public code: string;

    @ApiProperty()
    @IsString()
    public redirectUri: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(GET_TOKEN_BY_CODE_URL)
export class GetTokenByCodeController {
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
    public async execute<T extends IOpenIdRefreshable>(@Body() params: OpenIdCode): Promise<T> {
        return this.service.getTokenByCode<T>(params);
    }
}
