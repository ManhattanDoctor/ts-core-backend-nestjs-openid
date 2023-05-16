
export interface IJwtRoleValidationOptions extends IJwtRolePermissionOptions {
    isAny?: boolean;
}

export interface IJwtResourceValidationOptions extends IJwtResourceScopePermissionOptions {
    isAny?: boolean;
}

export interface IJwtOfflineValidationOptions {
    iss?: string;
    type?: string;
    notBefore?: number;
    isVerifyAudience?: boolean;

    clientId?: string;
    publicKey?: string;
}

export interface IJwtRolePermissionOptions {
    role: string | Array<string>;
}

export interface IJwtResourceScopePermissionOptions {
    name: string;
    scope: string | Array<string>;
}