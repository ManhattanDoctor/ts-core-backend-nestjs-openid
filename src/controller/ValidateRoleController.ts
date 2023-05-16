
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsDefined } from 'class-validator';
import { IJwtBearer, JwtGuard } from '../guard';
import { JwtBearer, JwtPublic } from '../decorator';
import { VALIDATE_ROLE } from '../service/proxy';
import { IJwtRoleValidationOptions, OpenIdService } from '../service';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class JwtRoleValidationOptions implements IJwtRoleValidationOptions {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isAny: boolean;

    @ApiProperty()
    @IsDefined()
    role: string | Array<string>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(VALIDATE_ROLE)
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
    @JwtPublic(false)
    @UseGuards(JwtGuard)
    public async execute(@Body() options: JwtRoleValidationOptions, @JwtBearer() bearer: IJwtBearer): Promise<void> {
        return this.openid.validateRole(bearer.token, options);
    }
}
