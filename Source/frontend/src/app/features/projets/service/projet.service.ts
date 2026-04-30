import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGenericService } from '@core/services/api-generic.service';
import { Projet, ProjetCreate, ProjetUpdate } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private api = inject(ApiGenericService);

  getProjets(page = 1, pageSize = 10, filters?: any): Observable<any> {
    return this.api.getPage<Projet>('projets', page, pageSize, filters);
  }

  getProjetById(id: string): Observable<Projet> {
    return this.api.getById<Projet>('projets', id);
  }

  createProjet(data: ProjetCreate): Observable<Projet> {
    return this.api.ajouterOuModifier('projets', data);
  }

  updateProjet(data: ProjetUpdate): Observable<Projet> {
    return this.api.ajouterOuModifier('projets', data);
  }

  deleteProjet(id: string): Observable<void> {
    return this.api.delete('projets', id);
  }

  searchProjets(filters: any): Observable<Projet[]> {
    return this.api.search<Projet>('projets', filters);
  }
}
