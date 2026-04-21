import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = signal('fr');

  private translations: any = {
    'fr': {
      'COMMAND_CENTER': 'Centre de Commandement',
      'DASHBOARD': 'Tableau de Bord',
      'EMPLOYEES': 'Employés',
      'PROJECTS': 'Projets',
      'SETTINGS': 'Paramètres',
      'LOGOUT': 'Déconnexion',
      'WELCOME': 'Bienvenue sur NADHEMNI',
      'TOTAL_SOCIETES': 'Total Sociétés',
      'TOTAL_USERS': 'Total Utilisateurs',
      'ACTIVE_PROJECTS': 'Projets Actifs',
      'SEARCH': 'Rechercher...',
      'ACTIONS': 'Actions',
      'SAVE': 'Enregistrer',
      'CANCEL': 'Annuler'
    },
    'en': {
      'COMMAND_CENTER': 'Command Center',
      'DASHBOARD': 'Dashboard',
      'EMPLOYEES': 'Employees',
      'PROJECTS': 'Projects',
      'SETTINGS': 'Settings',
      'LOGOUT': 'Logout',
      'WELCOME': 'Welcome to NADHEMNI',
      'TOTAL_SOCIETES': 'Total Companies',
      'TOTAL_USERS': 'Total Users',
      'ACTIVE_PROJECTS': 'Active Projects',
      'SEARCH': 'Search...',
      'ACTIONS': 'Actions',
      'SAVE': 'Save',
      'CANCEL': 'Cancel'
    },
    'ar': {
      'COMMAND_CENTER': 'مركز القيادة',
      'DASHBOARD': 'لوحة القيادة',
      'EMPLOYEES': 'الموظفون',
      'PROJECTS': 'المشاريع',
      'SETTINGS': 'الإعدادات',
      'LOGOUT': 'تسجيل الخروج',
      'WELCOME': 'مرحبا بكم في نظمني',
      'TOTAL_SOCIETES': 'إجمالي الشركات',
      'TOTAL_USERS': 'إجمالي المستخدمين',
      'ACTIVE_PROJECTS': 'المشاريع النشطة',
      'SEARCH': 'بحث...',
      'ACTIONS': 'إجراءات',
      'SAVE': 'حفظ',
      'CANCEL': 'إلغاء'
    }
  };

  constructor() {
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang) this.currentLang.set(savedLang);
  }

  get(key: string): string {
    return this.translations[this.currentLang()][key] || key;
  }

  setLanguage(lang: string) {
    this.currentLang.set(lang);
    localStorage.setItem('app_lang', lang);
  }

  getCurrentLang() {
    return this.currentLang;
  }
}
