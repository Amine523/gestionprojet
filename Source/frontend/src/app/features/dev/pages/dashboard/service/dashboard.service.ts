import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { DashboardStats, Task } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getTachesParUtilisateur(userId: string): Observable<Task[]> {
    return this.api.getTachesParUtilisateur(userId);
  }

  getPointageAujourdhui(userId: string): Observable<any> {
    return this.api.getPointageAujourdhui(userId);
  }

  pointerEntree(userId: string): Observable<any> {
    return this.api.pointerEntree(userId);
  }

  pointerSortie(userId: string): Observable<any> {
    return this.api.pointerSortie(userId);
  }

  createNotification(societeId: string, type: string, titre: string, message: string): Observable<any> {
    return this.api.createNotification(societeId, type, titre, message);
  }

  getCurrentUser() {
    return this.api.getCurrentUser();
  }

  getCurrentUserId(): string {
    return this.api.getCurrentUserId();
  }

  getCurrentSocieteId(): string {
    return this.api.getCurrentSocieteId();
  }
}
