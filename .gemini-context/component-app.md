# Component: App

**File**: `src/app/app.ts`
**Selector**: `app-root`

## Description
Componente raíz de la aplicación. Implementa la UI principal con Material Design (Toolbar, Cards, Expansion Panels). Gestiona la visualización del estado de autenticación y los tokens (JWT) mediante `AuthSessionFacade`.

## Key Features
-   **Auth State**: Muestra si el usuario está autenticado, tokens decodificados y UserInfo.
-   **SSO Integration**: Inicializa `AuthSessionFacade` en `ngOnInit`.
-   **Navigation**: Botones para ir a Habilitaciones (`environment.externalSites.habilitacionesSite`) o al perfil de usuario.
-   **Utils**: Funciones para copiar tokens al portapapeles (`copy`, `copyJson`).

## Source Code

### TypeScript
```typescript
@Component({ ... })
export class App implements OnInit, OnDestroy {
  // Signals para estado reactivo
  clientLabel = signal('...');
  isAuthenticated = signal(false);
  config = signal<Partial<OpenIdConfiguration>>({});
  accessToken = signal<string>('');
  accessPayload = signal<any | null>(null);
  idToken = signal<string>('');
  idPayload = signal<any | null>(null);
  userInfo = signal<any | null>(null);
  userInfoLoadedAt = signal<Date | null>(null);
  // ...

  ngOnInit(): void {
    this.subs.push(
      this.auth.state$.subscribe((s: AuthSessionState) => {
        // Actualiza signals con el estado de la sesión
      })
    );

    // ✅ bootstrap al final
    void this.auth.bootstrapOnce().catch(() => {});
  }
  
  // Actions
  login() { this.auth.login(); }
  logout() { this.auth.logout(); }
  refreshSession() { ... }
}
```

### HTML Structure
-   **Toolbar**: Muestra el nombre del cliente/app.
-   **Auth Card**:
    -   Si está autenticado: Botones de Logout, Ver Token, Perfil, Refresh, Volver.
    -   Si no: Botón de Login.
-   **Expansion Panels**:
    -   Configuration loaded.
    -   Access Token (decoded) + Copy buttons.
    -   ID Token (decoded) + Copy buttons.
    -   UserInfo + Refresh button.
-   **Router Outlet**: Renderiza las páginas (`Home`, `Datos`, `Tasas`, etc.).
