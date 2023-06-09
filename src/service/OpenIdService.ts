import { IJwtOfflineValidationOptions, IJwtResourceScopePermissionOptions, IJwtResourceValidationOptions, IJwtRolePermissionOptions, IJwtRoleValidationOptions } from "./IJwtOptions";
import { IJwtCode, IJwtToken, IJwtUser } from "../lib";

export abstract class OpenIdService {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    abstract getUserInfo<T extends IJwtUser>(token: string): Promise<T>;

    abstract getTokenByCode<T extends IJwtToken>(code: IJwtCode): Promise<T>;

    abstract hasRole(token: string, permission: IJwtRolePermissionOptions): Promise<boolean>;

    abstract hasResourceScope(token: string, permission: IJwtResourceScopePermissionOptions): Promise<boolean>;

    // --------------------------------------------------------------------------
    //
    //  Validate Methods
    //
    // --------------------------------------------------------------------------

    abstract validateRole(token: string, options: IJwtRoleValidationOptions): Promise<void>;

    abstract validateToken(token: string, options?: IJwtOfflineValidationOptions): Promise<void>;

    abstract validateResource(token: string, options: IJwtResourceValidationOptions): Promise<void>;
}