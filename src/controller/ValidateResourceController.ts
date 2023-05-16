
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, IsDefined } from 'class-validator';
import { IJwtBearer, JwtGuard } from '../guard';
import { JwtBearer, JwtPublic } from '../decorator';
import { VALIDATE_RESOURCE } from '../service/proxy';
import { IJwtResourceValidationOptions, OpenIdService } from '../service';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

class JwtResourceValidationOptions implements IJwtResourceValidationOptions {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isAny: boolean;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsDefined()
    scope: string | Array<string>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(VALIDATE_RESOURCE)
export class ValidateResourceController {
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
    @JwtPublic(false)
    @UseGuards(JwtGuard)
    public async execute(@Body() options: JwtResourceValidationOptions, @JwtBearer() bearer: IJwtBearer): Promise<void> {
        return this.openid.validateResource(bearer.token, options);
    }
}
