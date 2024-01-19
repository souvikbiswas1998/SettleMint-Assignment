import { Routes } from '@angular/router';


export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then((c) => c.DashboardComponent) },
    { path: 'create-task', loadComponent: () => import('./dialog/linker.component').then((c) => c.LinkerComponent) },
    { path: 'task/:id', loadComponent: () => import('./dialog/linker.component').then((c) => c.LinkerComponent) }
];
