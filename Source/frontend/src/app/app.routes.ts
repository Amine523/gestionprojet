import { Routes } from '@angular/router';
import { SuperAdminLayoutComponent } from '@layout/layouts/super-admin.layout';
import { AdminSocieteLayoutComponent } from '@layout/layouts/admin-societe.layout';
import { RhLayoutComponent } from '@layout/layouts/rh.layout';
import { ChefGroupeLayoutComponent } from '@layout/layouts/chef-groupe.layout';
import { TesteurLayoutComponent } from '@layout/layouts/testeur-layout.component';
import { DeveloppeurLayoutComponent } from '@layout/layouts/developpeur.layout';
import { ApplicantLayoutComponent } from '@layout/layouts/applicant.layout';
import { ClientLayoutComponent } from '@layout/layouts/client.layout';

import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'applicant',
    component: ApplicantLayoutComponent,
    loadChildren: () => import('@features/applicant/applicant.routes').then(m => m.APPLICANT_ROUTES)
  },
  {
    path: 'superadmin',
    component: SuperAdminLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('@features/super-admin/super-admin.routes').then(m => m.SUPER_ADMIN_ROUTES)
  },
  {
    path: 'admin',
    component: AdminSocieteLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('@features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'rh',
    component: RhLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('@features/rh/rh.routes').then(m => m.RH_ROUTES)
  },
  {
    path: 'chef',
    component: ChefGroupeLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('@features/chef/chef.routes').then(m => m.CHEF_ROUTES)
  },
  {
    path: 'qa',
    component: TesteurLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('@features/qa/qa.routes').then(m => m.QA_ROUTES)
  },
  {
    path: 'dev',
    component: DeveloppeurLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('@features/dev/dev.routes').then(m => m.DEV_ROUTES)
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('@features/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
