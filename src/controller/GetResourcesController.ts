
import { Body, Controller, Post } from '@nestjs/common';
import { IOpenIdResource, OpenIdService, OpenIdResourceValidationOptions, IOpenIdClaim } from '@ts-core/openid-common';
import { GET_RESOURCES_URL } from '../service/proxy';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

interface IGetResourcesDto {
    token: string;
    claim?: IOpenIdClaim;
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
        let { token, options, claim } = params;
        let item = await this.service.getResources(token, options, claim);
        return Array.from(item.values());
    }
}
