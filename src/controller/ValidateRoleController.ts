
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsDefined } from 'class-validator';
import { OpenIdBearer, OpenIdSkipValidation } from '../decorator';
import { VALIDATE_ROLE_URL } from '../service/proxy';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { IOpenIdRoleValidationOptions, IOpenIdUser, OpenIdService, OpenIdTokenUndefinedError } from '@ts-core/openid-common';
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
    public isAny?: boolean;

    @ApiProperty()
    @IsDefined()
    public role: string | Array<string>;
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

    constructor(private service: OpenIdService) { }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Post()
    @OpenIdSkipValidation()
    @UseGuards(OpenIdGuard)
    public async execute<T extends IOpenIdUser>(@Body() options: OpenIdRoleValidationOptions, @OpenIdBearer() bearer: IOpenIdBearer<T>): Promise<void> {
        if (_.isNil(bearer.token)) {
            throw new OpenIdTokenUndefinedError();
        }
        return this.service.validateRole(bearer.token, options);
    }
}
