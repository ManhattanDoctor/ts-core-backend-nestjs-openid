
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, IsDefined } from 'class-validator';
import { IOpenIdBearer, OpenIdGuard } from '../guard';
import { OpenIdBearer, OpenIdSkipValidation } from '../decorator';
import { VALIDATE_RESOURCE_URL } from '../service/proxy';
import { IOpenIdResourceValidationOptions, IOpenIdUser, OpenIdService, OpenIdTokenUndefinedError } from '@ts-core/openid-common';
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
    public isAny: boolean;

    @ApiProperty()
    @IsString()
    public name: string;

    @ApiProperty()
    @IsDefined()
    public scope: string | Array<string>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(VALIDATE_RESOURCE_URL)
export class ValidateResourceController {
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
    public async execute<T extends IOpenIdUser>(@Body() options: OpenIdResourceValidationOptions, @OpenIdBearer() bearer: IOpenIdBearer<T>): Promise<void> {
        if (_.isNil(bearer.token)) {
            throw new OpenIdTokenUndefinedError();
        }
        return this.service.validateResource(bearer.token, options);
    }
}
