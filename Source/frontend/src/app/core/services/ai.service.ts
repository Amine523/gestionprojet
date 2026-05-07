import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private baseUrl = '/api/AI';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('app_token');
    const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  checkStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/status`, { headers: this.getHeaders() }).pipe(
      catchError(() => of({ available: false }))
    );
  }

  getProjectInsights(data: any): Observable<any> {
    const payload = { data: JSON.stringify(data) };
    return this.http.post(`${this.baseUrl}/project-insights`, payload, { headers: this.getHeaders() });
  }

  getRhInsights(data: any): Observable<any> {
    const payload = { data: JSON.stringify(data) };
    return this.http.post(`${this.baseUrl}/rh-insights`, payload, { headers: this.getHeaders() });
  }

  getDashboardInsights(data: any): Observable<any> {
    const payload = { data: JSON.stringify(data) };
    return this.http.post(`${this.baseUrl}/dashboard-insights`, payload, { headers: this.getHeaders() });
  }

  chat(message: string, context: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat`, { message, context }, { headers: this.getHeaders() });
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
