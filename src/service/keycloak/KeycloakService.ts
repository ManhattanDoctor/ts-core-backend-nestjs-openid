import { OpenIdService } from '../OpenIdService';
import { IJwtCode, IJwtToken, IJwtUser } from '../../lib';
import { IKeycloakSettings } from './IKeycloakSettings';
import { KeycloakClient } from './KeycloakClient';
import { IJwtOfflineValidationOptions, IJwtResourceScopePermissionOptions, IJwtResourceValidationOptions, IJwtRolePermissionOptions, IJwtRoleValidationOptions } from '../IJwtOptions';
import { KeycloakUtil } from './KeycloakUtil';
import * as _ from 'lodash';

export class KeycloakService extends OpenIdService {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private settings: IKeycloakSettings) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected client(token: string): KeycloakClient {
        return new KeycloakClient(this.settings, token);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getTokenByCode(code: IJwtCode): Promise<IJwtToken> {
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

    public async getUserInfo(token: string): Promise<IJwtUser> {
        return this.client(token).getUserInfo();
    }

    public async validateToken(token: string, options?: IJwtOfflineValidationOptions): Promise<void> {
        return this.client(token).validateToken(options);
    }

    public async validateRole(token: string, options: IJwtRoleValidationOptions): Promise<void> {
        return KeycloakUtil.validateRole(token, options);
    }

    public async validateResource(token: string, options: IJwtResourceValidationOptions): Promise<void> {
        return this.client(token).validateResource(options);
    }
}