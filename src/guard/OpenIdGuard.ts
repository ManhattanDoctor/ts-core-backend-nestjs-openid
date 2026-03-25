import { IDestroyable } from '@ts-core/common';
import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IOpenIdClaim, IOpenIdOfflineValidationOptions, IOpenIdRoleValidationOptions, IOpenIdToken, IOpenIdUser, OpenIdResources, OpenIdResourceValidationOptions, OpenIdService } from '@ts-core/openid-common';
import { OpenIdRequestHeaderUndefinedError, OpenIdRequestUndefinedError } from '../error';
import { IOpenIdBearer } from './IOpenIdBearer';
import * as _ from 'lodash';

@Injectable()
export class OpenIdGuard<B extends IOpenIdBearer<T, U>, T extends IOpenIdToken = IOpenIdToken, U extends IOpenIdUser = IOpenIdUser> implements CanActivate, IDestroyable {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static META_VALIDATE_ROLE: string = 'validateRole'
    public static META_VALIDATE_RESOURCE: string = 'validateResource'
    public static META_VALIDATE_RESOURCE_SCOPE: string = 'validateScope'

    public static META_IS_NEED_RESOURCES: string = 'isNeedResources';
    public static META_NEED_RESOURCES_OPTIONS: string = 'needResourcesOptions';

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


    public static async getUserInfo<U extends IOpenIdUser>(service: OpenIdService, token: string, options?: IOpenIdOfflineValidationOptions): Promise<U> {
        return service.getUserInfo<U>(token, !_.isNil(options));
    }

    public static async getResources(service: OpenIdService, token: string, options?: OpenIdResourceValidationOptions, claim?: IOpenIdClaim): Promise<OpenIdResources> {
        return service.getResources(token, options, claim);
    }

    public static async validateRole(service: OpenIdService, token: string, options: IOpenIdRoleValidationOptions): Promise<void> {
        return service.validateRole(token, options);
    }

    public static async validateToken(service: OpenIdService, token: string, options?: IOpenIdOfflineValidationOptions): Promise<void> {
        return service.validateToken(token, options);
    }

    public static async validateResource(service: OpenIdService, token: string, options: OpenIdResourceValidationOptions): Promise<void> {
        return service.validateResource(token, options);
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

    protected async validateRole(context: ExecutionContext, request: B, token: T): Promise<void> {
        let targets = [context.getClass(), context.getHandler()];
        let options = this.reflector.getAllAndOverride<IOpenIdRoleValidationOptions>(OpenIdGuard.META_VALIDATE_ROLE, targets);
        if (!_.isNil(options)) {
            return OpenIdGuard.validateRole(this.service, token.value, options);
        }
    }

    protected async validateResource(context: ExecutionContext, request: B, token: T): Promise<void> {
        let targets = [context.getClass(), context.getHandler()];
        let name = this.reflector.getAllAndOverride<string>(OpenIdGuard.META_VALIDATE_RESOURCE, targets);
        if (_.isNil(name)) {
            return;
        }
        let scope = this.reflector.getAllAndMerge<Array<string>>(OpenIdGuard.META_VALIDATE_RESOURCE_SCOPE, targets);
        return OpenIdGuard.validateResource(this.service, token.value, { name, scope });
    }

    protected async validateToken(context: ExecutionContext, bearer: B, token: T): Promise<void> {
        let targets = [context.getClass(), context.getHandler()];
        let options = this.reflector.getAllAndOverride<IOpenIdOfflineValidationOptions>(OpenIdGuard.META_OFFLINE_VALIDATION_OPTIONS, targets);
        return OpenIdGuard.validateToken(this.service, token.value, options);
    }

    protected async validationComplete(context: ExecutionContext, bearer: B, token: T): Promise<void> { }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        let targets = [context.getClass(), context.getHandler()];
        let isSkipValidation = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_SKIP_VALIDATION, targets);
        let request = context.switchToHttp().getRequest();

        let token: T = null;
        try {
            token = request.token = token = await this.getToken(context, request, OpenIdGuard.extractFromRequest(request));
        }
        catch (error) {
            if (!isSkipValidation) {
                throw error;
            }
        }
        if (isSkipValidation) {
            return true;
        }

        await this.validateToken(context, request, token);
        await this.validateRole(context, request, token);
        await this.validateResource(context, request, token);

        let isGetUserInfo = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_GET_USER_INFO, targets);
        if (isGetUserInfo) {
            request.user = await this.getUserInfo(context, request, token);
        }

        let isNeedResources = this.reflector.getAllAndOverride<boolean>(OpenIdGuard.META_IS_NEED_RESOURCES, targets);
        if (isNeedResources) {
            request.resources = await this.getResources(context, request, token);
        }

        await this.validationComplete(context, request, token);
        return true;
    }

    public async getToken(context: ExecutionContext, bearer: B, value: string): Promise<T> {
        return { value } as T;
    }

    public async getUserInfo(context: ExecutionContext, bearer: B, token: T): Promise<U> {
        let targets = [context.getClass(), context.getHandler()];
        let options = this.reflector.getAllAndOverride<IOpenIdOfflineValidationOptions>(OpenIdGuard.META_OFFLINE_VALIDATION_OPTIONS, targets);
        return OpenIdGuard.getUserInfo<U>(this.service, token.value, options);
    }

    public async getResources(context: ExecutionContext, bearer: B, token: T): Promise<OpenIdResources> {
        let targets = [context.getClass(), context.getHandler()];
        let options = this.reflector.getAllAndOverride<OpenIdResourceValidationOptions>(OpenIdGuard.META_NEED_RESOURCES_OPTIONS, targets);
        return OpenIdGuard.getResources(this.service, token.value, options);
    }

    public destroy(): void {
        this.service = null;
        this.reflector = null;
    }
}
