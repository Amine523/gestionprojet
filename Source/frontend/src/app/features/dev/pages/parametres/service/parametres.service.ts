import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Profil, Notifications, Preferences } from '../model/parametres.model';

@Injectable({
  providedIn: 'root'
})
export class ParametresService {
  constructor(private api: ApiService) {}

  getCurrentUser() {
    return this.api.getCurrentUser();
  }

  getCurrentSocieteId(): string {
    return this.api.getCurrentSocieteId();
  }

  loadNotifications(): Notifications {
    const notifData = JSON.parse(localStorage.getItem('user_notifications') || '{}');
    return notifData.dev || { taches: true, bugs: true, commentaires: true, mentions: true };
  }

  saveNotifications(notifications: Notifications) {
    const notifData = JSON.parse(localStorage.getItem('user_notifications') || '{}');
    notifData.dev = notifications;
    localStorage.setItem('user_notifications', JSON.stringify(notifData));
  }

  loadPreferences(): Preferences {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    return prefs.dev || { darkMode: false, compactKanban: false };
  }

  savePreferences(preferences: Preferences) {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    prefs.dev = preferences;
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
  }

  updateCurrentUser(profil: Partial<Profil>) {
    this.api.updateCurrentUser(profil);
  }

  applyDarkMode(darkMode: boolean) {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  createProfil(user: any): Profil {
    return {
      nom: user?.nom || user?.Nom || 'Utilisateur',
      email: user?.email || user?.Email || '',
      role: ApiService.getRoleLabel(user?.typeUtilisateurId || 'T005'),
      initials: (user?.nom || user?.Nom || 'U').charAt(0).toUpperCase(),
      photo: user?.photo || ''
    };
  }

  getSocieteNom(user: any): string {
    return user?.societe?.nom || user?.Societe?.nom || 'LeaderTec';
  }
}
