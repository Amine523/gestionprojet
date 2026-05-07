import { Routes } from '@angular/router';
import { ChefDashboardComponent } from './pages/chef-dashboard/chef-dashboard.component';
import { ChefProjetsComponent } from './pages/chef-projets/chef-projets.component';
import { ChefTachesComponent } from './pages/chef-taches/chef-taches.component';
import { ChefBugsComponent } from './pages/chef-bugs.component';
import { ChefEquipeComponent } from './pages/chef-equipe/chef-equipe.component';
import { ChefSuiviComponent } from './pages/chef-suivi/chef-suivi.component';
import { ChefRapportsComponent } from './pages/chef-rapports/chef-rapports.component';
import { ChefParametresComponent } from './pages/chef-parametres/chef-parametres.component';
import { ChefCongesComponent } from './pages/chef-conges/chef-conges.component';

import { CalendarViewComponent } from '@shared/components/calendar-view/calendar-view.component';
import { TimeTrackingComponent } from '../dev/pages/time-tracking/components/time-tracking.component';
import { DiagramsComponent } from '../dev/pages/diagrams/components/diagrams.component';
import { CongesComponent } from '../dev/pages/conges/components/conges.component';
import { AdminChatComponent } from '../admin/pages/admin-chat/admin-chat.component';
import { ParametresComponent } from '../dev/pages/parametres/components/parametres.component';
import { NotificationsComponent } from '@shared/components/notifications/notifications.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';


export const CHEF_ROUTES: Routes = [
  { path: 'dashboard', component: ChefDashboardComponent },
  { path: 'projets', component: ChefProjetsComponent },
  { path: 'taches', component: ChefTachesComponent },
  { path: 'bugs', component: ChefBugsComponent },
  { path: 'equipe', component: ChefEquipeComponent },
  { path: 'suivi', component: ChefSuiviComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'rapports', component: ChefRapportsComponent },
  { path: 'time', component: TimeTrackingComponent },
  { path: 'diagrams', component: DiagramsComponent },
  { path: 'conges', component: CongesComponent },

  { path: 'notifications', component: NotificationsComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'parametres', component: ParametresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
