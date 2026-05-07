import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Tache } from '../model/tache.model';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  constructor(private api: ApiService) {}

  getTachesParUtilisateur(userId: string): Observable<Tache[]> {
    return this.api.getTachesParUtilisateur(userId);
  }

  getEmployesBySociete(societeId: string): Observable<any> {
    return this.api.getEmployesBySociete(societeId);
  }

  getProjets(): Observable<any> {
    return this.api.getProjets();
  }

  saveTache(payload: any): Observable<any> {
    return this.api.saveTache(payload);
  }

  createNotification(societeId: string, type: string, titre: string, message: string): Observable<any> {
    return this.api.createNotification(societeId, type, titre, message);
  }

  getCurrentUser() {
    return this.api.getCurrentUser();
  }

  getCurrentUserId(): string {
    const user = this.api.getCurrentUser();
    return user?.id || user?.Id || '';
  }

  getCurrentSocieteId(): string {
    return this.api.getCurrentSocieteId();
  }
}
