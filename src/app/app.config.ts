import { ApplicationConfig, inject, Injectable, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { authConfig } from './auth/auth.config';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { xsrfCrossSiteInterceptor } from './auth/xsrf-cross-site.interceptor';
import { catchError, firstValueFrom, map, of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAuth(authConfig),
    provideHttpClient(
      withFetch(),
      // withXsrfConfiguration({
      //   cookieName: 'XSRF-TOKEN',
      //   headerName: 'X-XSRF-TOKEN',
      // }),  
      //withInterceptors([authInterceptor(), xsrfCrossSiteInterceptor]),
      withInterceptors([authInterceptor()]),
    ), 
    // {
    //   provide: 'ANTIFORGERY_TOKEN_LOADER',
    //   multi: true,
    //   useFactory: () => {
    //     const http = inject(HttpClient);
    //     return firstValueFrom(
    //       http.get('https://localhost:5141/antiforgery/token', {
    //         withCredentials: true,
    //         responseType: 'text' as const,
    //       }).pipe(
    //         map(() => void 0),
    //         catchError(() => of(void 0))
    //       )
    //     );
    //   }
    // },
    
  ]
};


