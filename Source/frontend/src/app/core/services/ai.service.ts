import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5221/api/AI';

  // État de santé de l'IA
  isHealthy = signal<boolean>(true);

  constructor() {
    this.startHealthCheck();
  }

  /**
   * Génération de texte / Chat IA
   */
  generate(prompt: string, context?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate`, { prompt, context });
  }

  /**
   * Analyse prédictive des retards de projet
   */
  predictProjectDelay(projectId: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/predict-project-delay`, { projectId, ...data });
  }

  /**
   * Analyse IA d'un candidat (Scoring)
   */
  analyzeCandidate(candidateData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/analyze-candidate`, candidateData);
  }

  /**
   * Analyse de performance et bien-être développeur
   */
  analyzeDeveloper(userId: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/analyze-developer`, { userId, ...data });
  }

  /**
   * Vérification périodique du statut du service IA
   */
  private startHealthCheck() {
    timer(0, 60000).pipe(
      switchMap(() => this.http.get<{ status: string }>(`${this.baseUrl}/health`).pipe(
        catchError(() => of({ status: 'unhealthy' }))
      ))
    ).subscribe(res => {
      this.isHealthy.set(res.status === 'healthy' || res.status === 'ok');
    });
  }

  getRhInsights(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/rh/insights`, payload);
  }

  getDashboardInsights(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/dashboard/insights`, payload);
  }

  search(endpoint: string, criteria: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, criteria);
  }
}
