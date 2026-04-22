import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private baseUrl = 'http://localhost:5221/api/ai';

  constructor(private http: HttpClient) {}

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
    return this.http.post(`http://localhost:5221/api/Evaluation`, request, { headers: this.getHeaders() });
  }

  getEvaluationHealth(): Observable<any> {
    return this.http.get(`http://localhost:5221/api/Evaluation/health`, { headers: this.getHeaders() });
  }
}
