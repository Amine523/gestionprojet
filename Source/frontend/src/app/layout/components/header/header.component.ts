import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarService } from '@core/services/sidebar.service';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '<header class=\"header\"><div class=\"header-content\"><div class=\"header-left\"><button (click)=\"sidebarService.toggleMobileOpen()\" class=\"header-btn\" aria-label=\"Toggle menu\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 12h18M3 6h18M3 18h18\"/></svg></button><button (click)=\"sidebarService.toggleExpanded()\" class=\"header-btn header-btn-desktop\" [class.rotated]=\"!(isExpanded$ | async)\" aria-label=\"Toggle sidebar\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 19l-7-7 7-7M18 19l-7-7 7-7\"/></svg></button><div class=\"search-wrapper\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" class=\"search-icon\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z\"/></svg><input type=\"search\" placeholder=\"Rechercher...\" aria-label=\"Rechercher\" class=\"search-input\"/></div></div><div class=\"header-right\"><button class=\"header-btn header-btn-icon\" aria-label=\"Notifications\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0\"/></svg><span class=\"notification-badge\"></span></button><button (click)=\"toggleTheme()\" class=\"header-btn\" aria-label=\"Toggle theme\">@if (isDark) {<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"><path d=\"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z\"/></svg>} @else {<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z\"/></svg>}</button><button (click)=\"logout()\" class=\"header-btn header-btn-logout\" aria-label=\"Déconnexion\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9\"/></svg></button><div class=\"header-divider\"></div><div class=\"user-info\"><div class=\"user-details\"><p class=\"user-name\">{{ userName }}</p><p class=\"user-role\">{{ userRole }}</p></div><div class=\"user-avatar\">{{ userInitials }}</div></div></div></div></header>',
  styles: ['.header { position: sticky; top: 0; z-index: 40; display: flex; width: 100%; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--color-border); box-shadow: var(--shadow-sm); } :host-context(.dark) .header { background: rgba(15, 23, 42, 0.9); border-bottom-color: var(--color-slate-800); } .header-content { display: flex; align-items: center; justify-content: space-between; flex-grow: 1; padding: var(--space-sm) var(--space-md); } @media (min-width: 640px) { .header-content { padding: var(--space-sm) var(--space-lg); } } .header-left { display: flex; align-items: center; gap: var(--space-sm); } .header-right { display: flex; align-items: center; gap: var(--space-xs); } .header-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--radius-md); background: transparent; border: none; color: var(--color-text-muted); cursor: pointer; transition: all var(--transition-base); } .header-btn:hover { color: var(--color-text); } :host-context(.dark) .header-btn:hover { color: white; } .header-btn-desktop { display: none; } @media (min-width: 1280px) { .header-btn-desktop { display: flex; } } .header-btn-desktop.rotated svg { transform: rotate(180deg); } .header-btn-icon { position: relative; } .notification-badge { position: absolute; top: 8px; right: 8px; width: 10px; height: 10px; background: #ef4444; border-radius: 50%; border: 2px solid white; } :host-context(.dark) .notification-badge { border-color: var(--color-slate-900); } .header-btn-logout:hover { color: #ef4444; } :host-context(.dark) .header-btn-logout:hover { color: #f87171; } .search-wrapper { display: none; position: relative; } @media (min-width: 768px) { .search-wrapper { display: block; } } .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); } .search-input { width: 256px; padding-left: 40px; padding-right: var(--space-md); height: 36px; border-radius: var(--radius-md); border: 1px solid transparent; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); transition: all var(--transition-base); } .search-input:focus { outline: none; background: white; border-color: var(--color-brand-500); } :host-context(.dark) .search-input { background: var(--color-slate-800); } :host-context(.dark) .search-input:focus { background: var(--color-slate-900); } @media (min-width: 1024px) { .search-input { width: 288px; } } .header-divider { width: 1px; height: 24px; background: var(--color-border); margin: 0 var(--space-sm); } :host-context(.dark) .header-divider { background: var(--color-slate-700); } .user-info { display: flex; align-items: center; gap: var(--space-sm); padding-left: var(--space-xs); cursor: pointer; } .user-details { text-align: right; display: none; } @media (min-width: 640px) { .user-details { display: block; } } .user-name { font-size: 14px; font-weight: var(--font-weight-semibold); color: var(--color-text); line-height: 1.25; margin: 0; } :host-context(.dark) .user-name { color: white; } .user-role { font-size: 12px; color: var(--color-text-muted); margin: 2px 0 0 0; } .user-avatar { width: 40px; height: 40px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600)); display: flex; align-items: center; justify-content: center; color: white; font-weight: var(--font-weight-bold); font-size: 14px; box-shadow: var(--shadow-sm); transition: box-shadow var(--transition-base); } .user-info:hover .user-avatar { box-shadow: var(--shadow-md); }']
})
export class HeaderComponent {
  sidebarService = inject(SidebarService);
  private api = inject(ApiService);
  private router = inject(Router);

  isExpanded$ = this.sidebarService.isExpanded$;
  isDark = false;
  userName = '';
  userRole = '';
  userInitials = '';

  ngOnInit() {

    const user = this.api.getCurrentUser();
    if (user) {
      this.userName = user.prenom + ' ' + user.nom;
      this.userInitials = user.prenom.charAt(0) + user.nom.charAt(0);
    }
    this.isDark = document.body.classList.contains('dark');
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
