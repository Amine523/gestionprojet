import { Routes } from '@angular/router';
import { DeveloppeurCongesComponent } from './pages/developpeur-conges/developpeur-conges.component';
import { DeveloppeurPointageComponent } from './pages/developpeur-pointage/developpeur-pointage.component';

export const DEVELOPPEUR_ROUTES: Routes = [
  { path: 'conges', component: DeveloppeurCongesComponent },
  { path: 'pointage', component: DeveloppeurPointageComponent },
  { path: '', redirectTo: 'conges', pathMatch: 'full' }
];
