// src/app/security/xsrf-cross-site.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp('(^|; )' + encodeURIComponent(name) + '=([^;]*)'));
  return m ? decodeURIComponent(m[2]) : null;
}

export const xsrfCrossSiteInterceptor: HttpInterceptorFn = (req, next) => {
  // Sólo para métodos "no seguros"
  const isUnsafe = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

  // Resolver origen de la request y del IdP
  const target = new URL(req.url, window.location.origin);
  const idp = new URL('https://localhost:5141');

  const isForIdp = target.origin === idp.origin;

  if (isUnsafe && isForIdp) {
    // Asegura envío de cookies cross-site
    if (!req.withCredentials) {
      req = req.clone({ withCredentials: true });
    }
    // Si Angular no añadió el header (por ser cross-site), lo agregamos nosotros
    if (!req.headers.has('X-XSRF-TOKEN')) {
      const token = getCookie('XSRF-TOKEN');
      if (token) {
        req = req.clone({ setHeaders: { 'X-XSRF-TOKEN': token } });
      }
    }
  }

  return next(req);
};
