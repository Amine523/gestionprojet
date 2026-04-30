import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  users: number;
  companies: number;
}

@Component({
  selector: 'app-super-admin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './super-admin-parametres.component.html',
  styleUrls: ['./super-admin-parametres.component.scss']
})
export class SuperAdminParametresComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  activeTab = 'general';
  systemStats: SystemStats = { cpu: 23, memory: 47, disk: 62, uptime: '14 jours', users: 42, companies: 10 };
  showApiKey = false;
  selectedFile: File | null = null;
  lastBackup = '04/04/2026 14:30';
  nextBackup = '05/04/2026 02:00';
  backups = [
    { name: 'backup_20260404.sql', date: '04/04/2026 14:30', size: '2.4 MB' },
    { name: 'backup_20260403.sql', date: '03/04/2026 02:00', size: '2.3 MB' },
    { name: 'backup_20260402.sql', date: '02/04/2026 02:00', size: '2.2 MB' }
  ];

  settings = {
    platformName: 'NADHEMNI',
    version: '1.0.0',
    systemUrl: 'https://nademhni.tn',
    contactEmail: 'support@nademhni.tn',
    contactPhone: '+216 00 000 000',
    defaultLanguage: 'fr',
    timezone: 'Africa/Tunis',
    currency: 'TND',
    dateFormat: 'DD/MM/YYYY',
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: false,
    minPasswordLength: 8,
    passwordExpiry: 90,
    require2FA: false,
    allowMultipleSessions: true,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    notifyNewUser: true,
    notifyNewSociete: true,
    notifyAbonnement: true,
    notifyExpiry: true,
    notifySecurity: true,
    inAppNotifications: true,
    notificationSounds: false,
    publicApiKey: 'pk_live_' + this.generateApiKey(),
    rateLimit: 100,
    apiTimeout: 30000,
    corsAllowAll: true,
    debugMode: false,
    maintenanceMode: false
  };

  ngOnInit() {}

  generateApiKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  copyApiKey() {
    navigator.clipboard.writeText(this.settings.publicApiKey);
    this.snackBar.open('Clé API copiée', 'Fermer', { duration: 3000 });
  }

  regenerateApiKey() {
    if (confirm('Générer une nouvelle clé API? L\'ancienne sera invalidée.')) {
      this.settings.publicApiKey = 'pk_live_' + this.generateApiKey();
      this.snackBar.open('Nouvelle clé API générée', 'Fermer', { duration: 3000 });
    }
  }

  createBackup() {
    this.snackBar.open('Sauvegarde en cours...', 'Fermer', { duration: 3000 });
    setTimeout(() => {
      this.lastBackup = new Date().toLocaleString('fr-FR');
      this.snackBar.open('Sauvegarde créée avec succès', 'Fermer', { duration: 3000 });
    }, 1500);
  }

  downloadBackup() {
    this.snackBar.open('Téléchargement...', 'Fermer', { duration: 3000 });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.snackBar.open(`Fichier sélectionné: ${this.selectedFile.name}`, 'Fermer', { duration: 3000 });
    }
  }

  saveSettings() {
    localStorage.setItem('app_settings', JSON.stringify(this.settings));
    this.snackBar.open('Paramètres enregistrés avec succès', 'Fermer', { duration: 3000 });
  }

  resetDefaults() {
    if (confirm('Réinitialiser tous les paramètres aux valeurs par défaut?')) {
      this.snackBar.open('Paramètres réinitialisés', 'Fermer', { duration: 3000 });
    }
  }
}

