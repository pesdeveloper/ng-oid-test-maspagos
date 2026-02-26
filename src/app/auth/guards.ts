import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { from } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthSessionFacade, SsoSessionGuardService } from 'mma-sso-session-guard';

export const ShieldGuard: CanMatchFn = () => {
  const router = inject(Router);
  const auth = inject(AuthSessionFacade);
  const ssoGuard = inject(SsoSessionGuardService);

  const returnUrl = window.location.pathname + window.location.search;

  // ✅ guardar primero (para que sobreviva al prompt=none / redirects)
  ssoGuard.setReturnUrl(returnUrl);

  return from(auth.bootstrapOnce()).pipe(
    switchMap(() => auth.state$.pipe(take(1))),
    map(s => {
      if (s.isAuthenticated) return true;

      return router.createUrlTree(['/']);
    })
  );
};