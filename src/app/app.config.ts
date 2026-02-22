import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';

import { authConfig } from './auth/auth.config';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { xsrfCrossSiteInterceptor } from './auth/xsrf-cross-site.interceptor';

import { provideSsoSessionGuard, SimpleLogLevel } from 'mma-sso-session-guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideAuth(authConfig),

    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptors([authInterceptor(), xsrfCrossSiteInterceptor]),
    ),

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
    }),
  ],
};