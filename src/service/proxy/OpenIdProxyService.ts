import { OpenIdService } from '../OpenIdService';
import { IJwtCode, IJwtToken, IJwtUser } from '../../lib';
import { IJwtOfflineValidationOptions, IJwtResourceScopePermissionOptions, IJwtResourceValidationOptions, IJwtRolePermissionOptions, IJwtRoleValidationOptions } from '../IJwtOptions';
import * as _ from 'lodash';
import { OpenIdProxyClient } from './OpenIdProxyClient';

export class OpenIdProxyService extends OpenIdService {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private url: string) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected client(token: string): OpenIdProxyClient {
        return new OpenIdProxyClient(this.url, token);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getTokenByCode<T extends IJwtToken>(code: IJwtCode): Promise<T> {
        return this.client(null).getTokenByCode(code);
    }

    public async hasRole(token: string, options: IJwtRolePermissionOptions): Promise<boolean> {
        try {
            await this.validateRole(token, options);
            return true;
        }
        catch (error) {
            return false;
        }
    }

    public async hasResourceScope(token: string, options: IJwtResourceScopePermissionOptions): Promise<boolean> {
        try {
            await this.validateResource(token, options);
            return true;
        }
        catch (error) {
            return false;
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Client Methods
    //
    // --------------------------------------------------------------------------

    public async getUserInfo<T extends IJwtUser>(token: string): Promise<T> {
        return this.client(token).getUserInfo();
    }

    public async validateToken(token: string, options?: IJwtOfflineValidationOptions): Promise<void> {
        return this.client(token).validateToken(options);
    }

    public async validateRole(token: string, options: IJwtRoleValidationOptions): Promise<void> {
        return this.client(token).validateRole(options);
    }

    public async validateResource(token: string, options: IJwtResourceValidationOptions): Promise<void> {
        return this.client(token).validateResource(options);
    }
}