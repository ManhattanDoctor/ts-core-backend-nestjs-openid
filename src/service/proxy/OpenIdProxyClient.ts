import { isAxiosError, parseAxiosError } from '@ts-core/common';
import { IOpenIdCode, IOpenIdOfflineValidationOptions, IOpenIdRoleValidationOptions, IOpenIdToken, IOpenIdUser, OpenIdResourceValidationOptions } from '@ts-core/openid-common';
import axios from 'axios';
import * as _ from 'lodash';

export class OpenIdProxyClient {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected headers: Record<string, string>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected url: string, token: string) {
        this.headers = { Authorization: `Bearer ${token}` };
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async post<T>(url: string, body?: any): Promise<T> {
        try {
            let { data } = await axios.post<T>(`${this.url}/${url}`, body, { headers: this.headers });
            return data;
        }
        catch (error) {
            throw isAxiosError(error) ? parseAxiosError(error) : error;
        }
    }

    protected async get<T>(url: string, params?: any): Promise<T> {
        try {
            let { data } = await axios.get<T>(`${this.url}/${url}`, { headers: this.headers, params });
            return data;
        }
        catch (error) {
            throw isAxiosError(error) ? parseAxiosError(error) : error;
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getUserInfo<T extends IOpenIdUser>(): Promise<T> {
        return this.get<T>(GET_USER_INFO_URL);
    }

    public async getTokenByCode<T extends IOpenIdToken>(code: IOpenIdCode): Promise<T> {
        return this.post<T>(GET_TOKEN_BY_CODE_URL, code);
    }

    public async getTokenByRefreshToken<T extends IOpenIdToken>(token: string): Promise<T> {
        return this.post<T>(`${GET_TOKEN_BY_REFRESH_TOKEN_URL}/${token}`);
    }

    public async logoutByRefreshToken(token: string): Promise<void> {
        return this.post(`${LOGOUT_BY_REFRESH_TOKEN_URL}/${token}`);
    }

    public async validateToken(options?: IOpenIdOfflineValidationOptions): Promise<void> {
        await this.post(VALIDATE_TOKEN_URL, options);
    }

    public async validateRole(options: IOpenIdRoleValidationOptions): Promise<void> {
        await this.post(VALIDATE_ROLE_URL, options);
    }

    public async validateResource(options: OpenIdResourceValidationOptions): Promise<void> {
        await this.post(VALIDATE_RESOURCE_URL, options);
    }
}

const PREFIX = 'api/openId/';

export const GET_USER_INFO_URL = PREFIX + 'getUserInfo';
export const GET_TOKEN_BY_CODE_URL = PREFIX + 'getTokenByCode';
export const GET_TOKEN_BY_REFRESH_TOKEN_URL = PREFIX + 'getTokenByRefreshToken';
export const LOGOUT_BY_REFRESH_TOKEN_URL = PREFIX + 'logoutByRefreshToken';

export const VALIDATE_ROLE_URL = PREFIX + 'validateRole';
export const VALIDATE_TOKEN_URL = PREFIX + 'validateToken';
export const VALIDATE_RESOURCE_URL = PREFIX + 'validateResource';