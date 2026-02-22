# Component: Logout

**File**: `src/app/pages/logout/logout.ts`
**Selector**: `app-logout`
**Route**: `/logout`

## Description
Componente encargado de manejar el callback post-logout o la acción de logout. Actualmente, realiza una redirección inmediata al home.

## Key Features
-   **Navigation**: Redirige a `/` en `ngOnInit`.
-   **Cleanup**: Contiene lógica comentada para limpiar flags de recuperación o sesión local (`oidcSecurityService.logoffLocal()`), pero actualmente solo navega.

## Source Code

### TypeScript
```typescript
export class Logout implements OnInit {
  private router = inject(Router);
  
  ngOnInit(): void {
    // Lógica comentada de limpieza...
    // this.oidcSecurityService.logoffLocal(); 

    // Navego al home
    this.router.navigateByUrl('/');
  }
}
```

### HTML
```html
<p>logout works!</p>
```