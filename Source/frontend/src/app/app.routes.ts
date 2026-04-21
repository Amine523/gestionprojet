import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { SuperAdminLayoutComponent } from './components/super-admin-layout/super-admin-layout.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminSocietesComponent } from './components/super-admin-societes/super-admin-societes.component';
import { SuperAdminUtilisateursComponent } from './components/super-admin-utilisateurs/super-admin-utilisateurs.component';
import { SuperAdminRolesComponent } from './components/super-admin-roles/super-admin-roles.component';
import { SuperAdminModulesComponent } from './components/super-admin-modules/super-admin-modules.component';
import { SuperAdminAbonnementsComponent } from './components/super-admin-abonnements/super-admin-abonnements.component';
import { SuperAdminLogsComponent } from './components/super-admin-logs/super-admin-logs.component';
import { SuperAdminParametresComponent } from './components/super-admin-parametres/super-admin-parametres.component';
import { SuperAdminSecuriteComponent } from './components/super-admin-securite/super-admin-securite.component';
import { SuperAdminIpBlockedComponent } from './components/super-admin-ipblocked/super-admin-ipblocked.component';
import { SuperAdminSurveillanceComponent } from './components/super-admin-surveillance/super-admin-surveillance.component';
import { SuperAdminPolitiqueComponent } from './components/super-admin-politique/super-admin-politique.component';
import { SuperAdminNotificationsComponent } from './components/super-admin-notifications/super-admin-notifications.component';
import { SuperAdminChatComponent } from './components/super-admin-chat/super-admin-chat.component';
import { AdminEmployesComponent } from './components/admin-employes/admin-employes.component';
import { AdminProjetsComponent } from './components/admin-projets/admin-projets.component';
import { AdminRhComponent } from './components/admin-rh/admin-rh.component';
import { AdminParametresComponent } from './components/admin-parametres/admin-parametres.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminPaiementsComponent } from './components/admin-paiements/admin-paiements.component';
import { AdminChatComponent } from './components/admin-chat/admin-chat.component';
import { RhDashboardComponent } from './components/rh-dashboard/rh-dashboard.component';
import { RhPointageComponent } from './components/rh-pointage/rh-pointage.component';
import { RhCongesComponent } from './components/rh-conges/rh-conges.component';
import { RhEmployesComponent } from './components/rh-employes/rh-employes.component';
import { RhRecrutementComponent } from './components/rh-recrutement/rh-recrutement.component';
import { RhTestsComponent } from './components/rh-tests/rh-tests.component';

import { RhRapportsComponent } from './components/rh-rapports/rh-rapports.component';
import { ChefProjetsComponent } from './components/chef-projets/chef-projets.component';
import { ChefEquipeComponent } from './components/chef-equipe/chef-equipe.component';
import { ChefTachesComponent } from './components/chef-taches/chef-taches.component';
import { ChefSuiviComponent } from './components/chef-suivi/chef-suivi.component';
import { ChefRapportsComponent } from './components/chef-rapports/chef-rapports.component';
import { ChefParametresComponent } from './components/chef-parametres/chef-parametres.component';
import { ChefDashboardComponent } from './components/chef-dashboard/chef-dashboard.component';
import { DevDashboardComponent } from './components/dev-dashboard/dev-dashboard.component';
import { DevProjetsComponent } from './components/dev-projets/dev-projets.component';
import { DevTachesComponent } from './components/dev-taches/dev-taches.component';
import { DevTimeTrackingComponent } from './components/dev-time-tracking/dev-time-tracking.component';
import { DevDocsComponent } from './components/dev-docs/dev-docs.component';
import { DevParametresComponent } from './components/dev-parametres/dev-parametres.component';
import { QaDashboardComponent } from './components/qa-dashboard/qa-dashboard.component';
import { QaTestsComponent } from './components/qa-tests/qa-tests.component';
import { QaBugsComponent } from './components/qa-bugs/qa-bugs.component';
import { QaRapportsComponent } from './components/qa-rapports/qa-rapports.component';
import { QaProjetsComponent } from './components/qa-projets/qa-projets.component';
import { QaNotificationsComponent } from './components/qa-notifications/qa-notifications.component';
import { QaPlansComponent } from './components/qa-plans/qa-plans.component';
import { TesteurLayoutComponent } from './components/testeur-layout/testeur-layout.component';
import { DeveloppeurLayoutComponent } from './components/developpeur-layout/developpeur-layout.component';
import { QaParametresComponent } from './components/qa-parametres/qa-parametres.component';
import { DashboardComponent } from './components/dashboard.component';
import { AdminSocieteLayoutComponent, RhLayoutComponent, ChefGroupeLayoutComponent, ApplicantLayoutComponent } from './components/layout/layouts.component';
import { DevCongesComponent } from './components/dev-conges/dev-conges.component';
import { CrudComponent } from './components/crud.component';
import { ChatComponent } from './components/chat.component';
import { ApplicantHomeComponent, ApplicantOffresComponent, ApplicantPostulerComponent, ApplicantProfilComponent } from './pages/applicant.component';
import { ChefBugsComponent } from './components/chef-bugs/chef-bugs.component';
import { DevBugsComponent } from './components/dev-bugs/dev-bugs.component';
import { DevApiComponent } from './components/dev-api/dev-api.component';
import { DevDiagramsComponent } from './components/dev-diagrams/dev-diagrams.component';
import { RhTestsInterfaceComponent } from './components/rh-tests-interface/rh-tests-interface.component';
import { TestsDisponiblesComponent } from './components/tests-disponibles/tests-disponibles.component';

import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  // Applicant (public)
  { path: 'applicant', component: ApplicantLayoutComponent, children: [
    { path: '', component: ApplicantHomeComponent },
    { path: 'offres', component: ApplicantOffresComponent },
    { path: 'postuler', component: ApplicantPostulerComponent },
    { path: 'profil', component: ApplicantProfilComponent }
  ]},

  // Super Admin
  { path: 'superadmin', component: SuperAdminLayoutComponent, children: [
    { path: '', component: SuperAdminDashboardComponent },
    { path: 'societes', component: SuperAdminSocietesComponent },
    { path: 'projets', component: AdminProjetsComponent },
    { path: 'utilisateurs', component: SuperAdminUtilisateursComponent },
    { path: 'roles', component: SuperAdminRolesComponent },
    { path: 'modules', component: SuperAdminModulesComponent },
    { path: 'abonnements', component: SuperAdminAbonnementsComponent },
    { path: 'statistiques', component: SuperAdminDashboardComponent },
    { path: 'logs', component: SuperAdminLogsComponent },
    { path: 'parametre', component: SuperAdminParametresComponent },
    { path: 'alertes', component: SuperAdminSecuriteComponent },
    { path: 'ipblocked', component: SuperAdminIpBlockedComponent },
    { path: 'surveillance', component: SuperAdminSurveillanceComponent },
    { path: 'politique', component: SuperAdminPolitiqueComponent },
    { path: 'notifications', component: SuperAdminNotificationsComponent },
    { path: 'chat', component: SuperAdminChatComponent },
    { path: 'tests-disponibles', component: TestsDisponiblesComponent }
  ]},

  // Admin Société
  { path: 'admin', component: AdminSocieteLayoutComponent, children: [
    { path: 'dashboard', component: AdminDashboardComponent },
    { path: 'employes', component: AdminEmployesComponent },
    { path: 'projets', component: AdminProjetsComponent },
    { path: 'rh', component: AdminRhComponent },
    { path: 'calendar', component: CalendarViewComponent },
    { path: 'paiements', component: AdminPaiementsComponent },
    { path: 'chat', component: AdminChatComponent },
    { path: 'parametres', component: AdminParametresComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},

  // RH
  { path: 'rh', component: RhLayoutComponent, children: [
    { path: 'dashboard', component: RhDashboardComponent },
    { path: 'pointage', component: RhPointageComponent },
    { path: 'conges', component: RhCongesComponent },
    { path: 'employes', component: RhEmployesComponent },
    { path: 'recrutement', component: RhRecrutementComponent },
    { path: 'tests', component: RhTestsComponent },
    { path: 'calendar', component: CalendarViewComponent },
    { path: 'tests-interface', component: RhTestsInterfaceComponent },
    { path: 'rapports', component: RhRapportsComponent },
    { path: 'chat', component: AdminChatComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},

  // Chef de Groupe
  { path: 'chef', component: ChefGroupeLayoutComponent, children: [
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
    { path: 'api', component: DevApiComponent },
    { path: 'diagrams', component: DevDiagramsComponent },
    { path: 'chat', component: AdminChatComponent },
    { path: 'parametres', component: DevParametresComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},

  // Testeur / QA
  { path: 'qa', component: TesteurLayoutComponent, children: [
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
  ]},

  // Développeur
  { path: 'dev', component: DeveloppeurLayoutComponent, children: [
    { path: 'dashboard', component: DevDashboardComponent },
    { path: 'taches', component: DevTachesComponent },
    { path: 'bugs', component: DevBugsComponent },
    { path: 'projets', component: DevProjetsComponent },
    { path: 'calendar', component: CalendarViewComponent },
    { path: 'time', component: DevTimeTrackingComponent },
    { path: 'docs', component: DevDocsComponent },
    { path: 'chat', component: AdminChatComponent },
    { path: 'conges', component: DevCongesComponent },
    { path: 'parametres', component: DevParametresComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},

  { path: '**', redirectTo: '' }
];
