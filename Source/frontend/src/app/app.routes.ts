import { Routes } from '@angular/router';
import { SuperAdminLayoutComponent } from '@layout/layouts/super-admin.layout';
import { AdminSocieteLayoutComponent } from '@layout/layouts/admin-societe.layout';
import { RhLayoutComponent } from '@layout/layouts/rh.layout';
import { ChefGroupeLayoutComponent } from '@layout/layouts/chef-groupe.layout';
import { TesteurLayoutComponent } from '@layout/layouts/testeur-layout.component';
import { DeveloppeurLayoutComponent } from '@layout/layouts/developpeur.layout';
import { ApplicantLayoutComponent } from '@layout/layouts/applicant.layout';

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
    loadChildren: () => import('@features/super-admin/super-admin.routes').then(m => m.SUPER_ADMIN_ROUTES)
  },
  {
    path: 'admin',
    component: AdminSocieteLayoutComponent,
    loadChildren: () => import('@features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'rh',
    component: RhLayoutComponent,
    loadChildren: () => import('@features/rh/rh.routes').then(m => m.RH_ROUTES)
  },
  {
    path: 'chef',
    component: ChefGroupeLayoutComponent,
    loadChildren: () => import('@features/chef/chef.routes').then(m => m.CHEF_ROUTES)
  },
  {
    path: 'qa',
    component: TesteurLayoutComponent,
    loadChildren: () => import('@features/qa/qa.routes').then(m => m.QA_ROUTES)
  },
  {
    path: 'dev',
    component: DeveloppeurLayoutComponent,
    loadChildren: () => import('@features/dev/dev.routes').then(m => m.DEV_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
