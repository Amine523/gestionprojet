import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterCompanyComponent } from './pages/register-company.component';

export const AUTH_ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register-company', component: RegisterCompanyComponent }
];
