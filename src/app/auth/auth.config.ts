import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
            //authority: 'https://sd-idp.malvinasargentinas.gob.ar',
            authority: 'https://localhost:7301',
            issValidationOff: true,
            strictIssuerValidationOnWellKnownRetrievalOff: true,
            redirectUrl: window.location.origin,
            postLogoutRedirectUri: `${window.location.origin}/logout`,
            postLoginRoute: 'tasas',
            clientId: 'jsclient',
            //clientId: 'jslegacym2',
            scope: 'openid profile email phone offline_access maspagos',  // jsclient
            //scope: 'openid profile email phone offline_access org employee employment expedientes', // jslegacym2
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
        }
}
