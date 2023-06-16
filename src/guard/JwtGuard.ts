import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IJwtBearer } from './IJwtBearer';
import { IJwtOfflineValidationOptions, IJwtRoleValidationOptions, OpenIdService } from '../service';
import { JwtUtil } from '../util';
import * as _ from 'lodash';

@Injectable()
export class JwtGuard implements CanActivate {
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
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private service: OpenIdService, private reflector: Reflector) { }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async validateRole(context: ExecutionContext, token: string): Promise<void> {
        let options = this.reflector.getAllAndOverride<IJwtRoleValidationOptions>(JwtGuard.META_ROLE, [context.getClass(), context.getHandler()]);
        if (!_.isNil(options)) {
            await this.service.validateRole(token, options)
        }
    }

    protected async validateResource(context: ExecutionContext, token: string): Promise<void> {
        let name = this.reflector.getAllAndOverride<string>(JwtGuard.META_RESOURCE, [context.getClass(), context.getHandler()]);
        if (_.isNil(name)) {
            return;
        }
        let scope = this.reflector.getAllAndMerge<Array<string>>(JwtGuard.META_RESOURCE_SCOPE, [context.getClass(), context.getHandler()]);
        await this.service.validateResource(token, { name, scope });
    }

    protected async validateToken(context: ExecutionContext, token: string): Promise<void> {
        let options = this.reflector.getAllAndOverride<IJwtOfflineValidationOptions>(JwtGuard.META_OFFLINE_VALIDATION_OPTIONS, [context.getClass(), context.getHandler()]);
        await this.service.validateToken(token, options);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        let isPublic = this.reflector.getAllAndOverride<boolean>(JwtGuard.META_IS_PUBLIC, [context.getClass(), context.getHandler()]);
        let isSkipAuthentication = this.reflector.getAllAndOverride<boolean>(JwtGuard.META_IS_SKIP_AUTHENTICATION, [context.getClass(), context.getHandler()]);
        if (isPublic && isSkipAuthentication) {
            return true;
        }

        let request = <IJwtBearer>context.switchToHttp().getRequest();
        let token = request.token = JwtUtil.extractFromRequest(request);
        if (isPublic) {
            return true;
        }

        await this.validateToken(context, token);
        await this.validateRole(context, token);
        await this.validateResource(context, token);

        let isSkipUserInfo = this.reflector.getAllAndOverride<boolean>(JwtGuard.META_IS_SKIP_USER_INFO, [context.getClass(), context.getHandler()]);
        if (!isSkipUserInfo) {
            request.user = await this.service.getUserInfo(token);
        }
        return true;
    }
}
