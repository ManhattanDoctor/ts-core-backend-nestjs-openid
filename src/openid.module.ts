import { DynamicModule, Type, Provider } from '@nestjs/common';
import { ExtendedError } from '@ts-core/common';
import { OpenIdService } from './service';
import { IKeycloakSettings, KeycloakService } from './service/keycloak';
import { JwtGuard } from './guard';
import { GetTokenByCodeController, ValidateResourceController, GetUserInfoController, ValidateRoleController, ValidateTokenController } from './controller';
import { OpenIdProxyService } from './service/proxy';

export class OpenIdModule {
    // --------------------------------------------------------------------------
    //
    //  For Root
    //
    // --------------------------------------------------------------------------

    public static forServer(settings: IOpenIdModuleSettings): DynamicModule {
        let providers: Array<Provider> = [JwtGuard];
        let controllers: Array<Type> = settings.isNeedControllers ? [GetTokenByCodeController, GetUserInfoController, ValidateTokenController, ValidateResourceController, ValidateRoleController] : [];

        switch (settings.type) {
            case OpenIdType.KEYCLOAK:
                providers.push({
                    provide: OpenIdService,
                    useFactory: () => new KeycloakService(settings.settings as IKeycloakSettings)
                });
                break;
            default:
                throw new ExtendedError(`Can't to create OpenId providers for "${settings.type}" type`);
        }
        return {
            global: true,
            module: OpenIdModule,
            exports: providers,
            controllers,
            providers,
        };
    }

    // --------------------------------------------------------------------------
    //
    //  For Child
    //
    // --------------------------------------------------------------------------

    public static forClient(url: string): DynamicModule {
        let providers: Array<Provider> = [
            {
                provide: OpenIdService,
                useFactory: () => new OpenIdProxyService(url)
            },
            JwtGuard
        ];
        return {
            module: OpenIdModule,
            exports: providers,
            providers,
        }
    }
}

export enum OpenIdType {
    KEYCLOAK = 'KEYCLOAK',
    IP_GATEWAY = 'IP_GATEWAY'
}

export interface IOpenIdModuleSettings {
    type: OpenIdType;
    settings: IKeycloakSettings | IIpGatewaySettings;
    isNeedControllers?: boolean;
}

export interface IIpGatewaySettings { }