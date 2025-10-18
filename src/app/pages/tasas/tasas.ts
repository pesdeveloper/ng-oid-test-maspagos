import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasicService } from '../../core/services/basic.service';
import { BasicResponse } from '../../core/models/basic.model';
import { OidcSecurityService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { take } from 'rxjs';

@Component({
  selector: 'app-tasas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasas.html',
  styleUrl: './tasas.scss'
})
export class Tasas implements OnInit {

  private readonly oidcSecurityService = inject(OidcSecurityService);
  
  // inputs por defecto
  idSuj = signal<number>(1);
  idBie = signal<number>(96);

  // estado UI
  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<BasicResponse | null>(null);
  config = signal<Partial<OpenIdConfiguration>>({});
  clientId = signal<string | undefined>(undefined);

  constructor(private readonly basic: BasicService) {}

  ngOnInit(): void {
    this.oidcSecurityService.getConfiguration().pipe(take(1)).subscribe(cfg => {
      this.config.set(cfg as OpenIdConfiguration); 
      this.clientId.set(cfg?.clientId);
      this.load();
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.data.set(null);

    const suj = Number(this.idSuj());
    const bie = Number(this.idBie());

    this.basic.getBasic(suj, bie).subscribe({
      next: (resp) => {
        this.data.set(resp);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'No se pudo cargar Basic/Get');
        this.loading.set(false);
      }
    });
  }

  // para submit de formulario (Enter o botón)
  onSubmit(ev?: Event) {
    ev?.preventDefault();
    this.load();
  }
}
