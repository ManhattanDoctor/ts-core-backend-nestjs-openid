import { IOpenIdUser } from '@ts-core/openid-common';

export interface IOpenIdBearer<T extends IOpenIdUser = IOpenIdUser> {
    user?: T;
    token: string;
}