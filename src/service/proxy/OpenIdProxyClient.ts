import { isAxiosError, parseAxiosError } from '@ts-core/common';
import { IJwtCode, IJwtToken, IJwtUser } from '../../lib';
import { IJwtOfflineValidationOptions, IJwtResourceValidationOptions, IJwtRoleValidationOptions } from '../IJwtOptions';
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

    public async getUserInfo<T extends IJwtUser>(): Promise<T> {
        return this.get<T>(GET_USER_INFO);
    }

    public async getTokenByCode<T extends IJwtToken>(code: IJwtCode): Promise<T> {
        return this.post<T>(GET_TOKEN_BY_CODE, code);
    }

    public async validateToken(options?: IJwtOfflineValidationOptions): Promise<void> {
        await this.post(VALIDATE_TOKEN, options);
    }

    public async validateRole(options: IJwtRoleValidationOptions): Promise<void> {
        await this.post(VALIDATE_ROLE, options);
    }

    public async validateResource(options: IJwtResourceValidationOptions): Promise<void> {
        await this.post(VALIDATE_RESOURCE, options);
    }
}

const PREFIX = 'api/openid/';

export const GET_USER_INFO = PREFIX + 'getuserinfo';
export const GET_TOKEN_BY_CODE = PREFIX + 'gettokenbycode';

export const VALIDATE_ROLE = PREFIX + 'validaterole';
export const VALIDATE_TOKEN = PREFIX + 'validatetoken';
export const VALIDATE_RESOURCE = PREFIX + 'validateresource';