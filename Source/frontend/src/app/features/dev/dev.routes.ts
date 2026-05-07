import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/components/dashboard.component';
import { TachesComponent } from './pages/taches/components/taches.component';
import { BugsComponent } from './pages/bugs/components/bugs.component';
import { ProjetsComponent } from './pages/projets/components/projets.component';
import { TimeTrackingComponent } from './pages/time-tracking/components/time-tracking.component';
import { DocsComponent } from './pages/docs/components/docs.component';
import { ParametresComponent } from './pages/parametres/components/parametres.component';
import { DiagramsComponent } from './pages/diagrams/components/diagrams.component';
import { ApiComponent } from './pages/api/components/api.component';

import { CongesComponent } from './pages/conges/components/conges.component';
import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';
import { AdminChatComponent } from '../admin/pages/admin-chat/admin-chat.component';
import { NotificationsComponent } from '@shared/components/notifications/notifications.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';


export const DEV_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'taches', component: TachesComponent },
  { path: 'bugs', component: BugsComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'time', component: TimeTrackingComponent },

  { path: 'api', component: ApiComponent },
  { path: 'diagrams', component: DiagramsComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'conges', component: CongesComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'parametres', component: ParametresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
