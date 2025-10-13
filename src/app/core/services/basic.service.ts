import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasicResponse } from '../models/basic.model';

@Injectable({ providedIn: 'root' })
export class BasicService {
  private http = inject(HttpClient);
  private baseUrl = 'https://sb-comon-api.malvinasargentinas.gob.ar';

  getBasic(id_suj: number, id_bie: number): Observable<BasicResponse> {
    const params = new HttpParams()
      .set('id_suj', String(id_suj))
      .set('id_bie', String(id_bie));

    return this.http.get<BasicResponse>(`${this.baseUrl}/Basic/Get`, { params });
  }
}
