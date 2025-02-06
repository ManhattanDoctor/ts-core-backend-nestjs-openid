import { DynamicModule, Type, Provider } from '@nestjs/common';
import { ExtendedError } from '@ts-core/common';
import { GetTokenByCodeController, GetTokenByRefreshTokenController, ValidateResourceController, GetUserInfoController, ValidateRoleController, ValidateTokenController } from './controller';
import { OpenIdProxyService } from './service/proxy';
import { OpenIdGuard } from './guard';
import { OpenIdService, KeycloakService, IKeycloakSettings } from '@ts-core/openid-common';
import { OPEN_ID_SETTINGS } from './OpenIdSettings';

export class OpenIdModule {
    // --------------------------------------------------------------------------
    //
    //  For Root
    //
    // --------------------------------------------------------------------------

    public static forServer(settings: IOpenIdModuleSettings): DynamicModule {
        let providers: Array<Provider> = [
            {
                provide: OPEN_ID_SETTINGS,
                useValue: settings.settings
            },
            OpenIdGuard
        ];
        let controllers: Array<Type> = settings.isNeedControllers ? [GetTokenByCodeController, GetTokenByRefreshTokenController, GetUserInfoController, ValidateTokenController, ValidateResourceController, ValidateRoleController] : [];

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
            OpenIdGuard
        ];
        return {
            module: OpenIdModule,
            exports: providers,
            providers,
        }
    }
}

export enum OpenIdType {
    KEYCLOAK = 'KEYCLOAK'
}


export interface IOpenIdModuleSettings {
    type: OpenIdType;
    settings: IKeycloakSettings;
    isNeedControllers?: boolean;
}