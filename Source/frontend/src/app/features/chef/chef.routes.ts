import { Routes } from '@angular/router';
import { ChefDashboardComponent } from './pages/chef-dashboard/chef-dashboard.component';
import { ChefProjetsComponent } from './pages/chef-projets/chef-projets.component';
import { ChefTachesComponent } from './pages/chef-taches/chef-taches.component';
import { ChefBugsComponent } from './pages/chef-bugs.component';
import { ChefEquipeComponent } from './pages/chef-equipe/chef-equipe.component';
import { ChefSuiviComponent } from './pages/chef-suivi/chef-suivi.component';
import { ChefRapportsComponent } from './pages/chef-rapports/chef-rapports.component';
import { ChefParametresComponent } from './pages/chef-parametres/chef-parametres.component';
import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';
import { DevTimeTrackingComponent } from '../dev/pages/dev-time-tracking/dev-time-tracking.component';
import { DevDocsComponent } from '../dev/pages/dev-docs/dev-docs.component';
import { DevDiagramsComponent } from '../dev/pages/dev-diagrams/dev-diagrams.component';
import { AdminChatComponent } from '../admin/pages/admin-chat/admin-chat.component';
import { DevParametresComponent } from '../dev/pages/dev-parametres/dev-parametres.component';

export const CHEF_ROUTES: Routes = [
  { path: 'dashboard', component: ChefDashboardComponent },
  { path: 'projets', component: ChefProjetsComponent },
  { path: 'taches', component: ChefTachesComponent },
  { path: 'bugs', component: ChefBugsComponent },
  { path: 'equipe', component: ChefEquipeComponent },
  { path: 'suivi', component: ChefSuiviComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'rapports', component: ChefRapportsComponent },
  { path: 'time', component: DevTimeTrackingComponent },
  { path: 'docs', component: DevDocsComponent },
  { path: 'diagrams', component: DevDiagramsComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'parametres', component: DevParametresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
