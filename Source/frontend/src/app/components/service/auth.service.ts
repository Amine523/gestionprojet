import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User } from '../model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api/auth';

  // Signals for reactive state management
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);
  private _token = signal<string | null>(null);

  // Public readonly signals
  currentUser = () => this._currentUser.asReadonly();
  isAuthenticated = () => this._isAuthenticated.asReadonly();
  token = () => this._token.asReadonly();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (storedToken && storedUser) {
      this._token.set(storedToken);
      this._currentUser.set(JSON.parse(storedUser));
      this._isAuthenticated.set(true);
    }
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        this.handleAuthResponse(response, rememberMe);
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw this.handleError(error);
      })
    );
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData).pipe(
      tap(user => {
        console.log('User registered successfully:', user);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw this.handleError(error);
      })
    );
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');

    // Clear signals
    this._token.set(null);
    this._currentUser.set(null);
    this._isAuthenticated.set(false);

    // Navigate to login
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      tap(response => {
        this._token.set(response.token);
        localStorage.setItem('authToken', response.token);
      }),
      catchError(error => {
        this.logout();
        throw error;
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      tap(() => {
        console.log('Password reset email sent');
      }),
      catchError(error => {
        console.error('Forgot password error:', error);
        throw this.handleError(error);
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      tap(() => {
        console.log('Password reset successful');
      }),
      catchError(error => {
        console.error('Reset password error:', error);
        throw this.handleError(error);
      })
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData).pipe(
      tap(updatedUser => {
        this._currentUser.set(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }),
      catchError(error => {
        console.error('Update profile error:', error);
        throw this.handleError(error);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      tap(() => {
        console.log('Password changed successfully');
      }),
      catchError(error => {
        console.error('Change password error:', error);
        throw this.handleError(error);
      })
    );
  }

  // Helper methods
  hasRole(role: string): boolean {
    const user = this._currentUser();
    return user?.roles?.includes(role) || user?.typeUtilisateurId === role;
  }

  hasPermission(permission: string): boolean {
    const user = this._currentUser();
    return user?.permissions?.includes(permission) || false;
  }

  getAuthToken(): string | null {
    return this._token();
  }

  isTokenExpired(): boolean {
    const token = this._token();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private handleAuthResponse(response: LoginResponse, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('authToken', response.token);
    storage.setItem('currentUser', JSON.stringify(response.user));

    this._token.set(response.token);
    this._currentUser.set(response.user);
    this._isAuthenticated.set(true);
  }

  private handleError(error: any): Error {
    if (error.status === 401) {
      return new Error('Identifiants incorrects');
    } else if (error.status === 403) {
      return new Error('Accès non autorisé');
    } else if (error.status === 429) {
      return new Error('Trop de tentatives, veuillez réessayer plus tard');
    } else if (error.error?.message) {
      return new Error(error.error.message);
    } else {
      return new Error('Une erreur est survenue, veuillez réessayer');
    }
  }
}
