import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap, tap, retry } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private readonly baseUrl = 'http://localhost:5221/api/notifications';

  // Signal pour le compteur de notifications non lues
  unreadCount = signal<number>(0);
  notifications = signal<any[]>([]);

  constructor() {
    // Optionnel: Démarrer le polling si l'utilisateur est connecté
  }

  /**
   * Récupère les notifications pour un utilisateur
   */
  getForUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`).pipe(
      tap(notifs => {
        this.notifications.set(notifs);
        this.unreadCount.set(notifs.filter(n => !n.estLu).length);
      })
    );
  }

  /**
   * Démarre le polling des notifications (toutes les 30s)
   */
  startPolling(userId: string) {
    timer(0, 30000).pipe(
      switchMap(() => this.getForUser(userId)),
      retry()
    ).subscribe();
  }

  /**
   * Envoie une notification à un utilisateur spécifique
   */
  sendToUser(payload: { userId: string, title: string, message: string, type: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-to-user`, payload);
  }

  /**
   * Envoie une notification à toute une société (Super Admin)
   */
  sendToSociete(payload: { societeId: string, title: string, message: string, type: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-to-societe`, payload);
  }

  /**
   * Affiche un toast (Snack-bar)
   */
  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: [`toast-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  notifyUser(userId: string, title: string, message: string, type: string = 'info'): Observable<any> {
    return this.sendToUser({ userId, title, message, type });
  }

  notifySociete(societeId: string, title: string, message: string, type: string = 'info'): Observable<any> {
    return this.sendToSociete({ societeId, title, message, type });
  }
}
