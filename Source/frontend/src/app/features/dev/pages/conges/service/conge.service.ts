import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { SoldeConge, Conge, NouvelleDemande } from '../model/conge.model';

@Injectable({
  providedIn: 'root'
})
export class CongeService {
  constructor(private api: ApiService) {}

  getSoldeConge(userId: string): Observable<SoldeConge> {
    return this.api.getSoldeConge(userId);
  }

  getDemandesCongeByUtilisateur(userId: string): Observable<Conge[]> {
    return this.api.getDemandesCongeByUtilisateur(userId);
  }

  createDemandeCongeReal(dto: any): Observable<any> {
    return this.api.createDemandeCongeReal(dto);
  }

  uploadJustificatif(demandeId: string, file: File): Observable<any> {
    return this.api.uploadJustificatif(demandeId, file);
  }

  getCurrentUserId(): string {
    return this.api.getCurrentUserId();
  }

  getCurrentSocieteId(): string {
    return this.api.getCurrentSocieteId();
  }
}
