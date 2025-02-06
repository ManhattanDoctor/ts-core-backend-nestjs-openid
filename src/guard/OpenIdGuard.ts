import { IDestroyable } from '@ts-core/common';
import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IOpenIdOfflineValidationOptions, IOpenIdRoleValidationOptions, IOpenIdUser, OpenIdService, OpenIdUtil } from '@ts-core/openid-common';
import * as _ from 'lodash';
import { IOpenIdBearer } from './IOpenIdBearer';

@Injectable()
export class OpenIdGuard<T extends IOpenIdUser = IOpenIdUser> implements CanActivate, IDestroyable {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static META_ROLE: string = 'role'
    public static META_IS_PUBLIC: string = 'isPublic';

    public static META_RESOURCE: string = 'resource'
    public static META_RESOURCE_SCOPE: string = 'scope'

    public static META_IS_SKIP_USER_INFO: string = 'isSkipGetUserInfo';
    public static META_IS_SKIP_AUTHENTICATION: string = 'isSkipAuthentication';
    public static META_OFFLINE_VALIDATION_OPTIONS: string = 'offlineValidationOptions';

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected service: OpenIdService;
    protected reflector: Reflector;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(service: OpenIdService, reflector: Reflector) {
        this.service = service;
        this.reflector = reflector;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async validateRole(context: ExecutionContext, token: string): Promise<void> {
        let options = this.reflector.getAllAndOverride<IOpenIdRoleValidationOptions>(OpenIdGuard.META_ROLE, [context.getClass(), context.getHandler()]);
        if (!_.isNil(options)) {
            await this.service.validateRole(token, options)
        }
    }

    protected async validateResource(context: ExecutionContext, token: string): Promise<void> {
        let name = this.reflector.getAllAndOverride<string>(OpenIdGuard.META_RESOURCE, [context.getClass(), context.getHandler()]);
        if (_.isNil(name)) {
            return;
        }
        let scope = this.reflector.getAllAndMerge<Array<string>>(OpenIdGuard.META_RESOURCE_SCOPE, [context.getClass(), context.getHandler()]);
        await this.service.validateResource(token, { name, scope });
    }

    protected async validateToken(context: ExecutionContext, token: string): Promise<void> {
        let options = this.reflector.getAllAndOverride<IOpenIdOfflineValidationOptions>(OpenIdGuard.META_OFFLINE_VALIDATION_OPTIONS, [context.getClass(), context.getHandler()]);
        await this.service.validateToken(token, options);
    }

    protected async getUserInfo(token: string, isOffline?: boolean): Promise<T> {
        return this.service.getUserInfo<T>(token, isOffline);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        let isPublic = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_PUBLIC, [context.getClass(), context.getHandler()]);
        let isSkipAuthentication = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_SKIP_AUTHENTICATION, [context.getClass(), context.getHandler()]);
        if (isPublic && isSkipAuthentication) {
            return true;
        }

        let request = <IOpenIdBearer>context.switchToHttp().getRequest();
        let token = request.token = OpenIdUtil.extractFromRequest(request);
        if (isPublic) {
            return true;
        }

        await this.validateToken(context, token);
        await this.validateRole(context, token);
        await this.validateResource(context, token);

        let isSkipUserInfo = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_SKIP_USER_INFO, [context.getClass(), context.getHandler()]);
        if (!isSkipUserInfo) {
            request.user = await this.getUserInfo(token);
        }
        return true;
    }

    public destroy(): void {
        this.service = null;
        this.reflector = null;
    }
}
