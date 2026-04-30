import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiGenericService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5221/api';

  /**
   * Récupère une page de données pour un endpoint donné
   */
  getPage<T>(endpoint: string, page: number, size: number, filters?: any): Observable<any> {
    let params = new HttpParams()
      .set('pageNumero', page.toString())
      .set('pageTaille', size.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<any>(`${this.baseUrl}/${endpoint}/ListeParPage`, { params });
  }

  /**
   * Recherche par critères (POST /liste-par-condition)
   */
  search<T>(endpoint: string, criteria: any): Observable<T[]> {
    return this.http.post<T[]>(`${this.baseUrl}/${endpoint}/liste-par-condition`, criteria);
  }

  /**
   * Ajoute ou modifie une entité
   */
  ajouterOuModifier<T>(endpoint: string, data: any): Observable<any> {
    // Si l'objet a un ID, c'est une modification
    const isUpdate = !!(data.id || data.Id);
    const url = isUpdate ? `${this.baseUrl}/${endpoint}/modifier` : `${this.baseUrl}/${endpoint}/ajouter`;
    
    if (isUpdate) {
      return this.http.put(url, data, { responseType: 'text' as 'json' });
    }
    return this.http.post(url, data, { responseType: 'text' as 'json' });
  }

  /**
   * Suppression par ID
   */
  delete(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/supprimer/id/${id}`, { responseType: 'text' as 'json' });
  }

  /**
   * Get by ID
   */
  getById<T>(endpoint: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/obtenir/id/${id}`);
  }
}
