import { Routes } from '@angular/router';
import { RhDashboardComponent } from './pages/rh-dashboard/rh-dashboard.component';
import { RhPointageComponent } from './pages/rh-pointage/rh-pointage.component';
import { RhCongesComponent } from './pages/rh-conges.component';
import { RhEmployesComponent } from './pages/rh-employes/rh-employes.component';
import { RHRecrutementComponent } from './pages/rh-recrutement/rh-recrutement.component';
import { RhTestsComponent } from './pages/rh-tests/rh-tests.component';
// import { RhTestsInterfaceComponent } from './pages/rh-tests-interface/rh-tests-interface.component';
import { RhRapportsComponent } from './pages/rh-rapports/rh-rapports.component';
// import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';
import { AdminChatComponent } from '../admin/pages/admin-chat/admin-chat.component';
import { NotificationsComponent } from '@shared/components/notifications/notifications.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';
import { DevParametresComponent } from '../dev/pages/dev-parametres/dev-parametres.component';

export const RH_ROUTES: Routes = [
  { path: 'dashboard', component: RhDashboardComponent },
  { path: 'talent-metrics', loadComponent: () => import('./pages/talent-metrics/talent-metrics.component').then(m => m.TalentMetricsComponent) },
  { path: 'pointage', component: RhPointageComponent },
  { path: 'conges', component: RhCongesComponent },
  { path: 'employes', component: RhEmployesComponent },
  { path: 'recrutement', component: RHRecrutementComponent },
  { path: 'tests', component: RhTestsComponent },
  { path: 'rapports', component: RhRapportsComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'parametres', component: DevParametresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
