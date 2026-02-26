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
  clientLabel = signal('...');

  isAuthenticated = signal(false);
  config = signal<Partial<OpenIdConfiguration>>({});

  accessToken = signal<string>('');
  accessPayload = signal<any | null>(null);

  idToken = signal<string>('');
  idPayload = signal<any | null>(null);

  userInfo = signal<any | null>(null);
  userInfoLoadedAt = signal<Date | null>(null);

  currentPath = signal<string>('/');

  refreshing = signal(false);

  private readonly auth = inject(AuthSessionFacade);
  private readonly router = inject(Router);
  private readonly ssoGuard = inject(SsoSessionGuardService);

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.auth.state$.subscribe((s: AuthSessionState) => {
        this.isAuthenticated.set(!!s.isAuthenticated);
        if (s.config) {
          this.config.set(s.config);
          this.clientLabel.set(this.computeClientLabelFromState(s));
        } else {
          this.clientLabel.set('...');
        }
        this.accessToken.set(s.accessToken ?? '');
        this.accessPayload.set(s.accessPayload ?? null);
        this.idToken.set(s.idToken ?? '');
        this.idPayload.set(s.idPayload ?? null);
        this.userInfo.set(s.userInfo ?? null);
        this.userInfoLoadedAt.set(s.userInfoLoadedAt ?? null);
      })
    );

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
    if (this.refreshing()) return;
    this.refreshing.set(true);

    this.auth.refresh().subscribe({
      next: _ => this.refreshing.set(false),
      error: err => {
        this.refreshing.set(false);
        console.error('Refresh ERROR', err);
      },
    });
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
  goHabilitaciones(): void {
    window.location.href = environment.externalSites.habilitacionesSite;
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
    if ((this.auth as any).refreshUserInfo) {
      (this.auth as any).refreshUserInfo();
    }
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

  // --------------------------
  // Label
  // --------------------------
  private computeClientLabelFromState(s: AuthSessionState): string {
    const idp: any = s.idPayload ?? null;
    if (idp?.client_name) return String(idp.client_name);
    if (idp?.azp) return String(idp.azp);

    const cfg: any = s.config ?? null;
    const clientId = cfg?.clientId ?? cfg?.client_id ?? null;
    return clientId ? String(clientId) : 'No client id';
  }
}