import { IOpenIdToken, IOpenIdUser, OpenIdResources } from '@ts-core/openid-common';

export interface IOpenIdBearer<T extends IOpenIdToken = IOpenIdToken, U extends IOpenIdUser = IOpenIdUser> {
    user?: U;
    token: T;
    resources?: OpenIdResources;
}