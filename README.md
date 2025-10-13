# @ts-core/backend-nestjs-openid

Библиотека для интеграции OpenID Connect и JWT аутентификации в приложения NestJS.

## Описание

`@ts-core/backend-nestjs-openid` — это TypeScript библиотека, которая предоставляет полный набор инструментов для реализации аутентификации и авторизации в приложениях на основе NestJS с использованием протокола OpenID Connect и JWT токенов.

### Основные возможности

- 🔐 **Аутентификация и авторизация** - Полная поддержка OpenID Connect протокола
- 🛡️ **Валидация токенов** - Автоматическая проверка JWT токенов
- 👥 **Управление ролями** - Система ролевой авторизации
- 📋 **Контроль ресурсов** - Управление доступом к ресурсам и их областям (scope)
- 🔑 **Keycloak интеграция** - Готовая интеграция с Keycloak
- 🎯 **Декораторы** - Удобные декораторы для защиты эндпоинтов
- 🚦 **Guards** - Готовые охранники для автоматической валидации
- 📡 **Proxy сервисы** - Поддержка клиентских подключений через proxy

### Поддерживаемые провайдеры

- **Keycloak** - Полная поддержка Keycloak как провайдера OpenID Connect

## Установка

```bash
npm install @ts-core/backend-nestjs-openid
```

## Быстрый старт

### Серверная конфигурация (с Keycloak)

```typescript
import { Module } from '@nestjs/common';
import { OpenIdModule, OpenIdType } from '@ts-core/backend-nestjs-openid';

@Module({
  imports: [
    OpenIdModule.forServer({
      type: OpenIdType.KEYCLOAK,
      settings: {
        realm: 'your-realm',
        authServerUrl: 'https://your-keycloak-server',
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret'
      },
      isNeedControllers: true // Включить встроенные контроллеры
    })
  ]
})
export class AppModule {}
```

### Клиентская конфигурация

```typescript
import { Module } from '@nestjs/common';
import { OpenIdModule } from '@ts-core/backend-nestjs-openid';

@Module({
  imports: [
    OpenIdModule.forClient('https://your-auth-server')
  ]
})
export class ClientModule {}
```

## Использование

### Защита эндпоинтов

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { 
  OpenIdGuard, 
  OpenIdBearer, 
  OpenIdGetUserInfo,
  OpenIdRole,
  OpenIdResource,
  OpenIdResourceScope
} from '@ts-core/backend-nestjs-openid';

@Controller('api')
@UseGuards(OpenIdGuard)
export class ApiController {

  @Get('profile')
  @OpenIdGetUserInfo() // Получить информацию о пользователе
  async getProfile(@OpenIdBearer() bearer: any) {
    return bearer.user;
  }

  @Get('admin')
  @OpenIdRole('admin') // Требовать роль 'admin'
  async adminEndpoint() {
    return { message: 'Admin access granted' };
  }

  @Get('resource')
  @OpenIdResource('my-resource')
  @OpenIdResourceScope('read') // Требовать scope 'read' для ресурса
  async getResource() {
    return { data: 'Protected resource' };
  }
}
```

### Декораторы

#### `@OpenIdBearer()`
Извлекает bearer токен из заголовка Authorization.

#### `@OpenIdGetUserInfo()`
Автоматически получает информацию о пользователе из токена.

#### `@OpenIdRole(role: string | string[], isAny?: boolean)`
Проверяет наличие указанной роли у пользователя.

#### `@OpenIdResource(name: string)`
Проверяет доступ к указанному ресурсу.

#### `@OpenIdResourceScope(scope: string | string[])`
Проверяет наличие указанных областей доступа.

#### `@OpenIdResourcePermission(name: string, scope?: string | string[])`
Комбинированная проверка ресурса и области доступа.

#### `@OpenIdSkipValidation()`
Пропускает валидацию токена для эндпоинта.

#### `@OpenIdOfflineValidation(options)`
Настраивает параметры оффлайн валидации токена.

#### `@OpenIdNeedResources(options)`
Получает список доступных ресурсов пользователя.

## API контроллеры

Библиотека предоставляет готовые контроллеры для работы с аутентификацией:

- **GetTokenByCodeController** - Получение токена по коду авторизации
- **GetUserInfoController** - Получение информации о пользователе
- **ValidateTokenController** - Валидация токена
- **ValidateResourceController** - Валидация доступа к ресурсу
- **ValidateRoleController** - Валидация ролей
- **GetResourcesController** - Получение списка ресурсов

## Обработка ошибок

Библиотека включает специализированные фильтры ошибок:

- `OpenIdErrorFilter` - Общий фильтр для ошибок OpenID
- `OpenIdRequestErrorFilter` - Фильтр для ошибок запросов

## Типы и интерфейсы

```typescript
interface IOpenIdBearer<T, U> {
  token: T;
  user?: U;
  resources?: any;
}

interface IOpenIdModuleSettings {
  type: OpenIdType;
  settings: IKeycloakSettings;
  isNeedControllers?: boolean;
}

enum OpenIdType {
  KEYCLOAK = 'KEYCLOAK'
}
```

## Требования

- Node.js >= 16
- NestJS >= 9
- TypeScript >= 4.5

## Зависимости

- `@nestjs/swagger` - Для Swagger документации
- `@ts-core/openid-common` - Общие типы и утилиты
- `@ts-core/backend-nestjs` - Базовые компоненты NestJS

## Лицензия

ISC

## Автор

**Renat Gubaev** - renat.gubaev@gmail.com

## Репозиторий

- GitHub: [ts-core-backend-nestjs-openid](https://github.com/ManhattanDoctor/ts-core-backend-nestjs-openid)
- NPM: [@ts-core/backend-nestjs-openid](https://www.npmjs.com/package/@ts-core/backend-nestjs-openid)