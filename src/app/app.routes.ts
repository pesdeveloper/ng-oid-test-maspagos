import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Logout } from './pages/logout/logout';
import { Tasas } from './pages/tasas/tasas';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'logout', component: Logout },
    { path: 'tasas', component: Tasas },
    { path: '**', redirectTo: '/' },
];
