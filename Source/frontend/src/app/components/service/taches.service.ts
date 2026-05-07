import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Tache, Sprint, TacheFormData, SprintFormData } from '../model/taches.model';

@Injectable({
  providedIn: 'root'
})
export class TachesService {
  private http = inject(HttpClient);
  private apiUrl = '/api/taches';

  // Signals for reactive state management
  private _taches = signal<Tache[]>([]);
  private _sprints = signal<Sprint[]>([]);

  // Public readonly signals
  taches$ = () => this._taches.asReadonly();
  sprints$ = () => this._sprints.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getTaches().subscribe();
    this.getSprints().subscribe();
  }

  // Tache CRUD operations
  getTaches(filtres?: any): Observable<Tache[]> {
    const params = this.buildTacheQueryParams(filtres);
    return this.http.get<Tache[]>(`${this.apiUrl}/taches`, { params }).pipe(
      tap(taches => {
        this._taches.set(taches);
      }),
      catchError(error => {
        console.error('Error loading taches:', error);
        return of([]);
      })
    );
  }

  getTache(id: string): Observable<Tache | null> {
    return this.http.get<Tache>(`${this.apiUrl}/taches/${id}`).pipe(
      catchError(error => {
        console.error(`Error loading tache ${id}:`, error);
        return of(null);
      })
    );
  }

  createTache(tacheData: TacheFormData): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/taches`, tacheData).pipe(
      tap(tache => {
        const currentTaches = this._taches();
        this._taches.set([...currentTaches, tache]);
      }),
      catchError(error => {
        console.error('Error creating tache:', error);
        throw error;
      })
    );
  }

  updateTache(id: string, tacheData: Partial<TacheFormData>): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/taches/${id}`, tacheData).pipe(
      tap(updatedTache => {
        const currentTaches = this._taches();
        const updatedTaches = currentTaches.map(t => 
          t.id === id ? updatedTache : t
        );
        this._taches.set(updatedTaches);
      }),
      catchError(error => {
        console.error(`Error updating tache ${id}:`, error);
        throw error;
      })
    );
  }

  updateTacheStatus(id: string, statut: string): Observable<Tache> {
    return this.http.patch<Tache>(`${this.apiUrl}/taches/${id}/statut`, { statut }).pipe(
      tap(updatedTache => {
        const currentTaches = this._taches();
        const updatedTaches = currentTaches.map(t => 
          t.id === id ? updatedTache : t
        );
        this._taches.set(updatedTaches);
      }),
      catchError(error => {
        console.error(`Error updating tache status ${id}:`, error);
        throw error;
      })
    );
  }

  deleteTache(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/taches/${id}`).pipe(
      tap(() => {
        const currentTaches = this._taches();
        const updatedTaches = currentTaches.filter(t => t.id !== id);
        this._taches.set(updatedTaches);
      }),
      catchError(error => {
        console.error(`Error deleting tache ${id}:`, error);
        throw error;
      })
    );
  }

  // Sprint CRUD operations
  getSprints(projetId?: string): Observable<Sprint[]> {
    const params = projetId ? { projetId } : {};
    return this.http.get<Sprint[]>(`${this.apiUrl}/sprints`, { params }).pipe(
      tap(sprints => {
        this._sprints.set(sprints);
      }),
      catchError(error => {
        console.error('Error loading sprints:', error);
        return of([]);
      })
    );
  }

  getSprint(id: string): Observable<Sprint | null> {
    return this.http.get<Sprint>(`${this.apiUrl}/sprints/${id}`).pipe(
      catchError(error => {
        console.error(`Error loading sprint ${id}:`, error);
        return of(null);
      })
    );
  }

  createSprint(sprintData: SprintFormData): Observable<Sprint> {
    return this.http.post<Sprint>(`${this.apiUrl}/sprints`, sprintData).pipe(
      tap(sprint => {
        const currentSprints = this._sprints();
        this._sprints.set([...currentSprints, sprint]);
      }),
      catchError(error => {
        console.error('Error creating sprint:', error);
        throw error;
      })
    );
  }

  updateSprint(id: string, sprintData: Partial<SprintFormData>): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.apiUrl}/sprints/${id}`, sprintData).pipe(
      tap(updatedSprint => {
        const currentSprints = this._sprints();
        const updatedSprints = currentSprints.map(s => 
          s.id === id ? updatedSprint : s
        );
        this._sprints.set(updatedSprints);
      }),
      catchError(error => {
        console.error(`Error updating sprint ${id}:`, error);
        throw error;
      })
    );
  }

  deleteSprint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sprints/${id}`).pipe(
      tap(() => {
        const currentSprints = this._sprints();
        const updatedSprints = currentSprints.filter(s => s.id !== id);
        this._sprints.set(updatedSprints);
      }),
      catchError(error => {
        console.error(`Error deleting sprint ${id}:`, error);
        throw error;
      })
    );
  }

  // Helper methods
  getProjets(): Observable<any[]> {
    return this.http.get<any[]>('/api/projets').pipe(
      catchError(error => {
        console.error('Error loading projets:', error);
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

  private buildTacheQueryParams(filtres?: any): any {
    if (!filtres) return {};
    
    const params: any = {};
    if (filtres.projetId) params.projetId = filtres.projetId;
    if (filtres.statut) params.statut = filtres.statut;
    if (filtres.assigneA) params.assigneA = filtres.assigneA;
    if (filtres.priorite) params.priorite = filtres.priorite;
    
    return params;
  }
}
