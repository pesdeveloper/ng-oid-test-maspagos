# Application Architecture

## Overview
SPA Angular con autenticación OIDC centralizada y monitoreo activo de sesión SSO mediante librería externa `mma-sso-session-guard`.

## Auth Configuration (`auth.config.ts`)
-   **Authority**: `environment.authConfig.authority` (variable según entorno).
-   **Client**: `js_maspagos_client`
-   **Flow**: Code Flow + PKCE.
-   **Redirect URL**: `window.location.origin` (Raíz).
-   **Scopes**: `openid profile email phone offline_access ingresos tramites`.
-   **Key Settings**:
    -   `issValidationOff`: `true`
    -   `strictIssuerValidationOnWellKnownRetrievalOff`: `true`
    -   `useRefreshToken`: `true`
    -   `ignoreNonceAfterRefresh`: `true`
    -   `autoUserInfo`: `true`
    -   `renewUserInfoAfterTokenRenew`: `true`
    -   `silentRenew`: `false` (Desactivado nativo de la lib OIDC, manejado por guard/recover).

## SSO Strategy (`mma-sso-session-guard`)
Se utiliza la librería `mma-sso-session-guard` configurada en `app.config.ts` para:
1.  **Monitoreo**: Ping periódico (`/api/session/ping`).
2.  **Eventos**: `pageshow`.
3.  **Recuperación**: Modo `promptNone`.
4.  **Seguridad**: Integración con Antiforgery tokens (`/antiforgery/token`, run: `beforePing`).
5.  **Inicialización**: `autoBootstrap: false` (para evitar doble inicialización con el component App).
6.  **Allowed Return URLs**: `['/datos']`.

## Security
-   **Interceptors**:
    -   `authInterceptor`: Inyecta el Access Token en peticiones a rutas seguras.
    -   `xsrfCrossSiteInterceptor`: Maneja manualmente el token XSRF (`X-XSRF-TOKEN`) para peticiones inseguras (POST, PUT, DELETE) hacia el Identity Provider, asegurando el envío de cookies cross-site.
    -   **Cookies**: `XSRF-TOKEN` (cookie), `X-XSRF-TOKEN` (header).

## Routing (`app.routes.ts`)
| Path | Component | Status | Description |
|------|-----------|--------|-------------|
| `/` | `Home` | Activo | Dashboard simple |
| `/logout` | `Logout` | Activo | Lógica de limpieza y redirección |
| `/tasas` | `Tasas` | Inactivo | (Lógica comentada) Consulta de deuda/tasas |
| `/datos/:sujeto/:cuenta` | `Datos` | Activo | Protegida por `ShieldGuard`. Visualización de parámetros de ruta y query |

## Core Services
-   **App Component**: Orquestador principal. Inicializa `AuthSessionFacade` (SSO Guard). Maneja navegación externa (Habilitaciones, User Profile).
-   **BasicService**: Consumo de datos de negocio (`/Basic/Get`).
-   **AuthSessionFacade**: Facade para interactuar con el estado de sesión y eventos SSO.

## Environments
-   **Structure**: `src/environments/`
    -   `environment.ts` (Dev)
    -   `environment.prod.ts` (Prod)