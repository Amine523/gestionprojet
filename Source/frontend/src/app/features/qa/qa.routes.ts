import { Routes } from '@angular/router';
import { QaDashboardComponent } from './pages/qa-dashboard/qa-dashboard.component';
import { QaTestsComponent } from './pages/qa-tests/qa-tests.component';
import { QaPlansComponent } from './pages/qa-plans/qa-plans.component';
import { QaBugsComponent } from './pages/qa-bugs/qa-bugs.component';
import { QaRapportsComponent } from './pages/qa-rapports/qa-rapports.component';
import { QaProjetsComponent } from './pages/qa-projets/qa-projets.component';
import { NotificationsComponent } from '@shared/components/notifications/notifications.component';
import { QaParametresComponent } from './pages/qa-parametres/qa-parametres.component';
import { QaCongesComponent } from './pages/qa-conges/qa-conges.component';
import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';
import { TimeTrackingComponent } from '../dev/pages/time-tracking/components/time-tracking.component';
import { AdminChatComponent } from '../admin/pages/admin-chat/admin-chat.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';


export const QA_ROUTES: Routes = [
  { path: 'dashboard', component: QaDashboardComponent },
  { path: 'tests', component: QaTestsComponent },
  { path: 'plans', component: QaPlansComponent },
  { path: 'bugs', component: QaBugsComponent },
  { path: 'rapports', component: QaRapportsComponent },
  { path: 'projets', component: QaProjetsComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'time', component: TimeTrackingComponent },

  { path: 'conges', component: QaCongesComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'parametres', component: QaParametresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
