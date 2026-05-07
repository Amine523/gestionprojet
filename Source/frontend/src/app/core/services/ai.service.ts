import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private baseUrl = '/api/AI';

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

  evaluate(request: any): Observable<any> {
    return this.http.post(`/api/Evaluation`, request, { headers: this.getHeaders() });
  }

  getEvaluationHealth(): Observable<any> {
    return this.http.get(`/api/Evaluation/health`, { headers: this.getHeaders() });
  }

  generateQuestions(topic: string, count: number = 5): Observable<any> {
    const payload = { topic, questionCount: count, questionType: 'QCM' };
    const fallbackPrompt = `[STRICT JSON ONLY] Generate ${count} technical MCQ questions about: ${topic}. 
Format: [{"q":"Question?","options":["A","B","C","D"],"correct":0}]. 
No preamble or conclusion.`;

    return this.http.post<any>(
      `${this.baseUrl}/generate-tests`,
      payload,
      { headers: this.getHeaders() }
    ).pipe(
      map((res: any) => {
        // Normalize response shape for legacy consumers expecting res.response
        if (res?.generatedQuestions && !res?.response) {
          return { ...res, response: res.generatedQuestions };
        }
        return res;
      }),
      catchError((err) => {
        // Backward-compatible fallback when backend doesn't expose /generate-tests yet
        if (err?.status === 404) {
          return this.http.post<any>(
            `${this.baseUrl}/generate`,
            { prompt: fallbackPrompt, model: 'llama3.2:1b' },
            { headers: this.getHeaders() }
          );
        }
        return throwError(() => err);
      })
    );
  }

  generateResponse(prompt: string, context: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/chat`, { message: prompt, context }, { headers: this.getHeaders() }).pipe(
      catchError(() => of({ message: "Désolé, le service IA est indisponible." })),
      // Assuming the backend returns { message: "..." } or similar
      // We map it to just the message string for the dashboards
      map((res: any) => res.message || res.insight || res.response || res.text || JSON.stringify(res))
    );
  }
}
