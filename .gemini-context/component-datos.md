# Component: Datos

**File**: `src/app/pages/datos/datos.ts`
**Selector**: `app-datos`
**Route**: `/datos/:sujeto/:cuenta`

## Description
Componente diseñado para visualizar parámetros recibidos por URL (Path params y Query params). Útil para probar redirecciones con datos desde otras aplicaciones.

## Key Features
-   **Route Params**: Captura `sujeto` y `cuenta` de la URL.
-   **Query Params**: Captura el parámetro `v`.
-   **UI**: Muestra los valores capturados en una `MatCard`.

## Source Code

### TypeScript
```typescript
export class Datos implements OnInit {
  sujeto = signal<string | null>(null);
  cuenta = signal<string | null>(null);
  valor = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sujeto.set(params.get('sujeto'));
      this.cuenta.set(params.get('cuenta'));
    });
    this.route.queryParamMap.subscribe(params => {
      this.valor.set(params.get('v'));
    });
  }
}
```

### HTML
```html
<mat-card>
  <mat-card-title>Datos recibidos</mat-card-title>
  <!-- Display de params -->
  Sujeto: {{ sujeto() }}
  Cuenta: {{ cuenta() }}
  Valor: {{ valor() }}
</mat-card>
```