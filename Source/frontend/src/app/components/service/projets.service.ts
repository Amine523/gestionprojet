import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Projet, ProjetFormData, FiltreProjet, ProjetStats } from '../model/projets.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetsService {
  private http = inject(HttpClient);
  private apiUrl = '/api/projets';

  // Signals for reactive state management
  private _projets = signal<Projet[]>([]);
  private _stats = signal<ProjetStats>({
    total: 0,
    enCours: 0,
    termines: 0,
    enPause: 0,
    annules: 0
  });

  // Public readonly signals
  projets$ = () => this._projets.asReadonly();
  stats = () => this._stats.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Load initial data
    this.getProjets().subscribe();
  }

  // CRUD operations
  getProjets(filtres?: FiltreProjet): Observable<Projet[]> {
    const params = this.buildQueryParams(filtres);
    return this.http.get<Projet[]>(this.apiUrl, { params }).pipe(
      tap(projets => {
        this._projets.set(projets);
        this.updateStats(projets);
      }),
      catchError(error => {
        console.error('Error loading projets:', error);
        return of([]);
      })
    );
  }

  getProjet(id: string): Observable<Projet | null> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error loading projet ${id}:`, error);
        return of(null);
      })
    );
  }

  createProjet(projetData: ProjetFormData): Observable<Projet> {
    return this.http.post<Projet>(this.apiUrl, projetData).pipe(
      tap(projet => {
        const currentProjets = this._projets();
        this._projets.set([...currentProjets, projet]);
        this.updateStats([...currentProjets, projet]);
      }),
      catchError(error => {
        console.error('Error creating projet:', error);
        throw error;
      })
    );
  }

  updateProjet(id: string, projetData: Partial<ProjetFormData>): Observable<Projet> {
    return this.http.put<Projet>(`${this.apiUrl}/${id}`, projetData).pipe(
      tap(updatedProjet => {
        const currentProjets = this._projets();
        const updatedProjets = currentProjets.map(p => 
          p.id === id ? updatedProjet : p
        );
        this._projets.set(updatedProjets);
        this.updateStats(updatedProjets);
      }),
      catchError(error => {
        console.error(`Error updating projet ${id}:`, error);
        throw error;
      })
    );
  }

  deleteProjet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentProjets = this._projets();
        const updatedProjets = currentProjets.filter(p => p.id !== id);
        this._projets.set(updatedProjets);
        this.updateStats(updatedProjets);
      }),
      catchError(error => {
        console.error(`Error deleting projet ${id}:`, error);
        throw error;
      })
    );
  }

  // Helper methods
  getClients(): Observable<any[]> {
    return this.http.get<any[]>('/api/clients').pipe(
      catchError(error => {
        console.error('Error loading clients:', error);
        return of([]);
      })
    );
  }

  getEmployes(): Observable<any[]> {
    return this.http.get<any[]>('/api/employes').pipe(
      catchError(error => {
        console.error('Error loading employes:', error);
        return of([]);
      })
    );
  }

  private buildQueryParams(filtres?: FiltreProjet): any {
    if (!filtres) return {};
    
    const params: any = {};
    if (filtres.recherche) params.recherche = filtres.recherche;
    if (filtres.statut) params.statut = filtres.statut;
    if (filtres.clientId) params.clientId = filtres.clientId;
    if (filtres.chefProjetId) params.chefProjetId = filtres.chefProjetId;
    if (filtres.dateDebut) params.dateDebut = filtres.dateDebut;
    if (filtres.dateFin) params.dateFin = filtres.dateFin;
    
    return params;
  }

  private updateStats(projets: Projet[]) {
    const stats: ProjetStats = {
      total: projets.length,
      enCours: projets.filter(p => p.statut === 'en_cours').length,
      termines: projets.filter(p => p.statut === 'termine').length,
      enPause: projets.filter(p => p.statut === 'en_pause').length,
      annules: projets.filter(p => p.statut === 'annule').length
    };
    this._stats.set(stats);
  }

  // Utility methods
  getCurrentUser(): any {
    // Implementation depends on your auth service
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
}
