
import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
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

class JwtToken implements IJwtToken {
    @ApiProperty()
    @IsString()
    idToken: string;

    @ApiProperty()
    @IsString()
    scope: string;

    @ApiProperty()
    @IsString()
    tokenType: string;

    @ApiProperty()
    @IsNumber()
    expiresIn: number;

    @ApiProperty()
    @IsString()
    accessToken: string;

    @ApiProperty()
    @IsString()
    sessionState: string;

    @ApiProperty()
    @IsString()
    notBeforePolicy: number;

    @ApiProperty()
    @IsString()
    refreshToken: string;

    @ApiProperty()
    @IsString()
    refreshExpiresIn: number;
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
    public async execute(@Body() params: JwtCode): Promise<JwtToken> {
        return this.openid.getTokenByCode(params);
    }
}
