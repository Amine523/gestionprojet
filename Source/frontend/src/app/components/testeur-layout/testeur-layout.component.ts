import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-testeur-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex" style="min-height: 100vh;">
      <!-- Sidebar -->
      <div class="bg-dark text-white d-flex flex-column" style="width: 270px; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);">
        <div class="p-4 border-bottom" style="border-color: rgba(255,255,255,0.08);">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 8px 24px rgba(139, 92, 246, 0.35);">
              <i class="bi bi-bug" style="font-size: 26px;"></i>
            </div>
            <div>
              <div class="fw-bold" style="font-size: 24px;">NADHEMNI</div>
              <div class="text-white-50" style="font-size: 13px;">Testeur QA</div>
            </div>
          </div>
        </div>
        
        <div class="flex-grow-1 py-3">
          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Principal</div>
            <a routerLink="/qa/dashboard" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </a>
          </div>

          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Tests</div>
            <a routerLink="/qa/tests" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-clipboard-check"></i>
              <span>Tests à exécuter</span>
            </a>
            <a routerLink="/qa/plans" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-list-check"></i>
              <span>Plans de test</span>
            </a>
          </div>

          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Qualité</div>
            <a routerLink="/qa/bugs" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-bug"></i>
              <span>Bugs</span>
            </a>
            <a routerLink="/qa/rapports" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-file-earmark-bar-graph"></i>
              <span>Rapports</span>
            </a>
          </div>

          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Projets</div>
            <a routerLink="/qa/projets" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-folder"></i>
              <span>Projets</span>
            </a>
            <a routerLink="/qa/time" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-stopwatch"></i>
              <span>Pointage</span>
            </a>
          </div>

          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Communication</div>
            <a routerLink="/qa/chat" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-chat-dots"></i>
              <span>Chat</span>
            </a>
          </div>

          <div class="mb-4">
            <div class="px-4 mb-2 text-uppercase fw-bold" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px;">Système</div>
            <a routerLink="/qa/notifications" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-bell"></i>
              <span>Notifications</span>
            </a>
            <a routerLink="/qa/parametres" routerLinkActive="active" class="nav-link text-white-50 text-decoration-none d-flex align-items-center gap-3 px-4 py-3 rounded-3 mx-3">
              <i class="bi bi-gear"></i>
              <span>Paramètres</span>
            </a>
          </div>
        </div>

        <div class="p-4 border-top" style="border-color: rgba(255,255,255,0.08);">
          <div class="d-flex align-items-center gap-3">
            <i class="bi bi-person-circle text-white-50" style="font-size: 32px;"></i>
            <div class="flex-grow-1">
              <div class="fw-bold text-white" style="font-size: 14px;">{{ currentUser?.nom || 'Testeur' }}</div>
              <div class="text-white-50" style="font-size: 12px;">{{ currentUser?.email || '' }}</div>
            </div>
            <button class="btn btn-sm btn-outline-light" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-grow-1 d-flex flex-column">
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4" style="height: 68px;">
          <span class="fw-bold" style="font-size: 20px;">Espace QA</span>
          <div class="ms-auto d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" (click)="toggleDarkMode()">
              <i class="bi bi-{{isDarkMode ? 'sun' : 'moon'}}"></i>
            </button>
            <button class="btn btn-outline-primary btn-sm">
              <i class="bi bi-bell"></i>
            </button>
            <button class="btn btn-outline-primary btn-sm">
              <i class="bi bi-person-circle"></i>
            </button>
          </div>
        </nav>
        <main class="p-4" style="background: #f8fafc; flex-grow-1;">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .nav-link:hover {
      background: rgba(255,255,255,0.08);
      color: #fff !important;
    }

    .nav-link.active {
      background: rgba(139, 92, 246, 0.15);
      color: #a78bfa !important;
    }
  `]
})
export class TesteurLayoutComponent implements OnInit {
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
    if (this.isDarkMode) document.body.classList.add('bg-dark', 'text-white');
    else document.body.classList.remove('bg-dark', 'text-white');
  }

  logout() { this.api.logout(); this.router.navigate(['/']); }
}
