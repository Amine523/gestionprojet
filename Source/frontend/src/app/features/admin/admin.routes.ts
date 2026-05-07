import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/components/dashboard.component';
import { AdminEmployesComponent } from './pages/admin-employes/admin-employes.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ProjetsComponent } from './pages/projets/components/projets.component';
import { AdminRhComponent } from './pages/admin-rh/admin-rh.component';
import { AdminPaiementsComponent } from './pages/admin-paiements/admin-paiements.component';
import { AdminChatComponent } from './pages/admin-chat/admin-chat.component';
import { AdminParametresComponent } from './pages/admin-parametres/admin-parametres.component';
import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';

import { AdminCongesComponent } from './pages/admin-conges/admin-conges.component';
import { NotificationsComponent } from '@shared/components/notifications/notifications.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';
import { AdminModulesComponent } from './pages/admin-modules/admin-modules.component';
import { RhPointageComponent } from '../rh/pages/rh-pointage/rh-pointage.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'modules', component: AdminModulesComponent },
  { path: 'employes', component: AdminEmployesComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'rh', component: AdminRhComponent },
  { path: 'conges', component: AdminCongesComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'paiements', component: AdminPaiementsComponent },
  { path: 'pointage', component: RhPointageComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'parametres', component: AdminParametresComponent }
];
