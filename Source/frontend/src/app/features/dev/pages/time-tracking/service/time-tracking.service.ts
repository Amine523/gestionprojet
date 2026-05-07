import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Pointage } from '../model/time-tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  constructor(private api: ApiService) {}

  getPointages(userId: string): Observable<Pointage[]> {
    return this.api.getPointages(userId);
  }

  getPointageAujourdhui(userId: string): Observable<any> {
    return this.api.getPointageAujourdhui(userId);
  }

  getWorkedHoursReal(userId: string): Observable<any> {
    return this.api.getWorkedHoursReal(userId);
  }

  clockIn(userId: string, societeId: string): Observable<any> {
    return this.api.clockIn(userId, societeId);
  }

  clockOut(userId: string, societeId: string, commentaire: string, pointageId?: string | number): Observable<any> {
    const idAsString = pointageId?.toString();
    return this.api.clockOut(userId, societeId, commentaire, idAsString);
  }

  getCurrentUser() {
    return this.api.getCurrentUser();
  }

  getCurrentUserId(): string {
    const user = this.api.getCurrentUser();
    return user?.id || user?.utilisateurId || '';
  }

  getCurrentSocieteId(): string {
    return this.api.getCurrentSocieteId();
  }
}
