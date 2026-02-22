# Service: BasicService

**File**: `src/app/core/services/basic.service.ts`

## Description
Servicio para consumir la API de backend "Basic".

## API Endpoints
-   `GET /Basic/Get`
    -   **Params**: `id_suj`, `id_bie`
    -   **Base URL**: `https://sb-comon-api.malvinasargentinas.gob.ar`

## Models (`basic.model.ts`)
Interfase `BasicResponse` mapea la respuesta del backend:
-   `id_Suj`, `id_Bie`
-   `sujDeno`, `titulares`
-   `esMoto`
-   `cuentaBco`, `cbu`, etc.

## Source Code

```typescript
@Injectable({ providedIn: 'root' })
export class BasicService {
  private baseUrl = 'https://sb-comon-api.malvinasargentinas.gob.ar';

  getBasic(id_suj: number, id_bie: number): Observable<BasicResponse> {
    const params = new HttpParams()
      .set('id_suj', String(id_suj))
      .set('id_bie', String(id_bie));

    return this.http.get<BasicResponse>(`${this.baseUrl}/Basic/Get`, { params });
  }
}
```