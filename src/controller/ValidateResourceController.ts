
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, IsDefined } from 'class-validator';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { OpenIdBearer, OpenIdPublic } from '../decorator';
import { VALIDATE_RESOURCE } from '../service/proxy';
import { IOpenIdResourceValidationOptions, IOpenIdUser, OpenIdService } from '@ts-core/openid-common';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

class OpenIdResourceValidationOptions implements IOpenIdResourceValidationOptions {
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
    @OpenIdPublic(false)
    @UseGuards(OpenIdGuard)
    public async execute<T extends IOpenIdUser>(@Body() options: OpenIdResourceValidationOptions, @OpenIdBearer() bearer: IOpenIdBearer<T>): Promise<void> {
        return this.openid.validateResource(bearer.token, options);
    }
}
