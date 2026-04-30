import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { Utilisateur, LoginRequest, LoginResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = 'http://localhost:5221/api/auth'; // A adapter selon l'environnement
  private readonly TOKEN_KEY = 'gestprojet_token';
  private readonly USER_KEY = 'gestprojet_user';

  // Signals pour une gestion réactive de l'état
  currentUser = signal<Utilisateur | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    // Synchroniser l'utilisateur si nécessaire
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.utilisateur));
    this.currentUser.set(authResult.utilisateur);
  }

  private getUserFromStorage(): Utilisateur | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/roles`);
  }

  getUserRole(): string {
    const user = this.currentUser();
    if (!user) return 'guest';
    
    // Logique de mapping des rôles (à adapter selon les IDs retournés par l'API)
    const roleId = user.typeUtilisateurId?.toLowerCase() || '';
    
    if (roleId === 'super_admin' || roleId === 't001') return 'SUPER_ADMIN';
    if (roleId === 'admin_societe' || roleId === 't002') return 'ADMIN_SOCIETE';
    if (roleId === 'rh' || roleId === 't003') return 'RH';
    if (roleId === 'chef_projet' || roleId === 't004') return 'CHEF_PROJET';
    if (roleId === 'developpeur' || roleId === 't005') return 'DEVELOPPEUR';
    if (roleId === 'testeur' || roleId === 't006') return 'TESTEUR_QA';
    
    return 'USER';
  }

  hasRole(roles: string[]): boolean {
    const currentRole = this.getUserRole();
    return roles.includes(currentRole);
  }
}
