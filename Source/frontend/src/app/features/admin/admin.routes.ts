import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminEmployesComponent } from './pages/admin-employes/admin-employes.component';
import { AdminProjetsComponent } from './pages/admin-projets/admin-projets.component';
import { AdminRhComponent } from './pages/admin-rh/admin-rh.component';
import { AdminPaiementsComponent } from './pages/admin-paiements/admin-paiements.component';
import { AdminChatComponent } from './pages/admin-chat/admin-chat.component';
import { AdminParametresComponent } from './pages/admin-parametres/admin-parametres.component';
import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';

import { AdminCongesComponent } from './pages/admin-conges/admin-conges.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent, pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'employes', component: AdminEmployesComponent },
  { path: 'projets', component: AdminProjetsComponent },
  { path: 'rh', component: AdminRhComponent },
  { path: 'conges', component: AdminCongesComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'paiements', component: AdminPaiementsComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'parametres', component: AdminParametresComponent }
];
