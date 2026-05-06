import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-developpeur-layout-comp',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex" style="height: 100vh;">
      <div class="sidebar" style="width: 280px; background: #0f172a; border: none; display: flex; flex-direction: column; overflow: hidden;">
        <div class="sidebar-header p-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center mb-3" style="width: 52px; height: 52px; background: linear-gradient(135deg, #6366f1, #4f46e5); box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);">
            <i class="bi bi-code" style="color: #fff; font-size: 28px;"></i>
          </div>
          <span class="d-block fw-bold" style="font-size: 22px; color: #fff; letter-spacing: -1px;">NADHEMNI</span>
          <span class="d-block" style="font-size: 11px; color: #94a3b8; margin-top: 4px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Développeur</span>
        </div>
        <div class="flex-grow-1 overflow-y-auto" style="padding: 0 12px;">
          <div class="mb-4">
            <span class="d-block px-3 mb-2" style="font-size: 10px; font-weight: 800; color: #475569; letter-spacing: 2px; text-transform: uppercase;">PRINCIPAL</span>
            <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" routerLink="/dev/dashboard" routerLinkActive="active" style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
              <i class="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </a>
          </div>
          <div class="mb-4">
            <span class="d-block px-3 mb-2" style="font-size: 10px; font-weight: 800; color: #475569; letter-spacing: 2px; text-transform: uppercase;">TRAVAIL</span>
            <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" routerLink="/dev/taches" routerLinkActive="active" style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
              <i class="bi bi-list-task"></i>
              <span>Mes Tâches</span>
            </a>
            <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" routerLink="/dev/projets" routerLinkActive="active" style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
              <i class="bi bi-folder"></i>
              <span>Projets</span>
            </a>
            <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" routerLink="/dev/time" routerLinkActive="active" style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
              <i class="bi bi-stopwatch"></i>
              <span>Time Tracking</span>
            </a>
          </div>
          <div class="mb-4">
            <span class="d-block px-3 mb-2" style="font-size: 10px; font-weight: 800; color: #475569; letter-spacing: 2px; text-transform: uppercase;">EQUILIBRE</span>
            <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" routerLink="/dev/conges" routerLinkActive="active" style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
              <i class="bi bi-calendar-check"></i>
              <span>Mes Congés</span>
            </a>
          </div>
          <div class="mb-4">
            <span class="d-block px-3 mb-2" style="font-size: 10px; font-weight: 800; color: #475569; letter-spacing: 2px; text-transform: uppercase;">RESSOURCES</span>
            <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" routerLink="/dev/docs" routerLinkActive="active" style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
              <i class="bi bi-book"></i>
              <span>Docs</span>
            </a>
          </div>
          <div class="mb-4">
            <span class="d-block px-3 mb-2" style="font-size: 10px; font-weight: 800; color: #475569; letter-spacing: 2px; text-transform: uppercase;">COMMUNICATION</span>
            <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" routerLink="/dev/chat" routerLinkActive="active" style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
              <i class="bi bi-chat-dots"></i>
              <span>Chat</span>
            </a>
          </div>
          <div class="mb-4">
            <span class="d-block px-3 mb-2" style="font-size: 10px; font-weight: 800; color: #475569; letter-spacing: 2px; text-transform: uppercase;">SYSTÈME</span>
            <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" routerLink="/dev/parametres" routerLinkActive="active" style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
              <i class="bi bi-gear"></i>
              <span>Paramètres</span>
            </a>
          </div>
        </div>
        <div class="sidebar-footer p-3" style="border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2);">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background: #6366f1; color: #fff; font-weight: 900; font-size: 16px;">
              {{ currentUser?.nom?.charAt(0) }}
            </div>
            <div class="flex-grow-1" style="overflow: hidden;">
              <span class="d-block text-truncate" style="color: #fff; font-size: 14px; font-weight: 700;">{{ currentUser?.nom || 'Développeur' }}</span>
              <span class="d-block text-truncate" style="font-size: 11px; color: #64748b; font-weight: 600;">{{ currentUser?.email || '' }}</span>
            </div>
            <button class="btn btn-sm btn-light" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="flex-grow-1 d-flex flex-column" style="background: #f8fafc;">
        <div class="d-flex justify-content-between align-items-center p-3" style="background: #fff; border-bottom: 1px solid #f1f5f9; height: 72px;">
           <span class="fw-bold" style="font-size: 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Workspace</span>
           <div class="d-flex align-items-center gap-3">
             <button class="btn btn-sm btn-light" (click)="toggleDarkMode()">
               <i class="bi bi-{{isDarkMode ? 'sun' : 'moon'}}"></i>
             </button>
             <button class="btn btn-sm btn-light position-relative">
               <i class="bi bi-bell"></i>
               <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
             </button>
             <div class="d-flex align-items-center gap-2 px-3 py-1 rounded-3" style="background: #f1f5f9; cursor: pointer;">
                <span style="color: #1a1a2e; font-size: 13px;">{{currentUser?.nom}}</span>
                <i class="bi bi-chevron-down" style="font-size: 12px; color: #64748b;"></i>
             </div>
           </div>
        </div>
        <main class="flex-grow-1 p-4 overflow-y-auto"><router-outlet></router-outlet></main>
      </div>
    </div>
  `,
  styles: [`
    a.active {
      background: rgba(99, 102, 241, 0.1) !important;
      color: #6366f1 !important;
    }
  `]
})
export class DeveloppeurLayoutComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  currentUser = this.api.getCurrentUser();
  isDarkMode = false;

  ngOnInit() {
    this.api.getUserPreference('apparence').subscribe({
      next: (prefs: any) => {
        this.isDarkMode = prefs === true;
        this.applyTheme();
      }
    });
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

  logout() { this.api.logout(); this.router.navigate(['/']); }
}
