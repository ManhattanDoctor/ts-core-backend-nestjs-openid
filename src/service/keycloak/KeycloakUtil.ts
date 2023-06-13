import { createVerify } from 'crypto';
import { TokenExpiredError, TokenInvalidSignatureError, TokenNotSignedError, TokenResourceForbiddenError, TokenResourceScopeForbiddenError, TokenRoleForbiddenError, TokenRoleInvalidTypeError, TokenStaleError, TokenUndefinedError, TokenWrongAudienceError, TokenWrongClientIdError, TokenWrongIssError, TokenWrongTypeError } from '../../error';
import * as _ from 'lodash';
import { KeycloakResources } from './KeycloakClient';
import { IJwtOfflineValidationOptions, IJwtResourceScopePermissionOptions, IJwtResourceValidationOptions, IJwtRoleValidationOptions } from '../IJwtOptions';
import { KeycloakToken } from './KeycloakToken';
import { IJwtUser } from '../../lib';

export class KeycloakUtil {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public static buildResourcePermission(options: IJwtResourceScopePermissionOptions): string {
        if (_.isNil(options) || _.isEmpty(options.name)) {
            return null;
        }
        if (_.isEmpty(options.scope)) {
            return options.name;
        }
        let scopes = options.scope;
        if (!_.isArray(scopes)) {
            scopes = [scopes];
        }
        return `${options.name}#${scopes.join(',')}`;
    }

    public static parseRole(role: string): IKeycloakRole {
        let array = role.split(':');
        return array.length > 1 ? { type: array[0], role: array[1] } : { type: KeycloakRole.CLIENT, role: array[0] };
    }

    /*
    public static toCamelCase<T>(item: any): T {
        return _.mapKeys(item, (value, key) => _.camelCase(key)) as T;
    }
    */

    public static async getUserInfo(token: string): Promise<IJwtUser> {
        return new KeycloakToken(token).getUserInfo();
    }

    // --------------------------------------------------------------------------
    //
    //  Validate Token
    //
    // --------------------------------------------------------------------------

    public static async validateToken(token: string, options: IJwtOfflineValidationOptions): Promise<void> {
        let item = new KeycloakToken(token);
        if (_.isNil(item)) {
            throw new TokenUndefinedError();
        }
        if (_.isNil(item.signed)) {
            throw new TokenNotSignedError();
        }
        if (item.isExpired()) {
            throw new TokenExpiredError();
        }
        if (!_.isNil(options.iss) && options.iss !== item.content.iss) {
            throw new TokenWrongIssError();
        }
        if (!_.isNil(options.type) && options.type !== item.content.typ) {
            throw new TokenWrongTypeError();
        }
        if (!_.isNil(options.notBefore) && options.notBefore > item.content.iat) {
            throw new TokenStaleError();
        }

        let audience = _.isArray(item.content.aud) ? item.content.aud : [item.content.aud];
        if (options.type === 'ID') {
            if (!audience.includes(options.clientId)) {
                throw new TokenWrongAudienceError();
            }
            if (item.content.azp && item.content.azp !== options.clientId) {
                throw new TokenWrongClientIdError();
            }
        } else if (options.isVerifyAudience) {
            if (!audience.includes(options.clientId)) {
                throw new TokenWrongAudienceError();
            }
        }
        if (!_.isNil(options.publicKey)) {
            let verify = createVerify('RSA-SHA256').update(item.signed);
            if (!verify.verify(options.publicKey, item.signature.toString('base64'), 'base64')) {
                throw new TokenInvalidSignatureError();
            }
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Role Methods
    //
    // --------------------------------------------------------------------------

    public static async validateRole(token: string, options: IJwtRoleValidationOptions): Promise<void> {
        let item = new KeycloakToken(token);
        let roles = !_.isArray(options.role) ? [options.role] : options.role;
        for (let role of roles) {
            let isHasRole = KeycloakUtil.hasRole(item, role);
            if (!options.isAny) {
                if (!isHasRole) {
                    throw new TokenRoleForbiddenError(role);
                }
            }
            else {
                if (isHasRole) {
                    return;
                }
            }
        }
    }

    public static hasRole(token: string | KeycloakToken, role: string): boolean {
        if (_.isString(token)) {
            token = new KeycloakToken(token);
        }
        let item = KeycloakUtil.parseRole(role);
        switch (item.type) {
            case KeycloakRole.REALM:
                return token.hasRealmRole(item.role);
            case KeycloakRole.CLIENT:
                return token.hasClientRole(item.role);
            default:
                throw new TokenRoleInvalidTypeError(item.type);
        }
    }

    public static async validateResourceScope(resources: KeycloakResources, options: IJwtResourceValidationOptions): Promise<void> {
        let resource = _.find(resources, { rsname: options.name });
        if (_.isNil(resource)) {
            throw new TokenResourceForbiddenError(resource);
        }
        let scopes = !_.isArray(options.scope) ? [options.scope] : options.scope;
        for (let scope of scopes) {
            let isHasScope = resource.scopes.includes(scope);
            if (!options.isAny) {
                if (!isHasScope) {
                    throw new TokenResourceScopeForbiddenError(scope);
                }
            }
            else {
                if (isHasScope) {
                    return;
                }
            }
        }
    }
}

interface IKeycloakRole {
    type: string;
    role: string;
}
enum KeycloakRole {
    REALM = 'realm',
    CLIENT = 'client',
}
