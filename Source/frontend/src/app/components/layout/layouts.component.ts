import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslationService } from '../../services/translation.service';
import { AIAssistantComponent } from './ai-assistant.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AIAssistantComponent, FormsModule],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <div class="bg-dark text-white d-flex flex-column" style="width: 270px; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);">
        <div class="p-4 border-bottom" style="border-color: rgba(255,255,255,0.08);">
          <div class="rounded-3 d-flex align-items-center justify-content-center mb-3" style="width: 52px; height: 52px; background: linear-gradient(135deg, #0284c7, #0891b2); box-shadow: 0 8px 24px rgba(2, 132, 199, 0.35);">
            <i class="bi bi-shield-check" style="font-size: 26px;"></i>
          </div>
          <div class="fw-bold" style="font-size: 24px;">NADHEMNI</div>
          <div class="text-white-50" style="font-size: 13px;">Super Administrateur</div>
        </div>
        
        <div class="flex-grow-1 py-3">
          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Principal</div>
            <a routerLink="/superadmin/dashboard" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-speedometer2"></i>
              <span>Tableau de Bord</span>
            </a>
          </div>
          
          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Gestion</div>
            <a routerLink="/superadmin/societes" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-buildings"></i>
              <span>Sociétés</span>
            </a>
            <a routerLink="/superadmin/utilisateurs" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-people"></i>
              <span>Utilisateurs</span>
            </a>
            <a routerLink="/superadmin/projets" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-kanban"></i>
              <span>Projets</span>
            </a>
          </div>
          
          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Communication</div>
            <a routerLink="/superadmin/chat" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-chat-dots"></i>
              <span>Chat Global</span>
            </a>
          </div>
          
          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Système</div>
            <a routerLink="/superadmin/parametres" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-gear"></i>
              <span>Paramètres</span>
            </a>
            <a routerLink="/superadmin/tests-disponibles" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-clipboard-check"></i>
              <span>Tests Disponibles</span>
            </a>
          </div>
        </div>
        
        <div class="p-4 border-top" style="border-color: rgba(255,255,255,0.08);">
          <div class="d-flex align-items-center gap-3">
            <i class="bi bi-person-circle text-white-50" style="font-size: 32px;"></i>
            <div class="flex-grow-1">
              <div class="fw-bold text-white" style="font-size: 14px;">{{ currentUser?.nom || 'Admin' }}</div>
              <div class="text-white-50" style="font-size: 12px;">{{ currentUser?.email || '' }}</div>
            </div>
            <button class="btn btn-sm btn-outline-light" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="flex-grow-1 d-flex flex-column">
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4" style="height: 68px;">
          <span class="fw-bold" style="font-size: 20px;">Tableau de Bord Super Administrateur</span>
          <div class="ms-auto d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm position-relative">
              <i class="bi bi-bell"></i>
              @if (unreadCount > 0) {
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 10px;">{{unreadCount}}</span>
              }
            </button>
            <button class="btn btn-outline-primary btn-sm">
              <i class="bi bi-question-circle"></i>
            </button>
            <button class="btn btn-outline-primary btn-sm">
              <i class="bi bi-person-circle"></i>
            </button>
          </div>
        </nav>
        <main class="p-4" style="background: var(--color-bg); flex-grow-1;">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-ai-assistant></app-ai-assistant>
    </div>
  `,
  styles: [`
    .nav-link:hover {
      background: rgba(255,255,255,0.08);
      color: #fff !important;
    }

    .nav-link.active {
      background: rgba(2, 132, 199, 0.2);
      color: #a78bfa !important;
    }
  `]
})
export class SuperAdminLayoutComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  currentUser = this.api.getCurrentUser();
  notifications: any[] = [];
  unreadCount = 0;

  ngOnInit() {
    this.loadNotifications();
    // Simple polling to simulate real-time interaction
    setInterval(() => this.loadNotifications(), 10000);
  }

  loadNotifications() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId || 'SUPER';
    this.notifications = data.notifications?.[societeId] || [];
    this.unreadCount = this.notifications.filter(n => !n.lu).length;
  }

  markAllRead() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId || 'SUPER';
    if (data.notifications?.[societeId]) {
      data.notifications[societeId].forEach((n: any) => n.lu = true);
      localStorage.setItem('app_data', JSON.stringify(data));
      this.loadNotifications();
    }
  }

  logout() { this.api.logout(); this.router.navigate(['/login']); }
}

@Component({
  selector: 'app-admin-societe-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AIAssistantComponent, FormsModule],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <div class="bg-dark text-white d-flex flex-column" style="width: 280px; background: #0f172a;">
        <div class="d-flex align-items-center gap-3 p-4" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); box-shadow: 0 8px 32px rgba(2, 132, 199, 0.3);">
            <i class="bi bi-buildings" style="font-size: 26px;"></i>
          </div>
          <div>
            <div class="fw-bold" style="font-size: 18px;">NADHEMNI</div>
            <div style="font-size: 10px; color: #0284c7; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Enterprise Admin</div>
          </div>
        </div>
        <div class="flex-grow-1 py-4" style="overflow-y: auto;">
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Pilotage</div>
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-graph-up"></i>
              <span>Analytique</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Talents & Flux</div>
            <a routerLink="/admin/employes" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-people"></i>
              <span>Répertoire</span>
            </a>
            <a routerLink="/admin/projets" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-folder"></i>
              <span>Espaces de Travail</span>
            </a>
            <a routerLink="/admin/rh" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-person-search"></i>
              <span>Interface RH</span>
            </a>
            <a routerLink="/admin/paiements" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-wallet"></i>
              <span>Facturation</span>
            </a>
            <a routerLink="/admin/chat" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-chat-dots"></i>
              <span>Chat</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Système</div>
            <a routerLink="/admin/parametres" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-sliders"></i>
              <span>Préférences</span>
            </a>
          </div>
        </div>
        <div class="p-4" style="border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2);">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-2 d-flex align-items-center justify-content-center fw-bold text-white" style="width: 36px; height: 36px; background: #8b5cf6;">{{ currentUser?.nom?.charAt(0) }}</div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="fw-bold text-white" style="font-size: 14px;">{{ currentUser?.nom || 'Admin' }}</div>
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">Site Manager</div>
            </div>
            <button class="btn btn-sm btn-outline-light" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="flex-grow-1 d-flex flex-column" style="background: #f8fafc;">
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-5" style="height: 72px;">
          <span class="fw-bold" style="font-size: 24px;">{{t.get('COMMAND_CENTER')}}</span>
          <div class="ms-auto d-flex align-items-center gap-3">
            <!-- Language Switcher -->
            <div class="btn-group me-2">
              <button class="btn btn-sm btn-outline-secondary" [class.active]="t.getCurrentLang()() === 'fr'" (click)="t.setLanguage('fr')">FR</button>
              <button class="btn btn-sm btn-outline-secondary" [class.active]="t.getCurrentLang()() === 'en'" (click)="t.setLanguage('en')">EN</button>
            </div>
            
            <button class="btn btn-outline-primary btn-sm" (click)="toggleDarkMode()">
              <i class="bi bi-{{isDarkMode ? 'sun' : 'moon'}}"></i>
            </button>
            <button class="btn btn-outline-primary btn-sm position-relative">
              <i class="bi bi-bell"></i>
              @if (unreadCount > 0) {
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 10px;">{{unreadCount}}</span>
              }
            </button>
            <div class="d-flex align-items-center gap-2 px-4 py-2 rounded-pill" style="background: #f8fafc; border: 1px solid #f1f5f9; cursor: pointer;">
              <span class="fw-bold" style="font-size: 13px; color: #1e293b;">{{currentUser?.nom}}</span>
              <i class="bi bi-chevron-down" style="font-size: 18px; color: #64748b;"></i>
            </div>
          </div>
        </nav>
        <main class="p-5" style="min-height: calc(100vh - 72px); background: var(--color-bg);">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-ai-assistant></app-ai-assistant>
    </div>
  `,
  styles: [`
    .nav-link:hover {
      background: rgba(255,255,255,0.03);
      color: #fff !important;
    }

    .nav-link.active {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6 !important;
      font-weight: 700;
    }
  `]
})
export class AdminSocieteLayoutComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  public t = inject(TranslationService);
  currentUser = this.api.getCurrentUser();
  isDarkMode = false;
  notifications: any[] = [];
  unreadCount = 0;

  ngOnInit() {
    this.loadNotifications();
    setInterval(() => this.loadNotifications(), 10000);
    this.api.getUserPreference('apparence').subscribe({
      next: (prefs: any) => {
        this.isDarkMode = prefs === true;
        this.applyTheme();
      }
    });
  }

  loadNotifications() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId;
    this.notifications = data.notifications?.[societeId] || [];
    this.unreadCount = this.notifications.filter(n => !n.lu).length;
  }

  markAllRead() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId;
    if (data.notifications?.[societeId]) {
      data.notifications[societeId].forEach((n: any) => n.lu = true);
      localStorage.setItem('app_data', JSON.stringify(data));
      this.loadNotifications();
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.api.setUserPreference('apparence', this.isDarkMode);
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) { document.body.classList.add('dark-theme'); }
    else { document.body.classList.remove('dark-theme'); }
  }

  logout() { this.api.logout(); this.router.navigate(['/login']); }
}

@Component({
  selector: 'app-rh-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AIAssistantComponent, FormsModule],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <div class="bg-dark text-white d-flex flex-column" style="width: 280px; background: #0f172a;">
        <div class="d-flex align-items-center gap-3 p-4" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); box-shadow: 0 8px 32px rgba(2, 132, 199, 0.3);">
            <i class="bi bi-person-badge" style="font-size: 26px;"></i>
          </div>
          <div>
            <div class="fw-bold" style="font-size: 18px;">NADHEMNI</div>
            <div style="font-size: 10px; color: #0284c7; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Gestion du Personnel</div>
          </div>
        </div>
        <div class="flex-grow-1 py-4" style="overflow-y: auto;">
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Surveillance</div>
            <a routerLink="/rh/dashboard" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-graph-up-arrow"></i>
              <span>Tableau de Bord RH</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Logistique RH</div>
            <a routerLink="/rh/pointage" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-clock"></i>
              <span>Suivi des Présences</span>
            </a>
            <a routerLink="/rh/conges" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-calendar-check"></i>
              <span>Gestion des Congés</span>
            </a>
            <a routerLink="/rh/employes" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-people"></i>
              <span>Vivier de Talents</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Stratégie</div>
            <a routerLink="/rh/recrutement" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-brain"></i>
              <span>Parcours Recrutement</span>
            </a>
            <a routerLink="/rh/tests" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-clipboard-check"></i>
              <span>Centre d'Évaluation</span>
            </a>
            <a routerLink="/rh/tests-interface" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-check-square"></i>
              <span>Interface Tests</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Communication</div>
            <a routerLink="/rh/chat" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-chat-dots"></i>
              <span>Comms Internes</span>
            </a>
          </div>
        </div>
        <div class="p-4" style="border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2);">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-2 d-flex align-items-center justify-content-center fw-bold text-white" style="width: 36px; height: 36px; background: #f59e0b;">{{ currentUser?.nom?.charAt(0) }}</div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="fw-bold text-white" style="font-size: 14px;">{{ currentUser?.nom || 'RH' }}</div>
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">RH Manager</div>
            </div>
            <button class="btn btn-sm btn-outline-light" (click)="toggleDarkMode()">
              <i class="bi bi-{{isDarkMode ? 'sun' : 'moon'}}"></i>
            </button>
            <button class="btn btn-sm btn-outline-light" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="flex-grow-1 d-flex flex-column" style="background: #f8fafc;">
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-5" style="height: 72px;">
          <span class="fw-bold" style="font-size: 24px;">HR Command Center</span>
          <div class="ms-auto d-flex gap-3">
            <button class="btn btn-outline-primary btn-sm position-relative">
              <i class="bi bi-bell"></i>
              @if (unreadCount > 0) {
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style="font-size: 10px;">{{unreadCount}}</span>
              }
            </button>
            <div class="d-flex align-items-center gap-2 px-4 py-2 rounded-pill" style="background: #f8fafc; border: 1px solid #f1f5f9; cursor: pointer;">
              <span class="fw-bold" style="font-size: 13px; color: #1e293b;">{{currentUser?.nom}}</span>
              <i class="bi bi-chevron-down" style="font-size: 18px; color: #64748b;"></i>
            </div>
          </div>
        </nav>
        <main class="p-5" style="min-height: calc(100vh - 72px); background: var(--color-bg);">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-ai-assistant></app-ai-assistant>
    </div>
  `,
  styles: [`
    .nav-link:hover {
      background: rgba(255,255,255,0.03);
      color: #fff !important;
    }

    .nav-link.active {
      background: rgba(2, 132, 199, 0.1);
      color: #0284c7 !important;
      font-weight: 700;
    }
  `]
})
export class RhLayoutComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  currentUser = this.api.getCurrentUser();
  isDarkMode = false;
  notifications: any[] = [];
  unreadCount = 0;
  
  ngOnInit() {
    this.loadNotifications();
    setInterval(() => this.loadNotifications(), 10000);
    this.api.getUserPreference('apparence').subscribe({
      next: (prefs: any) => {
        this.isDarkMode = prefs?.darkMode || false;
        this.applyTheme();
      }
    });
  }

  loadNotifications() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId;
    this.notifications = data.notifications?.[societeId] || [];
    this.unreadCount = this.notifications.filter(n => !n.lu).length;
  }

  markAllRead() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId;
    if (data.notifications?.[societeId]) {
      data.notifications[societeId].forEach((n: any) => n.lu = true);
      localStorage.setItem('app_data', JSON.stringify(data));
      this.loadNotifications();
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.api.setUserPreference('apparence', this.isDarkMode);
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }

  logout() { this.api.logout(); this.router.navigate(['/login']); }
}

@Component({
  selector: 'app-chef-groupe-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AIAssistantComponent, FormsModule],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <div class="bg-dark text-white d-flex flex-column" style="width: 280px; background: #0f172a;">
        <div class="d-flex align-items-center gap-3 p-4" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); box-shadow: 0 8px 32px rgba(2, 132, 199, 0.3);">
            <i class="bi bi-people" style="font-size: 26px;"></i>
          </div>
          <div>
            <div class="fw-bold" style="font-size: 18px;">NADHEMNI</div>
            <div style="font-size: 10px; color: #0284c7; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Pilotage Projet</div>
          </div>
        </div>
        <div class="flex-grow-1 py-4" style="overflow-y: auto;">
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Radar</div>
            <a routerLink="/chef/dashboard" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-activity"></i>
              <span>État de Santé</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Opérations</div>
            <a routerLink="/chef/projets" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-grid"></i>
              <span>Flux de Travail</span>
            </a>
            <a routerLink="/chef/taches" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-list-check"></i>
              <span>Tâches Unité</span>
            </a>
            <a routerLink="/chef/bugs" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-bug"></i>
              <span>Suivi des Bugs</span>
            </a>
            <a routerLink="/chef/equipe" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-diagram-3"></i>
              <span>Nœuds Équipe</span>
            </a>
            <a routerLink="/chef/suivi" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-speedometer2"></i>
              <span>Vélocité</span>
            </a>
            <a routerLink="/chef/time" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-clock-history"></i>
              <span>Chronologie</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Intel</div>
            <a routerLink="/chef/rapports" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-bar-chart"></i>
              <span>Analyses</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Réseau</div>
            <a routerLink="/chef/chat" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-chat-dots"></i>
              <span>Comms Internes</span>
            </a>
          </div>
        </div>
        <div class="p-4" style="border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2);">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-2 d-flex align-items-center justify-content-center fw-bold text-white" style="width: 36px; height: 36px; background: #3b82f6;">{{ currentUser?.nom?.charAt(0) }}</div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="fw-bold text-white" style="font-size: 14px;">{{ currentUser?.nom || 'Chef' }}</div>
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">Lead Architect</div>
            </div>
            <button class="btn btn-sm btn-outline-light" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="flex-grow-1 d-flex flex-column" style="background: #f8fafc;">
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-5" style="height: 72px;">
          <span class="fw-bold" style="font-size: 24px;">Project Orbit</span>
          <div class="ms-auto d-flex gap-3">
            <button class="btn btn-outline-primary btn-sm position-relative">
              <i class="bi bi-bell"></i>
              @if (unreadCount > 0) {
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style="font-size: 10px;">{{unreadCount}}</span>
              }
            </button>
            <div class="d-flex align-items-center gap-2 px-4 py-2 rounded-pill" style="background: #f8fafc; border: 1px solid #f1f5f9; cursor: pointer;">
              <span class="fw-bold" style="font-size: 13px; color: #1e293b;">{{currentUser?.nom}}</span>
              <i class="bi bi-chevron-down" style="font-size: 18px; color: #64748b;"></i>
            </div>
          </div>
        </nav>
        <main class="p-5" style="min-height: calc(100vh - 72px); background: var(--color-bg);">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-ai-assistant></app-ai-assistant>
    </div>
  `,
  styles: [`
    .nav-link:hover {
      background: rgba(255,255,255,0.03);
      color: #fff !important;
    }

    .nav-link.active {
      background: rgba(2, 132, 199, 0.1);
      color: #0284c7 !important;
      font-weight: 700;
    }
  `]
})
export class ChefGroupeLayoutComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  currentUser = this.api.getCurrentUser();
  isDarkMode = false;
  notifications: any[] = [];
  unreadCount = 0;
  
  ngOnInit() {
    this.loadNotifications();
    setInterval(() => this.loadNotifications(), 10000);
    this.api.getUserPreference('apparence').subscribe({
      next: (prefs: any) => {
        this.isDarkMode = prefs?.darkMode || false;
        this.applyTheme();
      }
    });
  }

  loadNotifications() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId;
    this.notifications = data.notifications?.[societeId] || [];
    this.unreadCount = this.notifications.filter(n => !n.lu).length;
  }

  markAllRead() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId;
    if (data.notifications?.[societeId]) {
      data.notifications[societeId].forEach((n: any) => n.lu = true);
      localStorage.setItem('app_data', JSON.stringify(data));
      this.loadNotifications();
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.api.setUserPreference('apparence', { darkMode: this.isDarkMode });
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }

  logout() { this.api.logout(); this.router.navigate(['/login']); }
}

@Component({
  selector: 'app-developpeur-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AIAssistantComponent, FormsModule],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <div class="bg-dark text-white d-flex flex-column" style="width: 280px; background: #0f172a;">
        <div class="d-flex align-items-center gap-3 p-4" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); box-shadow: 0 8px 32px rgba(2, 132, 199, 0.3);">
            <i class="bi bi-code-slash" style="font-size: 26px;"></i>
          </div>
          <div>
            <div class="fw-bold" style="font-size: 18px;">NADHEMNI</div>
            <div style="font-size: 10px; color: #0284c7; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Développeur</div>
          </div>
        </div>
        <div class="flex-grow-1 py-4" style="overflow-y: auto;">
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Principal</div>
            <a routerLink="/dev/dashboard" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-speedometer2"></i>
              <span>Tableau de Bord</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Travail</div>
            <a routerLink="/dev/taches" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-list-task"></i>
              <span>Mes Tâches</span>
            </a>
            <a routerLink="/dev/bugs" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-bug"></i>
              <span>Mes Bugs</span>
            </a>
            <a routerLink="/dev/projets" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-folder"></i>
              <span>Projets</span>
            </a>
            <a routerLink="/dev/time" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-stopwatch"></i>
              <span>Suivi du Temps</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Documentation</div>
            <a routerLink="/dev/docs" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-book"></i>
              <span>Bibliothèque & Fichiers</span>
            </a>
            <a routerLink="/dev/api" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-file-code"></i>
              <span>Swagger & API</span>
            </a>
            <a routerLink="/dev/diagrams" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-diagram-2"></i>
              <span>Diagrammes & Archi</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Communication</div>
            <a routerLink="/dev/chat" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-chat-dots"></i>
              <span>Chat</span>
            </a>
          </div>
          <div class="mb-5">
            <div class="px-4 mb-3" style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Système</div>
            <a routerLink="/dev/parametres" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-4">
              <i class="bi bi-gear"></i>
              <span>Paramètres</span>
            </a>
          </div>
        </div>
        <div class="p-4" style="border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2);">
          <div class="d-flex align-items-center gap-3">
            <i class="bi bi-person-circle text-white-50" style="font-size: 32px;"></i>
            <div class="flex-grow-1 overflow-hidden">
              <div class="fw-bold text-white" style="font-size: 14px;">{{ currentUser?.nom || 'Développeur' }}</div>
              <div class="text-white-50" style="font-size: 12px;">{{ currentUser?.email || '' }}</div>
            </div>
            <button class="btn btn-sm btn-outline-light" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="flex-grow-1 d-flex flex-column" style="background: #f8fafc;">
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-5" style="height: 72px;">
          <span class="fw-bold" style="font-size: 24px;">Developer Hub</span>
          <div class="ms-auto d-flex gap-3">
            <button class="btn btn-outline-primary btn-sm">
              <i class="bi bi-bell"></i>
            </button>
            <button class="btn btn-outline-primary btn-sm">
              <i class="bi bi-person-circle"></i>
            </button>
          </div>
        </nav>
        <main class="p-5" style="min-height: calc(100vh - 72px); background: var(--color-bg);">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-ai-assistant></app-ai-assistant>
    </div>
  `,
  styles: [`
    .nav-link:hover {
      background: rgba(255,255,255,0.03);
      color: #fff !important;
    }

    .nav-link.active {
      background: rgba(2, 132, 199, 0.1);
      color: #0284c7 !important;
      font-weight: 700;
    }
  `]
})
export class DeveloppeurLayoutComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  currentUser = this.api.getCurrentUser();
  isDarkMode = false;
  notifications: any[] = [];
  unreadCount = 0;
  
  ngOnInit() {
    this.loadNotifications();
    setInterval(() => this.loadNotifications(), 10000);
    this.api.getUserPreference('apparence').subscribe({
      next: (prefs: any) => {
        this.isDarkMode = prefs?.darkMode || false;
        this.applyTheme();
      }
    });
  }

  loadNotifications() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId;
    this.notifications = data.notifications?.[societeId] || [];
    this.unreadCount = this.notifications.filter(n => !n.lu).length;
  }

  markAllRead() {
    const data = this.api.getRawStorage();
    const societeId = this.currentUser?.societeId;
    if (data.notifications?.[societeId]) {
      data.notifications[societeId].forEach((n: any) => n.lu = true);
      localStorage.setItem('app_data', JSON.stringify(data));
      this.loadNotifications();
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.api.setUserPreference('apparence', { darkMode: this.isDarkMode });
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }

  logout() { this.api.logout(); this.router.navigate(['/login']); }
}

@Component({
  selector: 'app-applicant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="min-height: 100vh; background: #fafafa; background-image: radial-gradient(#e5e7eb 1px, transparent 1px); background-size: 40px 40px;">
      <nav class="navbar navbar-expand-lg navbar-light" style="height: 80px; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.05); padding: 0 60px; position: sticky; top: 0; z-index: 1000;">
         <div class="d-flex align-items-center gap-3" routerLink="/applicant" style="cursor: pointer;">
            <i class="bi bi-star-fill" style="font-size: 32px; color: #0284c7;"></i>
            <span class="fw-bold" style="font-size: 20px; letter-spacing: -0.5px; color: #0f172a;">NADHEMNI <span style="color: #64748b; font-weight: 500; font-size: 16px; margin-left: 4px;">RECRUTEMENT</span></span>
         </div>
         <div class="d-flex gap-5">
            <a routerLink="/applicant/offres" routerLinkActive="active" class="text-decoration-none" style="color: #475569; font-weight: 700; font-size: 15px; position: relative; padding: 8px 0;">Offres d'Emploi</a>
            <a routerLink="/applicant/postuler" routerLinkActive="active" class="text-decoration-none" style="color: #475569; font-weight: 700; font-size: 15px; position: relative; padding: 8px 0;">Postuler</a>
         </div>
         <div class="dropdown">
            <button class="btn btn-sm rounded-circle" data-bs-toggle="dropdown" style="background: #f1f5f9; color: #64748b;">
               <i class="bi bi-person-circle" style="font-size: 24px;"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
               <li><a class="dropdown-item" routerLink="/applicant/profil"><i class="bi bi-fingerprint me-2"></i>Mon Profil</a></li>
               <li><hr class="dropdown-divider"></li>
               <li><a class="dropdown-item" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Déconnexion</a></li>
            </ul>
         </div>
      </nav>
      <main style="padding: 60px; max-width: 1280px; margin: 0 auto;">
         <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .nav-link:hover {
      color: #0f172a !important;
    }

    .nav-link.active {
      color: #0284c7 !important;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #0284c7;
      border-radius: 10px;
    }
  `]
})
export class ApplicantLayoutComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  logout() { this.api.logout(); this.router.navigate(['/login']); }
}
