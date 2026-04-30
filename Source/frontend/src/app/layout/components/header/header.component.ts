import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '@core/services/sidebar.service';
import { ApiService } from '@core/services/api.service';

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
                   placeholder="Rechercher (Projets, Tâches...)" 
                   aria-label="Rechercher" 
                   class="search-input"/>
            
            @if (searchResults.length > 0 || isSearching) {
              <div class="search-dropdown shadow-premium">
                @if (isSearching) {
                  <div class="search-loading">Recherche en cours...</div>
                }
                @for (res of searchResults; track res.id) {
                  <div class="search-result-item" (click)="searchResults = []">
                    <span class="res-type">{{res.type}}</span>
                    <span class="res-title">{{res.titre || res.nom}}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
        <div class="header-right">
          <button class="header-btn header-btn-icon" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span *ngIf="notifCount > 0" class="notification-badge">{{notifCount}}</span>
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
            <div class="user-avatar">{{ userInitials }}</div>
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

    @media (min-width: 640px) {
      .header-content {
        padding: var(--space-sm) var(--space-lg);
      }
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .header-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .header-btn:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    :host-context(.dark) .header-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .header-btn-desktop {
      display: none;
    }

    @media (min-width: 1280px) {
      .header-btn-desktop {
        display: flex;
      }
    }

    .header-btn-desktop.rotated svg {
      transform: rotate(180deg);
    }

    .header-btn-icon {
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #ef4444;
      color: white;
      font-size: 10px;
      font-weight: 800;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    :host-context(.dark) .notification-badge {
      border-color: var(--color-slate-900);
    }

    .header-btn-logout:hover {
      color: #ef4444;
    }

    :host-context(.dark) .header-btn-logout:hover {
      color: #f87171;
    }

    .search-wrapper {
      display: none;
      position: relative;
    }

    @media (min-width: 768px) {
      .search-wrapper {
        display: block;
      }
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 280px;
      padding-left: 40px;
      padding-right: var(--space-md);
      height: 40px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      transition: all var(--transition-base);
    }

    .search-input::placeholder {
      color: var(--color-text-muted);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-brand-500);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    :host-context(.dark) .search-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-slate-700);
    }

    :host-context(.dark) .search-input:focus {
      border-color: var(--color-brand-500);
    }

    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      width: 400px;
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      max-height: 400px;
      overflow-y: auto;
      z-index: 100;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    :host-context(.dark) .search-dropdown {
      background: #1e293b;
      border-color: #334155;
    }

    .search-loading {
      padding: var(--space-md);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-align: center;
    }

    .search-result-item {
      padding: var(--space-md);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 1px solid var(--color-border);
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .search-result-item:hover {
      background: var(--color-bg);
    }

    :host-context(.dark) .search-result-item {
      border-bottom-color: #334155;
    }

    :host-context(.dark) .search-result-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .res-type {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      padding: 2px 6px;
      background: #e0e7ff;
      color: #4338ca;
      border-radius: 4px;
    }

    .res-title {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text);
    }

    .shadow-premium {
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }

    .header-divider {
      width: 1px;
      height: 32px;
      background: var(--color-border);
      margin: 0 var(--space-sm);
    }

    :host-context(.dark) .header-divider {
      background: var(--color-slate-700);
    }

    .user-info {
      display: none;
      align-items: center;
      gap: var(--space-md);
    }

    @media (min-width: 640px) {
      .user-info {
        display: flex;
      }
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }

    .user-role {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
    }
  `]
})
export class HeaderComponent implements OnInit {
  sidebarService = inject(SidebarService);
  private api = inject(ApiService);
  private router = inject(Router);

  isExpanded$ = this.sidebarService.isExpanded$;
  isDark = false;
  userName = '';
  userRole = '';
  userInitials = '';
  notifCount = 3;

  searchQuery = '';
  isSearching = false;
  searchResults: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    if (user) {
      this.userName = (user.prenom || user.Prenom || '') + ' ' + (user.nom || user.Nom || '');
      this.userInitials = (this.userName.split(' ').map(n => n[0]).join('')).toUpperCase().substring(0, 2);
      this.userRole = user.role || user.Role || 'Membre';
    }
    this.isDark = document.body.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    if (this.isDark) document.body.classList.add('dark');
  }

  onSearch() {
    if (this.searchQuery.length > 2) {
      this.isSearching = true;
      const user = this.api.getCurrentUser();
      // TODO: Implement globalSearch in ApiService
      // this.api.globalSearch(this.searchQuery, user?.societeId || user?.SocieteId).subscribe({
      //   next: (res: any) => {
      //     this.searchResults = res || [];
      //     this.isSearching = false;
      //   },
      //   error: () => this.isSearching = false
      // });
      this.searchResults = [];
      this.isSearching = false;
    } else {
      this.searchResults = [];
    }
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
