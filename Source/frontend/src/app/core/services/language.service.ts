import { Injectable, signal } from '@angular/core';

export type Language = 'fr' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = signal<Language>('fr');

  translations: any = {
    fr: {
      settings: 'Paramètres',
      profile: 'Profil',
      manage_profile: 'Gérez votre profil et préférences',
      name: 'Nom',
      email: 'Email',
      societe: 'Société',
      save: 'Enregistrer',
      notifications: 'Notifications',
      new_tasks: 'Nouvelles tâches assignées',
      bugs: 'Bugs assignés',
      comments: 'Commentaires',
      mentions: 'Mentions',
      preferences: 'Préférences',
      dark_mode: 'Mode sombre',
      compact_kanban: 'Compact Kanban',
      language: 'Langue',
      photo: 'Photo de profil',
      upload: 'Télécharger une photo',
      success_save: 'Profil enregistré avec succès',
      success_notif: 'Notifications mises à jour',
      success_prefs: 'Préférences mises à jour'
    },
    en: {
      settings: 'Settings',
      profile: 'Profile',
      manage_profile: 'Manage your profile and preferences',
      name: 'Name',
      email: 'Email',
      societe: 'Company',
      save: 'Save Changes',
      notifications: 'Notifications',
      new_tasks: 'New assigned tasks',
      bugs: 'Assigned bugs',
      comments: 'Comments',
      mentions: 'Mentions',
      preferences: 'Preferences',
      dark_mode: 'Dark Mode',
      compact_kanban: 'Compact Kanban',
      language: 'Language',
      photo: 'Profile Photo',
      upload: 'Upload photo',
      success_save: 'Profile saved successfully',
      success_notif: 'Notifications updated',
      success_prefs: 'Preferences updated'
    }
  };

  constructor() {
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved) {
      this.currentLang.set(saved);
    }
  }

  get lang() {
    return this.currentLang();
  }

  setLanguage(l: Language) {
    this.currentLang.set(l);
    localStorage.setItem('app_lang', l);
  }

  translate(key: string): string {
    return this.translations[this.currentLang()][key] || key;
  }
}
