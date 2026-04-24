import { Routes } from '@angular/router';
import { TesteurCongesComponent } from './pages/testeur-conges/testeur-conges.component';
import { TesteurPointageComponent } from './pages/testeur-pointage/testeur-pointage.component';

export const TESTEUR_ROUTES: Routes = [
  { path: 'conges', component: TesteurCongesComponent },
  { path: 'pointage', component: TesteurPointageComponent },
  { path: '', redirectTo: 'conges', pathMatch: 'full' }
];
