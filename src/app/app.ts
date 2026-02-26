import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { OpenIdConfiguration } from 'angular-auth-oidc-client';
import { filter, Subscription } from 'rxjs';

import { AuthSessionFacade, SsoSessionGuardService } from 'mma-sso-session-guard';
import { environment } from '../environments/environment';

// Si tu tipo está exportado por la lib, usalo desde ahí.
// Si no, sacá este import y dejá `any` en el subscribe del state.
import { AuthSessionState } from 'mma-sso-session-guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {

  readonly auth = inject(AuthSessionFacade);
  private readonly router = inject(Router);
  private readonly ssoGuard = inject(SsoSessionGuardService);

  private subs: Subscription[] = [];

  ngOnInit(): void {
    // ✅ bootstrap al final
    void this.auth.bootstrapOnce().catch(() => {});
  }


  ngOnDestroy(): void {
    for (const s of this.subs) s.unsubscribe();
    this.subs = [];
  }

  // --------------------------
  // UI actions
  // --------------------------
  login(): void { this.auth.login(); }
  logout(): void { this.auth.logout(); }


  refreshSession(): void {
    this.auth.refresh().subscribe();
  }

  goUserProfile(): void { this.auth.goUserProfile(); }

  mostrarAccessToken(): void {
    this.auth.getAccessToken().subscribe(at => {
      console.clear();
      console.log(`AccessToken = ${at}`);
    });
  }

  // --------------------------
  // Navegación
  // --------------------------

  get urlConDeepLink(): string {
    return environment.externalSites.urlConDeepLink;
  }
  get urlConDeepLinkInvalido(): string {
    return environment.externalSites.urlConDeepLinkInvalido;
  }
  get urlSinDeepLink(): string {
    return environment.externalSites.urlSinDeepLink;
  }
  get urlSbMasPagosConDeepLink(): string {
    return environment.externalSites.urlSbMasPagosConDeepLink;
  }


  goUrlConDeepLink(): void {
    window.location.href = environment.externalSites.urlConDeepLink;
  }

  goUrlConDeepLinkInvalido(): void {
    window.location.href = environment.externalSites.urlConDeepLinkInvalido;
  }

  goUrlSinDeepLink(): void {
    window.location.href = environment.externalSites.urlSinDeepLink;
  }

  goUrlSbMasPagosConDeepLink(): void {
    window.location.href = environment.externalSites.urlSbMasPagosConDeepLink;
  }


  goHome(): void { void this.router.navigate(['/']); }

  // --------------------------
  // Panels loaders
  // --------------------------
  loadAccessTokenPayload(): void {
    // En Opción A no hace falta: el facade mantiene accessPayload en el state.
    // Lo dejamos vacío a propósito (no rompe el HTML).
  }

  loadIdTokenPayload(): void {
    // idem
  }

  loadUserInfo(): void {
    // Si tu facade ya lo expone (recomendado):
    if ((this.auth as any).refreshUserInfo) {
      (this.auth as any).refreshUserInfo();
    }
  }

  refreshUserInfo(): void {
    if ((this.auth as any).clearUserInfo) {
      (this.auth as any).clearUserInfo();
    }
    this.auth.refreshUserInfo();
  }

  // --------------------------
  // Copy helpers
  // --------------------------
  async copy(text?: string | null) {
    if (!text) return;
    try { await navigator.clipboard.writeText(text); } catch { /* no-op */ }
  }

  async copyJson(obj: any) {
    if (!obj) return;
    try { await navigator.clipboard.writeText(JSON.stringify(obj, null, 2)); } catch { /* no-op */ }
  }


}