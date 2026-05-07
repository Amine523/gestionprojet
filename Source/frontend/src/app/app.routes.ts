import { Routes } from '@angular/router';
import { ModernLayoutComponent } from '@layout/layouts/modern.layout';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('@features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'super-admin',
    component: ModernLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadChildren: () => import('@features/super-admin/super-admin.routes').then(m => m.SUPER_ADMIN_ROUTES)
  },
  {
    path: 'admin',
    component: ModernLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN_SOCIETE'] },
    loadChildren: () => import('@features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'rh',
    component: ModernLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['RH'] },
    loadChildren: () => import('@features/rh/rh.routes').then(m => m.RH_ROUTES)
  },
  {
    path: 'chef-projet',
    component: ModernLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['CHEF_PROJET'] },
    loadChildren: () => import('@features/chef/chef.routes').then(m => m.CHEF_ROUTES)
  },
  {
    path: 'dev',
    component: ModernLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['DEVELOPPEUR'] },
    loadChildren: () => import('@features/dev/dev.routes').then(m => m.DEV_ROUTES)
  },
  {
    path: 'qa',
    component: ModernLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['TESTEUR_QA'] },
    loadChildren: () => import('@features/qa/qa.routes').then(m => m.QA_ROUTES)
  },
  { path: '**', redirectTo: 'login' }
];
