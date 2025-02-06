import { IDestroyable } from '@ts-core/common';
import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IOpenIdOfflineValidationOptions, IOpenIdRoleValidationOptions, IOpenIdUser, OpenIdService } from '@ts-core/openid-common';
import * as _ from 'lodash';
import { IOpenIdBearer } from './IOpenIdBearer';
import { OpenIdRequestHeaderUndefinedError, OpenIdRequestUndefinedError } from '../error';

@Injectable()
export class OpenIdGuard<T extends IOpenIdUser = IOpenIdUser> implements CanActivate, IDestroyable {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static META_ROLE: string = 'role'
    public static META_RESOURCE: string = 'resource'
    public static META_RESOURCE_SCOPE: string = 'scope'

    public static META_IS_SKIP_USER_INFO: string = 'isSkipGetUserInfo';
    public static META_IS_SKIP_VALIDATION: string = 'isSkipValidation';
    public static META_OFFLINE_VALIDATION_OPTIONS: string = 'offlineValidationOptions';

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static extractFromRequest(request: any): string {
        if (_.isNil(request)) {
            throw new OpenIdRequestUndefinedError();
        }
        let headers = request.headers;
        if (_.isNil(headers)) {
            throw new OpenIdRequestHeaderUndefinedError();
        }
        let authorization = headers.authorization;
        if (_.isEmpty(authorization)) {
            throw new OpenIdRequestHeaderUndefinedError();
        }
        let array = authorization.split(' ');
        return array[0].toLowerCase() === 'bearer' ? array[1] : null;
    }

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

    protected async getUserInfo(context: ExecutionContext, token: string): Promise<T> {
        let options = this.reflector.getAllAndOverride<IOpenIdOfflineValidationOptions>(OpenIdGuard.META_OFFLINE_VALIDATION_OPTIONS, [context.getClass(), context.getHandler()]);
        return this.service.getUserInfo<T>(token, !_.isNil(options));
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        let isSkipValidation = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_SKIP_VALIDATION, [context.getClass(), context.getHandler()]);
        let request = context.switchToHttp().getRequest();
        try {
            request.token = OpenIdGuard.extractFromRequest(request);
        }
        catch (error) {
            if (isSkipValidation) {
                return true;
            }
            throw error;
        }
        if (isSkipValidation) {
            return true;
        }

        let { token } = request;
        await this.validateToken(context, token);
        await this.validateRole(context, token);
        await this.validateResource(context, token);

        let isSkipUserInfo = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_SKIP_USER_INFO, [context.getClass(), context.getHandler()]);
        if (!isSkipUserInfo) {
            request.user = await this.getUserInfo(context, token);
        }
        return true;
    }

    public destroy(): void {
        this.service = null;
        this.reflector = null;
    }
}
