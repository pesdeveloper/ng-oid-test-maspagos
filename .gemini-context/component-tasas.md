# Component: Tasas

**File**: `src/app/pages/tasas/tasas.ts`
**Selector**: `app-tasas`
**Route**: `/tasas`

## Description
Componente para consulta de tasas y deudas. Actualmente, **toda la lógica de negocio está comentada**.

## Key Features
-   **State**: Signals definidos pero no utilizados (`idSuj`, `idBie`, `data`, `loading`).
-   **Logic**: El método `load()` y la suscripción al servicio están comentados.
-   **UI**: Muestra un texto estático "TASAS OK".

## Source Code

### TypeScript
```typescript
export class Tasas implements OnInit {
  // Lógica comentada...
  // idSuj = signal<number>(1);
  // ...

  ngOnInit(): void {
    // ...
  }

  load(): void {
    // this.basic.getBasic(suj, bie).subscribe(...)
  }
}
```

### HTML
```html
<p>TASAS OK</p>
```