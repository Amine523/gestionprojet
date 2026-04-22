import { Routes } from '@angular/router';
import { QaDashboardComponent } from './pages/qa-dashboard/qa-dashboard.component';
import { QaTestsComponent } from './pages/qa-tests/qa-tests.component';
import { QaPlansComponent } from './pages/qa-plans/qa-plans.component';
import { QaBugsComponent } from './pages/qa-bugs/qa-bugs.component';
import { QaRapportsComponent } from './pages/qa-rapports/qa-rapports.component';
import { QaProjetsComponent } from './pages/qa-projets/qa-projets.component';
import { QaNotificationsComponent } from './pages/qa-notifications/qa-notifications.component';
import { QaParametresComponent } from './pages/qa-parametres/qa-parametres.component';
import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';
import { DevTimeTrackingComponent } from '../dev/pages/dev-time-tracking/dev-time-tracking.component';
import { AdminChatComponent } from '../admin/pages/admin-chat/admin-chat.component';

export const QA_ROUTES: Routes = [
  { path: 'dashboard', component: QaDashboardComponent },
  { path: 'tests', component: QaTestsComponent },
  { path: 'plans', component: QaPlansComponent },
  { path: 'bugs', component: QaBugsComponent },
  { path: 'rapports', component: QaRapportsComponent },
  { path: 'projets', component: QaProjetsComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'time', component: DevTimeTrackingComponent },
  { path: 'notifications', component: QaNotificationsComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'parametres', component: QaParametresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
