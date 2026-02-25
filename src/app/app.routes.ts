import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Logout } from './pages/logout/logout';
import { Tasas } from './pages/tasas/tasas';
import { Datos } from './pages/datos/datos';
import { ShieldGuard } from './auth/guards';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'logout', component: Logout },
    { path: 'tasas', component: Tasas },
    // 👇 ESTA es la que te preocupa
    {
        path: 'datos/:sujeto/:cuenta',
        loadComponent: () =>
            import('./pages/datos/datos').then(m => m.Datos),
        canMatch: [ShieldGuard]   // ⭐ clave
    },
    { path: '**', redirectTo: '/' },
];
