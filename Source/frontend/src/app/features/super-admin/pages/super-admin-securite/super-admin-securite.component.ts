import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface SecurityAlert {
  id: number;
  type: string;
  description: string;
  date: string;
  niveau: 'critical' | 'high' | 'medium' | 'low';
  statut: 'active' | 'investigating' | 'resolved';
}

interface IpBlock {
  id: number;
  ip: string;
  raison: string;
  dateBlocage: string;
  statut: 'bloque' | 'debloque';
}

interface PasswordPolicy {
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecial: boolean;
  minLength: number;
  require2FA: boolean;
  allowSimultaneous: boolean;
  sessionTimeout: number;
}

interface EmailNotificationSettings {
  newUser: boolean;
  newSociete: boolean;
  newAbonnement: boolean;
  securityAlerts: boolean;
  recipientEmail: string;
}

@Component({
  selector: 'app-super-admin-securite',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './super-admin-securite.component.html',
  styleUrls: ['./super-admin-securite.component.scss']
})
export class SuperAdminSecuriteComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  activeTab = 'alertes';
  showBlockDialog = false;
  blockIpForm = { ip: '', raison: '' };
  connexionsActives = 12;
  requetesApi = 45;
  echecsConnexion = 3;

  emailSettings: EmailNotificationSettings = {
    newUser: true,
    newSociete: true,
    newAbonnement: true,
    securityAlerts: true,
    recipientEmail: 'admin@leadertec.com'
  };

  alerts: SecurityAlert[] = [
    { id: 1, type: 'Tentative d\'injection SQL', description: 'Requête suspecte détectée depuis IP 192.168.1.55', date: '03/04/2026 16:35', niveau: 'critical', statut: 'active' },
    { id: 2, type: 'Multiple échecs de connexion', description: '5 tentatives échouées pour utilisateur admin@leadertec.com', date: '03/04/2026 16:25', niveau: 'high', statut: 'investigating' },
    { id: 3, type: 'Nouvelle localisation', description: 'Connexion depuis un nouveau pays: Maroc', date: '03/04/2026 15:20', niveau: 'medium', statut: 'resolved' },
    { id: 4, type: 'Session suspecte', description: 'Session inactive détectée puis réactivée', date: '03/04/2026 14:10', niveau: 'low', statut: 'resolved' }
  ];

  blockedIps: IpBlock[] = [
    { id: 1, ip: '10.0.0.55', raison: 'Trop de tentatives de connexion', dateBlocage: '03/04/2026 16:20', statut: 'bloque' },
    { id: 2, ip: '192.168.1.200', raison: 'Activités suspectes détectées', dateBlocage: '02/04/2026 10:30', statut: 'bloque' }
  ];

  activities = [
    { id: 1, icon: 'login', description: 'Connexion: admin@leadertec.com', time: '16:40' },
    { id: 2, icon: 'api', description: 'API: GET /societes', time: '16:39' },
    { id: 3, icon: 'update', description: 'Mise à jour: Utilisateur USR003', time: '16:38' },
    { id: 4, icon: 'logout', description: 'Déconnexion: test@leadertec.com', time: '16:35' }
  ];

  passwordPolicy: PasswordPolicy = {
    requireUppercase: false,
    requireNumbers: false,
    requireSpecial: false,
    minLength: 4,
    require2FA: false,
    allowSimultaneous: true,
    sessionTimeout: 60
  };

  loading = false;

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;
    
    forkJoin({
      societes: this.api.getSocietes(),
      users: this.api.getUtilisateurs(),
      activities: this.api.getGlobalActivities(20),
      blockedIps: this.api.getBlockedIps()
    }).pipe(
      catchError(() => of({ societes: [], users: [], activities: [], blockedIps: [] }))
    ).subscribe((res: any) => {
      // 1. Activités réelles
      if (res.activities && res.activities.length > 0) {
        this.activities = res.activities.map((a: any) => ({
          id: a.id,
          description: a.description || a.action,
          time: new Date(a.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          icon: this.getIconForType(a.type)
        }));
      }

      // 2. IPs Bloquées réelles
      if (res.blockedIps && res.blockedIps.length > 0) {
        this.blockedIps = res.blockedIps.map((ip: any) => ({
          id: ip.id || ip.Id,
          ip: ip.ipAddress || ip.IpAddress,
          raison: ip.reason || ip.Reason,
          dateBlocage: new Date(ip.blockedAt || ip.BlockedAt).toLocaleString('fr-FR'),
          statut: 'bloque'
        }));
      }

      // 3. Alertes dynamiques basées sur le système
      this.generateDynamicAlerts(res.societes, res.users);

      // 4. Stats Surveillance
      this.connexionsActives = Math.max(5, Math.floor(res.users.length * 0.15));
      this.requetesApi = 45 + Math.floor(Math.random() * 30);
      this.echecsConnexion = Math.floor(Math.random() * 5);
      
      this.loading = false;
    });

    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      if (storage.passwordPolicy) this.passwordPolicy = storage.passwordPolicy;
      if (storage.emailSettings) this.emailSettings = storage.emailSettings;
      if (storage.blockedIps) this.blockedIps = storage.blockedIps;
      // On ne surcharge pas alerts et activities s'ils viennent de l'API
    }
  }

  private generateDynamicAlerts(societes: any[], users: any[]) {
    const newAlerts: SecurityAlert[] = [];
    
    // Alerte: Sociétés en attente
    const pendingSocietes = societes.filter(s => (s.status || s.Statut) === 'EN_ATTENTE' || (s.actif === false));
    if (pendingSocietes.length > 0) {
      newAlerts.push({
        id: 101,
        type: 'Approbation Requise',
        description: `${pendingSocietes.length} sociétés en attente de validation.`,
        date: new Date().toLocaleDateString(),
        niveau: 'high',
        statut: 'active'
      });
    }

    // Alerte: Nouveau volume d'utilisateurs
    if (users.length > 50) {
      newAlerts.push({
        id: 102,
        type: 'Charge Système',
        description: `Volume d'utilisateurs élevé détecté (${users.length} comptes).`,
        date: new Date().toLocaleDateString(),
        niveau: 'medium',
        statut: 'active'
      });
    }

    // Fusionner avec les alertes existantes (manuelles)
    this.alerts = [...newAlerts, ...this.alerts.filter(a => a.id < 100)];
  }

  private getIconForType(type: string): string {
    switch (type?.toLowerCase()) {
      case 'auth': return 'lock';
      case 'rh': return 'people';
      case 'projet': return 'folder';
      default: return 'activity';
    }
  }

  saveAllData() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.passwordPolicy = this.passwordPolicy;
    storage.emailSettings = this.emailSettings;
    storage.securityAlerts = this.alerts;
    storage.blockedIps = this.blockedIps;
    storage.activities = this.activities;
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  loadPolicy() {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      if (storage.passwordPolicy) {
        this.passwordPolicy = storage.passwordPolicy;
      }
    }
  }

  savePolicy() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.passwordPolicy = this.passwordPolicy;
    localStorage.setItem('app_data', JSON.stringify(storage));
    this.snackBar.open('Politique de sécurité enregistrée', 'Fermer', { duration: 3000 });
  }

  loadEmailSettings() {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      if (storage.emailSettings) {
        this.emailSettings = storage.emailSettings;
      }
    }
  }

  saveEmailSettings() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.emailSettings = this.emailSettings;
    localStorage.setItem('app_data', JSON.stringify(storage));
    this.snackBar.open('Paramètres d\'email enregistrés', 'Fermer', { duration: 3000 });
  }

  saveBlockedIps() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.blockedIps = this.blockedIps;
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  addBlockedIp(ip: string, raison: string) {
    const newBlock: IpBlock = {
      id: Date.now(),
      ip: ip,
      raison: raison,
      dateBlocage: new Date().toLocaleString('fr-FR'),
      statut: 'bloque'
    };
    
    this.api.blockIp({ ipAddress: ip, raison: raison }).subscribe({
      next: () => {
        this.blockedIps.push(newBlock);
        this.saveBlockedIps();
        this.snackBar.open('IP ' + ip + ' bloquée', 'Fermer', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erreur lors du blocage de l\'IP', 'Fermer', { duration: 3000 })
    });
  }

  createAlert(type: string, description: string, niveau: 'critical' | 'high' | 'medium' | 'low') {
    const newAlert: SecurityAlert = {
      id: Date.now(),
      type: type,
      description: description,
      date: new Date().toLocaleString('fr-FR'),
      niveau: niveau,
      statut: 'active'
    };
    this.alerts.unshift(newAlert);
    this.saveAlerts();
    if (this.emailSettings.securityAlerts) {
      this.triggerSecurityAlert(type, description, niveau);
    }
  }

  updateActivity() {
    const user = this.api.getCurrentUser();
    const newActivity = {
      id: Date.now(),
      icon: 'refresh',
      description: 'Actualisation du tableau de bord',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    this.activities.unshift(newActivity);
    if (this.activities.length > 10) this.activities.pop();
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.activities = this.activities;
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  testEmail() {
    if (!this.emailSettings.recipientEmail) {
      this.snackBar.open('Veuillez entrer une adresse email', 'Fermer', { duration: 3000 });
      return;
    }
    this.api.sendTestEmail(this.emailSettings.recipientEmail).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.snackBar.open('Email de test envoyé à ' + this.emailSettings.recipientEmail, 'Fermer', { duration: 3000 });
        } else {
          this.snackBar.open('Échec de l\'envoi de l\'email', 'Fermer', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi de l\'email (API non disponible)', 'Fermer', { duration: 3000 });
      }
    });
  }

  triggerSecurityAlert(type: string, description: string, niveau: 'critical' | 'high' | 'medium' | 'low') {
    const alert: SecurityAlert = {
      id: Date.now(),
      type: type,
      description: description,
      date: new Date().toLocaleString('fr-FR'),
      niveau: niveau,
      statut: 'active'
    };
    this.alerts.unshift(alert);
    this.api.sendEmailNotification('securityAlerts', {
      type: type,
      description: description,
      niveau: niveau,
      timestamp: new Date().toISOString()
    });
    this.snackBar.open('Alerte de sécurité: ' + type, 'Fermer', { duration: 3000 });
  }

  getEmailSettings(): EmailNotificationSettings {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      return storage.emailSettings || this.emailSettings;
    }
    return this.emailSettings;
  }

  getCriticalCount() { return this.alerts.filter(a => a.niveau === 'critical' && a.statut !== 'resolved').length; }
  getHighCount() { return this.alerts.filter(a => a.niveau === 'high' && a.statut !== 'resolved').length; }
  getMediumCount() { return this.alerts.filter(a => a.niveau === 'medium' && a.statut !== 'resolved').length; }
  getLowCount() { return this.alerts.filter(a => a.niveau === 'low' && a.statut !== 'resolved').length; }

  refreshAlerts() {
    this.loadAllData();
    this.snackBar.open('Alertes actualisées', 'Fermer', { duration: 3000 });
  }

  saveAlerts() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.securityAlerts = this.alerts;
    localStorage.setItem('app_data', JSON.stringify(storage));
    this.snackBar.open('Alertes enregistrées', 'Fermer', { duration: 3000 });
  }

  deblockIp(ip: IpBlock) {
    this.api.unblockIp(ip.id.toString()).subscribe({
      next: () => {
        ip.statut = 'debloque';
        this.saveBlockedIps();
        this.snackBar.open('IP ' + ip.ip + ' débloquée', 'Fermer', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erreur lors du déblocage', 'Fermer', { duration: 3000 })
    });
  }
 
  toggleIpBlock(ip: IpBlock) {
    const newStatut = ip.statut === 'bloque' ? 'debloque' : 'bloque';
    if (newStatut === 'debloque') {
      this.api.unblockIp(ip.id.toString()).subscribe({
        next: () => {
          ip.statut = 'debloque';
          this.saveBlockedIps();
          this.snackBar.open('IP ' + ip.ip + ' débloquée', 'Fermer', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors du déblocage', 'Fermer', { duration: 3000 })
      });
    } else {
      this.api.blockIp({ ipAddress: ip.ip, raison: ip.raison }).subscribe({
        next: () => {
          ip.statut = 'bloque';
          this.saveBlockedIps();
          this.snackBar.open('IP ' + ip.ip + ' bloquée', 'Fermer', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors du blocage', 'Fermer', { duration: 3000 })
      });
    }
  }

  openBlockDialog() {
    this.blockIpForm = { ip: '', raison: '' };
    this.showBlockDialog = true;
  }

  submitBlockIp() {
    if (this.blockIpForm.ip && this.blockIpForm.raison) {
      this.addBlockedIp(this.blockIpForm.ip, this.blockIpForm.raison);
      this.showBlockDialog = false;
    }
  }

  clearSecurityData() {
    if (confirm('Voulez-vous effacer toutes les données de sécurité?')) {
      this.passwordPolicy = {
        requireUppercase: false,
        requireNumbers: false,
        requireSpecial: false,
        minLength: 4,
        require2FA: false,
        allowSimultaneous: true,
        sessionTimeout: 60
      };
      this.emailSettings = {
        newUser: true,
        newSociete: true,
        newAbonnement: true,
        securityAlerts: true,
        recipientEmail: ''
      };
      this.blockedIps = [];
      this.alerts = [];
      this.saveAllData();
      this.snackBar.open('Données de sécurité effacées', 'Fermer', { duration: 3000 });
    }
  }
}

