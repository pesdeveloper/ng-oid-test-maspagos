import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
            authority: 'https://sb-idp.malvinasargentinas.gob.ar',
            //authority: 'https://localhost:7301',
            issValidationOff: true,
            strictIssuerValidationOnWellKnownRetrievalOff: true,
            redirectUrl: window.location.origin,
            postLogoutRedirectUri: `${window.location.origin}/logout`,

            //clientId: 'jsclient',
            //scope: 'openid profile email phone offline_access ingresos',
            //postLoginRoute: 'tasas',

            //clientId: 'js_bod_client',
            //scope: 'openid profile email phone offline_access tramites',
            //postLoginRoute: '/',


            clientId: 'jslegacym2',
            scope: 'openid profile email phone offline_access org employee employment entitlements tramites', // jslegacym2
            postLoginRoute: '/',

            responseType: 'code',
            silentRenew: true,
            useRefreshToken: false,
            ignoreNonceAfterRefresh: true,
            triggerRefreshWhenIdTokenExpired: true,
            autoUserInfo: true, 
            renewUserInfoAfterTokenRenew: true,
            silentRenewUrl: `${window.location.origin}/silent-renew.html`,
            renewTimeBeforeTokenExpiresInSeconds: 120,
            logLevel: LogLevel.Debug,
            // 🔑 Muy importante: el interceptor solo agrega el token si la URL empieza con uno de estos prefijos
            secureRoutes: [
              'https://sb-comon-api.malvinasargentinas.gob.ar',
            ],            
        }
}
