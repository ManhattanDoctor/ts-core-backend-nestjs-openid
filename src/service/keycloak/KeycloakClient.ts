import { ExtendedError, isAxiosError, parseAxiosError } from '@ts-core/common';
import { IJwtCode, IJwtToken, IJwtUser } from '../../lib';
import { TokenNotActiveError, TokenResourceForbiddenError, TokenResourceInvalidError } from '../../error';
import { IKeycloakSettings } from './IKeycloakSettings';
import { KeycloakUtil } from './KeycloakUtil';
import { IJwtOfflineValidationOptions, IJwtResourceScopePermissionOptions, IJwtResourceValidationOptions } from '../IJwtOptions';
import axios from 'axios';
import * as _ from 'lodash';

export class KeycloakClient {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected settings: IKeycloakSettings, protected token?: string) { }

    // --------------------------------------------------------------------------
    //
    //  Help Methods
    //
    // --------------------------------------------------------------------------

    protected async post<T>(url: string, body?: any, headers?: any): Promise<T> {
        try {
            let { data } = await axios.post<T>(this.getUrl(url), new URLSearchParams(body), { headers });
            return data;
        }
        catch (error) {
            throw isAxiosError(error) ? parseAxiosError(error) : error;
        }
    }

    protected async get<T>(url: string, params?: any, headers?: any): Promise<T> {
        try {
            let { data } = await axios.get<T>(this.getUrl(url), { params, headers });
            return data;
        }
        catch (error) {
            throw isAxiosError(error) ? parseAxiosError(error) : error;
        }
    }

    protected getUrl(endpoint: string): string {
        return `${this.settings.url}/realms/${this.settings.realm}/protocol/openid-connect/${endpoint}`;
    }

    protected getResources(options: IJwtResourceScopePermissionOptions): Promise<KeycloakResources> {
        let data = {
            audience: this.settings.clientId,
            grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
            permission: KeycloakUtil.buildResourcePermission(options),
            response_mode: 'permissions',
        };
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${this.token}`
        }
        if (_.isEmpty(data.permission)) {
            delete data.permission;
        }
        return this.post<KeycloakResources>(`token`, data, headers);
    }

    // --------------------------------------------------------------------------
    //
    //  Validation Methods
    //
    // --------------------------------------------------------------------------

    protected async validateOnline(): Promise<void> {
        let data = {
            token: this.token,
            token_type_hint: 'requesting_party_token'
        };
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.settings.clientId}:${this.settings.clientSecret}`).toString('base64')}`
        }

        let { active } = await this.post<any>(`token/introspect`, data, headers);
        if (!active) {
            throw new TokenNotActiveError();
        }
    }

    protected async validateOffline(options: IJwtOfflineValidationOptions): Promise<void> {
        if (_.isNil(options.clientId)) {
            options.clientId = this.settings.clientId;
        }
        if (_.isNil(options.publicKey)) {
            options.publicKey = this.settings.realmPublicKey;
        }
        return KeycloakUtil.validateToken(this.token, options);
    }

    // --------------------------------------------------------------------------
    //
    //  Endpoint Methods
    //
    // --------------------------------------------------------------------------

    public async getUserInfo<T extends IJwtUser>(): Promise<T> {
        // return this.get(`userinfo`, null, { 'Authorization': `Bearer ${this.token}` });
        return KeycloakUtil.getUserInfo<T>(this.token);
    }

    public async getTokenByCode<T extends IJwtToken>(code: IJwtCode): Promise<T> {
        let data = {
            code: code.code,
            client_id: this.settings.clientId,
            grant_type: 'authorization_code',
            redirect_uri: code.redirectUri,
            client_secret: this.settings.clientSecret,
        };
        return this.post<T>('token', data);
    }

    public async validateToken(options?: IJwtOfflineValidationOptions): Promise<void> {
        return !_.isNil(options) ? this.validateOffline(options) : this.validateOnline();
    }

    public async validateResource(options: IJwtResourceValidationOptions): Promise<void> {
        let resources: KeycloakResources = null;
        try {
            resources = await this.getResources(options);
        }
        catch (error) {
            switch (error.code) {
                case ExtendedError.HTTP_CODE_BAD_REQUEST:
                    throw new TokenResourceInvalidError(error.details);
                case ExtendedError.HTTP_CODE_FORBIDDEN:
                    throw new TokenResourceForbiddenError(KeycloakUtil.buildResourcePermission(options));
                default:
                    throw error;
            }
        }
        await KeycloakUtil.validateResourceScope(resources, options);
    }
}

export type KeycloakResources = Array<IKeycloakResource>;

interface IKeycloakResource {
    rsid: string;
    rsname: string;
    scopes: Array<string>;
}