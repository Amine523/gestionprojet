import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '@core/services/sidebar.service';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <button (click)="sidebarService.toggleMobileOpen()" class="header-btn" aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <button (click)="sidebarService.toggleExpanded()" class="header-btn header-btn-desktop" [class.rotated]="!(isExpanded$ | async)" aria-label="Toggle sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="search-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="search-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
            </svg>
            <input type="search" 
                   [(ngModel)]="searchQuery" 
                   (input)="onSearch()"
                   [placeholder]="lang.lang === 'fr' ? 'Rechercher...' : 'Search...'" 
                   aria-label="Rechercher" 
                   class="search-input"/>
          </div>
        </div>
        <div class="header-right">
          <button (click)="goToNotifications()" class="header-btn header-btn-icon" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span *ngIf="notifCount() > 0" class="notification-badge">{{notifCount()}}</span>
          </button>
          <button (click)="toggleTheme()" class="header-btn" aria-label="Toggle theme">
            @if (isDark) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
              </svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>
          <button (click)="logout()" class="header-btn header-btn-logout" aria-label="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
          <div class="header-divider"></div>
          <div class="user-info">
            <div class="user-details">
              <p class="user-name">{{ userName }}</p>
              <p class="user-role">{{ userRole }}</p>
            </div>
            <div class="user-avatar-container">
               @if (userPhoto) {
                  <img [src]="userPhoto" class="user-avatar-img">
               } @else {
                  <div class="user-avatar">{{ userInitials }}</div>
               }
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 40;
      display: flex;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    :host-context(.dark) .header {
      background: rgba(15, 23, 42, 0.95);
      border-bottom-color: var(--color-slate-800);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-grow: 1;
      padding: var(--space-sm) var(--space-md);
    }

    .header-left, .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .header-btn {
      width: 40px; height: 40px;
      border-radius: var(--radius-lg);
      background: transparent; border: none;
      color: var(--color-text-muted); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }

    .header-btn:hover { background: var(--color-bg); color: var(--color-text); }

    .search-input {
      width: 200px;
      padding: 0 var(--space-md) 0 36px;
      height: 38px;
      border-radius: var(--radius-full);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      font-size: 14px;
    }

    .search-wrapper { position: relative; }
    .search-icon { position: absolute; left: 12px; top: 10px; color: var(--color-text-muted); }

    .notification-badge {
      position: absolute; top: 0; right: 0;
      background: #ef4444; color: white;
      font-size: 10px; font-weight: 800;
      width: 16px; height: 16px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid white;
    }

    .header-divider { width: 1px; height: 24px; background: var(--color-border); margin: 0 8px; }

    .user-info { display: flex; align-items: center; gap: 12px; }
    .user-details { text-align: right; }
    .user-name { font-size: 14px; font-weight: 600; margin: 0; }
    .user-role { font-size: 12px; color: var(--color-text-muted); margin: 0; }
    
    .user-avatar-container { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; }
    .user-avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .user-avatar { 
      width: 100%; height: 100%; 
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: bold; font-size: 14px;
    }

    @media (max-width: 640px) {
      .user-details, .search-wrapper, .header-btn-desktop { display: none; }
    }
  `]
})
export class HeaderComponent implements OnInit {
  sidebarService = inject(SidebarService);
  private api = inject(ApiService);
  private router = inject(Router);
  public lang = inject(LanguageService);
  private notifService = inject(NotificationService);

  isExpanded$ = this.sidebarService.isExpanded$;
  isDark = false;
  userName = '';
  userRole = '';
  userInitials = '';
  userPhoto = '';
  notifCount = computed(() => this.notifService.unreadCount());

  searchQuery = '';

  ngOnInit() {
    this.loadUserData();
    this.api.userUpdate$.subscribe(() => this.loadUserData());
    this.isDark = document.body.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    if (this.isDark) document.body.classList.add('dark');
  }

  loadUserData() {
    const user = this.api.getCurrentUser();
    if (user) {
      const sanitize = (val: any) => (val && typeof val === 'string') ? val.replace(/undefined/g, '').trim() : (val || '');
      const prenom = sanitize(user.prenom || user.Prenom);
      const nom = sanitize(user.nom || user.Nom);
      
      this.userName = `${prenom} ${nom}`.trim() || 'Utilisateur';
      this.userInitials = (this.userName.split(' ').map(n => n[0]).join('')).toUpperCase().substring(0, 2);
      this.userRole = ApiService.getRoleLabel(user.typeUtilisateurId || user.TypeUtilisateurId || user.role);
      this.userPhoto = user.photo || '';
    }
  }

  onSearch() {
    // Logic for search
  }

  goToNotifications() {
    const role = this.api.getUserRole();
    const mapping: any = {
      't001': 'superadmin', 't002': 'admin', 't003': 'rh', 't004': 'chef', 't005': 'dev', 't006': 'qa', 't007': 'applicant', 't008': 'client'
    };
    const prefix = mapping[role] || 'dev';
    this.router.navigate([`/${prefix}/notifications`]);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/auth/login']);
  }
}
