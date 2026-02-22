import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Logout } from './pages/logout/logout';
import { Tasas } from './pages/tasas/tasas';
import { Datos } from './pages/datos/datos';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'logout', component: Logout },
    { path: 'tasas', component: Tasas },
    { path: 'datos/:sujeto/:cuenta', component: Datos },
    { path: '**', redirectTo: '/' },
];
