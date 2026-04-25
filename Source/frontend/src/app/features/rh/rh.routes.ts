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

export const RH_ROUTES: Routes = [
  { path: 'dashboard', component: RhDashboardComponent },
  { path: 'pointage', component: RhPointageComponent },
  { path: 'conges', component: RhCongesComponent },
  { path: 'employes', component: RhEmployesComponent },
  { path: 'recrutement', component: RHRecrutementComponent },
  { path: 'tests', component: RhTestsComponent },
  // { path: 'calendar', component: CalendarViewComponent },
  // { path: 'tests-interface', component: RhTestsInterfaceComponent },
  { path: 'rapports', component: RhRapportsComponent },
  { path: 'chat', component: AdminChatComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
