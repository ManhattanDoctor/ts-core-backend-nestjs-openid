import { OpenIdProxyClient } from './OpenIdProxyClient';
import { IOpenIdOfflineValidationOptions, IOpenIdResourceScopePermissionOptions, IOpenIdResourceValidationOptions, IOpenIdRolePermissionOptions, IOpenIdRoleValidationOptions, IOpenIdCode, IOpenIdToken, IOpenIdUser, OpenIdService } from '@ts-core/openid-common';
import * as _ from 'lodash';

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

    public async getTokenByCode<T extends IOpenIdToken>(code: IOpenIdCode): Promise<T> {
        return this.client(null).getTokenByCode(code);
    }

    public async getTokenByRefreshToken<T extends IOpenIdToken>(token: string): Promise<T> {
           return this.client(null).getTokenByRefreshToken(token);
    }

    public async logoutByRefreshToken(token: string): Promise<void> {
           return this.client(null).logoutByRefreshToken(token);
    }

    public async hasRole(token: string, options: IOpenIdRolePermissionOptions): Promise<boolean> {
        try {
            await this.validateRole(token, options);
            return true;
        }
        catch (error) {
            return false;
        }
    }

    public async hasResourceScope(token: string, options: IOpenIdResourceScopePermissionOptions): Promise<boolean> {
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

    public async getUserInfo<T extends IOpenIdUser>(token: string): Promise<T> {
        return this.client(token).getUserInfo();
    }

    public async validateToken(token: string, options?: IOpenIdOfflineValidationOptions): Promise<void> {
        return this.client(token).validateToken(options);
    }

    public async validateRole(token: string, options: IOpenIdRoleValidationOptions): Promise<void> {
        return this.client(token).validateRole(options);
    }

    public async validateResource(token: string, options: IOpenIdResourceValidationOptions): Promise<void> {
        return this.client(token).validateResource(options);
    }
}