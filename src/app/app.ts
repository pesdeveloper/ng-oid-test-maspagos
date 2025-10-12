import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { LoginResponse, OidcSecurityService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { forkJoin, take } from 'rxjs';

const RECOVER_REFRESH_TRIED_KEY = 'oidc:recover:refresh:tried';
const RECOVER_PROMPTNONE_TRIED_KEY = 'oidc:recover:promptnone:tried';
const RECOVER_DISABLED_KEY = 'oidc:recover:disabled'; 

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule, 
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,    
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit , OnDestroy {
  title = signal('...');

  isAuthenticated = signal(false);
  config = signal<Partial<OpenIdConfiguration>>({});
  accessToken = signal<string>('');
  accessPayload = signal<any | null>(null);
  idToken = signal<string>('');
  idPayload = signal<any | null>(null);
  userInfo = signal<any | null>(null);
  userInfoLoadedAt = signal<Date | null>(null);

  refreshing = signal(false);

  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly oidcSecurityService = inject(OidcSecurityService);

  ngOnInit() {
    //const r = window.location.pathname;
    //if (r.includes('logout')) {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const { isAuthenticated, userData, accessToken, idToken, configId } = loginResponse;
        this.isAuthenticated.set(isAuthenticated);
        if (isAuthenticated) {
          clearRecoverFlags();    
          clearRecoverDisabled();
          this.loadAccessTokenPayload();
          this.loadIdTokenPayload();
          console.log(`New accessToken: ${accessToken}`);
        } else {
          const r = window.location.pathname;
          //if (!r.includes('logout')) {
            this.tryRecoverAuth();
          //}
           
        }
        this.oidcSecurityService.getConfiguration().pipe(take(1))
          .subscribe(cfg => this.config.set(cfg as OpenIdConfiguration));
        this.updateClientLabel();

      });

  }
  
  ngOnDestroy() {
   
  }

  login() {
    this.oidcSecurityService.authorize();
  }  

  logout() {
//  this.oidcSecurityService.logoff().subscribe({
//     next: (res: any) => {
//       // v17 suele traer res?.url; si viene, navegamos manualmente
//       if (res?.url) {
//         window.location.href = res.url;
//         return;
//       }
//       // Fallback si no vino url
//       this.forceEndSessionRedirect();
//     },
//     error: () => this.forceEndSessionRedirect(),
//   });
    
    setRecoverDisabled();
    clearRecoverFlags(); 
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
    
  }

  private forceEndSessionRedirect(): void {
    const authority = this.config().authority; // ej: https://idp.tu-dominio
    const postLogoutRedirectUri = this.config().postLogoutRedirectUri||''; // ej: https://spa/signed-out
    const idToken = this.idToken() || '';

    // RP-Initiated Logout (OIDC): /connect/logout + params
    const url =
      `${authority}/connect/logout` +
      `?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}` +
      (idToken ? `&id_token_hint=${encodeURIComponent(idToken)}` : '');

    // Navegación “dura” para evitar bucles
    alert(url);
    window.location.assign(url);
  }

  mostrarAccessToken() {
    this.oidcSecurityService.getAccessToken().subscribe(at => 
      {
        console.clear();
        console.log(`AccessToken = ${at}`);
      });
  }

  goUserProfile() {
    this.oidcSecurityService.getConfiguration().subscribe(s => {
      const authority = (s as OpenIdConfiguration).authority;
      const clientId = (s as OpenIdConfiguration).clientId;
      const currentUrl = window.location.origin + window.location.pathname;
      const returnUrl = encodeURIComponent(currentUrl);
      const logout = 'logout';
      
      const idpUrl = `${authority}/account/profile?client_id=${clientId}&returnUrl=${returnUrl}&logoutPath=${encodeURIComponent(logout)}`;
      window.location.href = idpUrl;
    });
  }

  // Carga el JWT y su payload cuando abrís el expansion panel
  loadAccessTokenPayload() {
    if (!this.isAuthenticated()) {
      this.accessToken.set('');
      this.accessPayload.set(null);
      return;
    }

    this.oidcSecurityService.getAccessToken().pipe(take(1)).subscribe(at => {
      this.accessToken.set(at ?? '');
    });

    this.oidcSecurityService.getPayloadFromAccessToken().pipe(take(1)).subscribe(p => {
      this.accessPayload.set(p ?? null);
    });
  }

  // Helpers de copiado
  async copy(text?: string | null) {
    if (!text) return;
    try { await navigator.clipboard.writeText(text); }
    catch { /* no-op */ }
  }

  async copyJson(obj: any) {
    if (!obj) return;
    try { await navigator.clipboard.writeText(JSON.stringify(obj, null, 2)); }
    catch { /* no-op */ }
  }

  loadIdTokenPayload() {
      if (!this.isAuthenticated()) {
        this.idToken.set('');
        this.idPayload.set(null);
        return;
      }

      this.oidcSecurityService.getIdToken().pipe(take(1))
        .subscribe(it => this.idToken.set(it ?? ''));

      this.oidcSecurityService.getPayloadFromIdToken().pipe(take(1))
        .subscribe(p => this.idPayload.set(p ?? null));
  }  

  loadUserInfo() {
    if (!this.isAuthenticated()) {
      this.userInfo.set(null);
      this.userInfoLoadedAt.set(null);
      return;
    }

    forkJoin([
      this.oidcSecurityService.getAccessToken().pipe(take(1)),
      this.oidcSecurityService.getConfiguration().pipe(take(1))
    ]).subscribe({
      next: ([token, cfg]) => {
        const authority = (cfg as OpenIdConfiguration)?.authority ?? '';
        if (!token || !authority) {
          this.userInfo.set({ error: 'missing token/authority' });
          return;
        }

        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        this.http.get(`${authority}/connect/userinfo`, { headers }).subscribe({
          next: (data) => {
            this.userInfo.set(data);
            this.userInfoLoadedAt.set(new Date());
          },
          error: (err) => {
            this.userInfo.set({
              error: err?.message ?? 'UserInfo error',
              status: err?.status,
            });
          }
        });
      },
      error: (e) => this.userInfo.set({ error: e?.message ?? 'config/token error' })
    });
  }

  refreshUserInfo() {
    this.userInfo.set(null);
    this.userInfoLoadedAt.set(null);
    this.loadUserInfo();
  }

  refreshSession() {
    if (this.refreshing()) return;
    this.refreshing.set(true);

    this.oidcSecurityService.forceRefreshSession().pipe(take(1)).subscribe({
      next: _ => {
        this.refreshing.set(false);
        // Refrescar paneles
        this.loadAccessTokenPayload();
        this.loadIdTokenPayload();
        // Si querés reconsultar userinfo automáticamente:
        // this.refreshUserInfo();
      },
      error: err => {
        this.refreshing.set(false);
        console.error('Refresh ERROR', err);
      }
    });
  }

  private updateClientLabel() {
    // primero intento con el id_token
    this.oidcSecurityService.getPayloadFromIdToken().pipe(take(1)).subscribe(idp => {
      const claimName = (idp as any)?.client_name || (idp as any)?.azp || (idp as any)?.client_id;
      if (claimName) {
        this.title.set(claimName);
        return;
      }
      // fallback a la config
      this.oidcSecurityService.getConfiguration().pipe(take(1)).subscribe(cfg => {
        this.title.set((cfg as OpenIdConfiguration).clientId ?? '');
      });
    });

  }


  /** Recupera sesión SIN loop:
   *  1) refresh una sola vez por pestaña
   *  2) si falla, prompt=none una sola vez por pestaña
   *  3) si también falla, no reintenta (queda para login interactivo)
   */
  private tryRecoverAuth() {
    if (isRecoverDisabled()) {
      // opcional: console.debug('Recover deshabilitado por logout');
      return;
    }
    // 1) refresh (una sola vez)
    if (!wasTried(RECOVER_REFRESH_TRIED_KEY)) {
      markTried(RECOVER_REFRESH_TRIED_KEY);
      this.oidcSecurityService.forceRefreshSession().pipe(take(1)).subscribe({
        next: (resp) => {
          const ok = !!resp?.isAuthenticated;
          if (ok) {
            // éxito: rehidratar y limpiar flags
            clearRecoverFlags();
            this.isAuthenticated.set(true);
            this.loadAccessTokenPayload();
            this.loadIdTokenPayload();
          } else {
            // no hay sesión válida: pasar a prompt=none (una sola vez)
            this.tryPromptNone();
          }
        },
        error: () => {
          // 2) prompt=none (una sola vez)
          if (!wasTried(RECOVER_PROMPTNONE_TRIED_KEY)) {
            markTried(RECOVER_PROMPTNONE_TRIED_KEY);
            this.tryPromptNone();
          }
          // Si ya se intentó prompt=none antes, no hacemos nada más (evita loop)
        }
      });
      return;
    }

    // Si ya intentamos refresh y llegó acá, probamos prompt=none solo si no se intentó
    if (!wasTried(RECOVER_PROMPTNONE_TRIED_KEY)) {
      markTried(RECOVER_PROMPTNONE_TRIED_KEY);
      this.oidcSecurityService.authorize(undefined, {
        customParams: { prompt: 'none' }
      });
    }
    // Si ambos ya fueron intentados, NO reintenta automáticamente.
    // El usuario puede tocar "Login" para un flujo interactivo normal.
  }

  private tryPromptNone() {
    if (!wasTried(RECOVER_PROMPTNONE_TRIED_KEY)) {
      markTried(RECOVER_PROMPTNONE_TRIED_KEY);
      this.oidcSecurityService.authorize(undefined, {
        customParams: { prompt: 'none' }
      });
      // Importante: no limpiar flags acá; sólo cuando vuelva autenticado
    }
  }  

}

// helpers
function wasTried(key: string) {
  try { return sessionStorage.getItem(key) === '1'; } catch { return false; }
}
function markTried(key: string) {
  try { sessionStorage.setItem(key, '1'); } catch {}
}
function clearRecoverFlags() {
  try {
    sessionStorage.removeItem(RECOVER_REFRESH_TRIED_KEY);
    sessionStorage.removeItem(RECOVER_PROMPTNONE_TRIED_KEY);
  } catch {}
}

function isRecoverDisabled() {
  try { return localStorage.getItem(RECOVER_DISABLED_KEY) === '1'; } catch { return false; }
}
function setRecoverDisabled() {
  try { localStorage.setItem(RECOVER_DISABLED_KEY, '1'); } catch {}
}
function clearRecoverDisabled() {
  try { localStorage.removeItem(RECOVER_DISABLED_KEY); } catch {}
}