import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardSyncService {
  private api = inject(ApiService);

  getStatsForRole(role: string, id: string): Observable<any> {
    switch (role.toLowerCase()) {
      case 'admin':
        return this.api.getAdminDashboardStats(id);
      case 'superadmin':
        return this.api.getSuperAdminDashboardStats();
      case 'client':
        return this.api.getClientDashboardStats(id);
      case 'rh':
        return this.api.getRhDashboardStats(id);
      case 'dev':
        return this.api.getDevDashboardStats(id);
      default:
        return of({ error: 'Role non supporté' });
    }
  }

  // Common mapping to unify different backend responses if needed
  unifyStats(data: any, role: string) {
    // Implement logic to return a standard object format if possible
    return data;
  }
}
