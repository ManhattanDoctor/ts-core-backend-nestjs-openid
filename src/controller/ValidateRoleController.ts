
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsDefined } from 'class-validator';
import { OpenIdBearer, OpenIdPublic } from '../decorator';
import { VALIDATE_ROLE_URL } from '../service/proxy';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { IOpenIdRoleValidationOptions, IOpenIdUser, OpenIdService } from '@ts-core/openid-common';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class OpenIdRoleValidationOptions implements IOpenIdRoleValidationOptions {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isAny?: boolean;

    @ApiProperty()
    @IsDefined()
    role: string | Array<string>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(VALIDATE_ROLE_URL)
export class ValidateRoleController {
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
    public async execute<T extends IOpenIdUser>(@Body() options: OpenIdRoleValidationOptions, @OpenIdBearer() bearer: IOpenIdBearer<T>): Promise<void> {
        return this.openid.validateRole(bearer.token, options);
    }
}
