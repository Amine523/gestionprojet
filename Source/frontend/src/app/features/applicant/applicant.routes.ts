import { Routes } from '@angular/router';
import { ApplicantHomeComponent } from './pages/home.component';
import { ApplicantOffresComponent } from './pages/offres.component';
import { ApplicantPostulerComponent } from './pages/postuler.component';
import { ApplicantProfilComponent } from './pages/profil.component';
import { NotificationsComponent } from '@shared/components/notifications/notifications.component';

export const APPLICANT_ROUTES: Routes = [
  { path: '', component: ApplicantHomeComponent },
  { path: 'offres', component: ApplicantOffresComponent },
  { path: 'postuler', component: ApplicantPostulerComponent },
  { path: 'profil', component: ApplicantProfilComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'test', loadComponent: () => import('../rh/pages/rh-tests-interface/rh-tests-interface.component').then(m => m.RhTestsInterfaceComponent) }
];

