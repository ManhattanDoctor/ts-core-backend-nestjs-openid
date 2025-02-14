import { IDestroyable } from '@ts-core/common';
import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IOpenIdOfflineValidationOptions, IOpenIdRoleValidationOptions, IOpenIdToken, IOpenIdUser, OpenIdService } from '@ts-core/openid-common';
import { OpenIdRequestHeaderUndefinedError, OpenIdRequestUndefinedError } from '../error';
import * as _ from 'lodash';

@Injectable()
export class OpenIdGuard<T extends IOpenIdToken = IOpenIdToken, U extends IOpenIdUser = IOpenIdUser> implements CanActivate, IDestroyable {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static META_ROLE: string = 'role'
    public static META_RESOURCE: string = 'resource'
    public static META_RESOURCE_SCOPE: string = 'scope'

    public static META_IS_GET_USER_INFO: string = 'isGetUserInfo';
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

    protected async validateRole(context: ExecutionContext, token: T): Promise<void> {
        let options = this.reflector.getAllAndOverride<IOpenIdRoleValidationOptions>(OpenIdGuard.META_ROLE, [context.getClass(), context.getHandler()]);
        if (!_.isNil(options)) {
            await this.service.validateRole(token.value, options)
        }
    }

    protected async validateResource(context: ExecutionContext, token: T): Promise<void> {
        let name = this.reflector.getAllAndOverride<string>(OpenIdGuard.META_RESOURCE, [context.getClass(), context.getHandler()]);
        if (_.isNil(name)) {
            return;
        }
        let scope = this.reflector.getAllAndMerge<Array<string>>(OpenIdGuard.META_RESOURCE_SCOPE, [context.getClass(), context.getHandler()]);
        await this.service.validateResource(token.value, { name, scope });
    }

    protected async validateToken(context: ExecutionContext, token: T): Promise<void> {
        let options = this.reflector.getAllAndOverride<IOpenIdOfflineValidationOptions>(OpenIdGuard.META_OFFLINE_VALIDATION_OPTIONS, [context.getClass(), context.getHandler()]);
        await this.service.validateToken(token.value, options);
    }

    protected async getToken(context: ExecutionContext, value: string): Promise<T> {
        return { value } as T;
    }

    protected async getUserInfo(context: ExecutionContext, token: T): Promise<U> {
        let options = this.reflector.getAllAndOverride<IOpenIdOfflineValidationOptions>(OpenIdGuard.META_OFFLINE_VALIDATION_OPTIONS, [context.getClass(), context.getHandler()]);
        return this.service.getUserInfo<U>(token.value, !_.isNil(options));
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        let isSkipValidation = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_SKIP_VALIDATION, [context.getClass(), context.getHandler()]);
        let request = context.switchToHttp().getRequest();

        let token: T = null;
        try {
            token = request.token = token = await this.getToken(context, OpenIdGuard.extractFromRequest(request));
        }
        catch (error) {
            if (!isSkipValidation) {
                throw error;
            }
        }
        if (isSkipValidation) {
            return true;
        }

        await this.validateToken(context, token);
        await this.validateRole(context, token);
        await this.validateResource(context, token);

        let isGetUserInfo = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_GET_USER_INFO, [context.getClass(), context.getHandler()]);
        if (isGetUserInfo) {
            request.user = await this.getUserInfo(context, token);
        }
        return true;
    }

    public destroy(): void {
        this.service = null;
        this.reflector = null;
    }
}
