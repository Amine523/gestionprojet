import { Routes } from '@angular/router';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { ClientProjetsComponent } from './pages/client-projets/client-projets.component';
import { ClientRapportsComponent } from './pages/client-rapports/client-rapports.component';
import { ClientFeedbackComponent } from './pages/client-feedback/client-feedback.component';
import { AdminChatComponent } from '../admin/pages/admin-chat/admin-chat.component';
import { DevParametresComponent } from '../dev/pages/dev-parametres/dev-parametres.component';
import { NotificationsComponent } from '@shared/components/notifications/notifications.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';

export const CLIENT_ROUTES: Routes = [
  { path: 'dashboard', component: ClientDashboardComponent },
  { path: 'projets', component: ClientProjetsComponent },
  { path: 'rapports', component: ClientRapportsComponent },
  { path: 'feedback', component: ClientFeedbackComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'parametres', component: DevParametresComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
