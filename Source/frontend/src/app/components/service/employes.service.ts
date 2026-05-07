import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Employe, EmployeFormData, FiltreEmploye, EmployeStats } from '../model/employes.model';

@Injectable({
  providedIn: 'root'
})
export class EmployesService {
  private http = inject(HttpClient);
  private apiUrl = '/api/employes';

  // Signals for reactive state management
  private _employes = signal<Employe[]>([]);
  private _stats = signal<EmployeStats>({
    total: 0,
    actifs: 0,
    enConge: 0,
    nouveaux: 0,
    parType: {}
  });

  // Public readonly signals
  employes$ = () => this._employes.asReadonly();
  stats = () => this._stats.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getEmployes().subscribe();
  }

  // CRUD operations
  getEmployes(filtres?: FiltreEmploye): Observable<Employe[]> {
    const params = this.buildQueryParams(filtres);
    return this.http.get<Employe[]>(this.apiUrl, { params }).pipe(
      tap(employes => {
        this._employes.set(employes);
        this.updateStats(employes);
      }),
      catchError(error => {
        console.error('Error loading employes:', error);
        return of([]);
      })
    );
  }

  getEmploye(id: string): Observable<Employe | null> {
    return this.http.get<Employe>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error loading employe ${id}:`, error);
        return of(null);
      })
    );
  }

  createEmploye(employeData: EmployeFormData): Observable<Employe> {
    return this.http.post<Employe>(this.apiUrl, employeData).pipe(
      tap(employe => {
        const currentEmployes = this._employes();
        this._employes.set([...currentEmployes, employe]);
        this.updateStats([...currentEmployes, employe]);
      }),
      catchError(error => {
        console.error('Error creating employe:', error);
        throw error;
      })
    );
  }

  updateEmploye(id: string, employeData: Partial<EmployeFormData>): Observable<Employe> {
    return this.http.put<Employe>(`${this.apiUrl}/${id}`, employeData).pipe(
      tap(updatedEmploye => {
        const currentEmployes = this._employes();
        const updatedEmployes = currentEmployes.map(e => 
          e.id === id ? updatedEmploye : e
        );
        this._employes.set(updatedEmployes);
        this.updateStats(updatedEmployes);
      }),
      catchError(error => {
        console.error(`Error updating employe ${id}:`, error);
        throw error;
      })
    );
  }

  deleteEmploye(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentEmployes = this._employes();
        const updatedEmployes = currentEmployes.filter(e => e.id !== id);
        this._employes.set(updatedEmployes);
        this.updateStats(updatedEmployes);
      }),
      catchError(error => {
        console.error(`Error deleting employe ${id}:`, error);
        throw error;
      })
    );
  }

  // Helper methods
  getSocietes(): Observable<any[]> {
    return this.http.get<any[]>('/api/societes').pipe(
      catchError(error => {
        console.error('Error loading societes:', error);
        return of([]);
      })
    );
  }

  private buildQueryParams(filtres?: FiltreEmploye): any {
    if (!filtres) return {};
    
    const params: any = {};
    if (filtres.recherche) params.recherche = filtres.recherche;
    if (filtres.typeUtilisateurId) params.typeUtilisateurId = filtres.typeUtilisateurId;
    if (filtres.statut) params.statut = filtres.statut;
    if (filtres.societeId) params.societeId = filtres.societeId;
    
    return params;
  }

  private updateStats(employes: Employe[]) {
    const stats: EmployeStats = {
      total: employes.length,
      actifs: employes.filter(e => e.statut === 'actif').length,
      enConge: employes.filter(e => e.statut === 'en_conge').length,
      nouveaux: employes.filter(e => {
        const createdDate = new Date(e.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate > thirtyDaysAgo;
      }).length,
      parType: {}
    };

    // Calculate parType stats
    employes.forEach(e => {
      const type = this.getRoleLabel(e.typeUtilisateurId);
      stats.parType[type] = (stats.parType[type] || 0) + 1;
    });

    this._stats.set(stats);
  }

  private getRoleLabel(typeId: string): string {
    const types: { [key: string]: string } = {
      'T001': 'Super Admin',
      'T002': 'Admin Société',
      'T003': 'RH',
      'T004': 'Chef de Projet',
      'T005': 'Développeur',
      'T006': 'Testeur/QA',
      'T007': 'Candidat',
      'T008': 'Client'
    };
    return types[typeId] || typeId;
  }

  // Utility methods
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
}
