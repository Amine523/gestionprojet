import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { Projet } from '../model/projet.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  constructor(private api: ApiService) {}

  getProjetsBySociete(societeId: string): Observable<Projet[]> {
    return this.api.getProjetsBySociete(societeId);
  }

  getProjetsParUtilisateur(societeId: string, utilisateurId: string): Observable<Projet[]> {
    return forkJoin({
      projets: this.api.getProjetsBySociete(societeId),
      membres: this.api.post<any[]>(`membresdeprojet/ListeDetailleParCondition`, { Criteres: { 'UtilisateurId': utilisateurId } }).pipe(
        catchError(() => of([]))
      ),
      tachesAssigned: this.api.getTachesParUtilisateur(utilisateurId).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map(({ projets, membres, tachesAssigned }) => {
        const memberList = Array.isArray(membres) ? membres : (membres as any)?.value || (membres as any)?.items || [];
        const projectIdsForUser = new Set([
          ...memberList.map((m: any) => m.projetId || m.ProjetId),
          ...(tachesAssigned || []).map((t: any) => t.projetId || t.ProjetId)
        ]);
        return (projets || []).filter((p: any) => projectIdsForUser.has(p.id || p.Id));
      })
    );
  }

  getCurrentUser() {
    return this.api.getCurrentUser();
  }
}
