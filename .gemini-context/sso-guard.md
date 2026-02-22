# SSO Session Guard Strategy

**Type**: External Library (`mma-sso-session-guard`)
**Configured In**: `src/app/app.config.ts` (provider) & `src/app/app.ts` (initialization)

## Overview
La aplicación delega el monitoreo de sesión y la lógica de "Single Sign-On" (SSO) activo a la librería `mma-sso-session-guard`. Esta librería se encarga de verificar que la sesión en el Identity Provider (IdP) siga activa y, de ser necesario, intenta recuperarla o cerrar la sesión local.

## Configuration (`app.config.ts`)
Se utiliza `provideSsoSessionGuard` con la siguiente configuración:

```typescript
provideSsoSessionGuard({
  appNs: 'maspagos',
  pingPath: '/api/session/ping',
  minIntervalMs: 5000,
  events: ['pageshow'],
  onlyWhenAuthenticated: false,
  recoverMode: 'promptNone',
  forceLoginIfNoIdpSession: false,
  logPrefix: 'MASPAGOS-SSO',
  defaultLogLevel: SimpleLogLevel.Debug,
  antiforgery: {
    enabled: true,
    path: '/antiforgery/token',
    run: 'beforePing',
  },
  allowedReturnUrlPrefixes: [ '/datos' ],      
})
```

## Initialization & Bootstrap (`App.ngOnInit`)

En `src/app/app.ts`, se inyecta `AuthSessionFacade` y se inicia:

```typescript
// 0) bootstrap del facade
this.auth.bootstrap();
```

## State Management
El componente `App` se suscribe a `this.auth.state$` para reaccionar a cambios en la sesión:
- `isAuthenticated`
- `accessToken` / `accessPayload`
- `idToken` / `idPayload`
- `userInfo`

## Key Behaviors
-   **Antiforgery**: El guard recupera el token XSRF antes de hacer ping.
-   **Refresh**: Se expone un método manual `refreshSession()` que invoca `this.auth.refresh()`.
-   **Logout**: Se maneja a través de `this.auth.logout()`.