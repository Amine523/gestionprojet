import { Routes } from '@angular/router';
import { DevDashboardComponent } from './pages/dev-dashboard/dev-dashboard.component';
import { DevTachesComponent } from './pages/dev-taches/dev-taches.component';
import { DevBugsComponent } from './pages/dev-bugs/dev-bugs.component';
import { DevProjetsComponent } from './pages/dev-projets/dev-projets.component';
import { DevTimeTrackingComponent } from './pages/dev-time-tracking/dev-time-tracking.component';
import { DevDocsComponent } from './pages/dev-docs/dev-docs.component';
import { DevCongesComponent } from './pages/dev-conges/dev-conges.component';
import { DevParametresComponent } from './pages/dev-parametres/dev-parametres.component';
import { DevDiagramsComponent } from './pages/dev-diagrams/dev-diagrams.component';
import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';
import { AdminChatComponent } from '../admin/pages/admin-chat/admin-chat.component';

export const DEV_ROUTES: Routes = [
  { path: 'dashboard', component: DevDashboardComponent },
  { path: 'taches', component: DevTachesComponent },
  { path: 'bugs', component: DevBugsComponent },
  { path: 'projets', component: DevProjetsComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'time', component: DevTimeTrackingComponent },
  { path: 'docs', component: DevDocsComponent },
  { path: 'diagrams', component: DevDiagramsComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'conges', component: DevCongesComponent },
  { path: 'parametres', component: DevParametresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
