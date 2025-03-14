
import { Body, Controller, Post } from '@nestjs/common';
import { IOpenIdResource, OpenIdService, OpenIdResourceValidationOptions } from '@ts-core/openid-common';
import { GET_RESOURCES_URL } from '../service/proxy';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

interface IGetResourcesDto {
    token: string;
    options?: OpenIdResourceValidationOptions;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(GET_RESOURCES_URL)
export class GetResourcesController {
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
    public async execute(@Body() params: IGetResourcesDto): Promise<Array<IOpenIdResource>> {
        let item = await this.service.getResources(params.token, params.options);
        return Array.from(item.values());
    }
}
