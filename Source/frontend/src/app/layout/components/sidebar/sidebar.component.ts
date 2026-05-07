import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { SidebarService } from '@core/services/sidebar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { Subscription, combineLatest } from 'rxjs';
import { ApiService } from '@core/services/api.service';

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  subItems?: { name: string; path: string }[];
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  template: `

    <aside
      class="sidebar"
      [ngClass]="{
        'expanded': (isExpanded$ | async) || (isMobileOpen$ | async) || (isHovered$ | async),
        'collapsed': !((isExpanded$ | async) || (isMobileOpen$ | async) || (isHovered$ | async)),
        'mobile-open': isMobileOpen$ | async,
        'mobile-closed': !(isMobileOpen$ | async)
      }"
      (mouseenter)="onSidebarMouseEnter()"
      (mouseleave)="sidebarService.setHovered(false)"
      aria-label="Navigation principale"
    >
      <!-- Logo -->
      <div class="sidebar-logo"
        [ngClass]="{
          'logo-centered': !((isExpanded$ | async) || (isHovered$ | async)),
          'logo-start': (isExpanded$ | async) || (isHovered$ | async)
        }">
        <a routerLink="/" class="logo-link" aria-label="GestProjet - Accueil">
          <div class="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
              <path d="M2 17L12 22L22 17"/>
              <path d="M2 12L12 17L22 12"/>
            </svg>
          </div>
          @if ((isExpanded$ | async) || (isHovered$ | async) || (isMobileOpen$ | async)) {
            <span class="logo-text">GestProjet</span>
          }
        </a>
      </div>

      <!-- Nav -->
      <div class="sidebar-nav">
        <nav aria-label="Menu de navigation">
          <h2 class="nav-label"
            [ngClass]="{
              'label-centered': !((isExpanded$ | async) || (isHovered$ | async)),
              'label-start': (isExpanded$ | async) || (isHovered$ | async)
            }">
            @if ((isExpanded$ | async) || (isHovered$ | async) || (isMobileOpen$ | async)) { Menu }
            @else { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg> }
          </h2>
          <ul class="nav-list" role="menu">
            @for (nav of navItems; track $index; let i = $index) {
              <li role="none">
                @if (nav.subItems) {
                  <button (click)="toggleSubmenu('main', i)"
                    class="nav-item nav-item-button"
                    [class.nav-item-active]="openSubmenu === 'main-' + i"
                    [class.nav-item-inactive]="openSubmenu !== 'main-' + i"
                    [ngClass]="{ 'item-centered': !((isExpanded$ | async) || (isHovered$ | async)), 'item-start': (isExpanded$ | async) || (isHovered$ | async) }"
                    [attr.aria-expanded]="openSubmenu === 'main-' + i"
                    [attr.aria-controls]="'submenu-' + i">
                    <span class="nav-icon"
                      [class.nav-icon-active]="openSubmenu === 'main-' + i"
                      [class.nav-icon-inactive]="openSubmenu !== 'main-' + i"
                      [innerHTML]="nav.icon | safeHtml"></span>
                    @if ((isExpanded$ | async) || (isHovered$ | async) || (isMobileOpen$ | async)) {
                      <span class="nav-text">{{ nav.name }}</span>
                      <svg [class.arrow-rotated]="openSubmenu === 'main-' + i"
                        width="16" height="16" viewBox="0 0 20 20" fill="none"
                        class="nav-arrow">
                        <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    }
                  </button>
                  <div class="submenu-wrapper"
                    [id]="'submenu-' + i"
                    [attr.role]="openSubmenu === 'main-' + i ? 'menu' : 'none'"
                    [style.display]="(isExpanded$ | async) || (isHovered$ | async) || (isMobileOpen$ | async) ? 'block' : 'none'"
                    [ngStyle]="{ height: openSubmenu === 'main-' + i ? (subMenuHeights['main-' + i] || 0) + 'px' : '0px' }">
                    <ul class="submenu-list" role="menu">
                      @for (subItem of nav.subItems; track $index) {
                        <li role="none"><a [routerLink]="subItem.path" (click)="onSubmenuClick()"
                          class="submenu-item"
                          [class.submenu-item-active]="isActive(subItem.path)"
                          [class.submenu-item-inactive]="!isActive(subItem.path)"
                          role="menuitem">
                          {{ subItem.name }}
                        </a></li>
                      }
                    </ul>
                  </div>
                } @else {
                  @if (nav.path) {
                    <a [routerLink]="nav.path" routerLinkActive="nav-item-active"
                      class="nav-item nav-item-link"
                      [class.nav-item-inactive]="!isActive(nav.path)"
                      role="menuitem">
                      <span class="nav-icon"
                        [class.nav-icon-active]="isActive(nav.path)"
                        [class.nav-icon-inactive]="!isActive(nav.path)"
                        [innerHTML]="nav.icon | safeHtml"></span>
                      @if ((isExpanded$ | async) || (isHovered$ | async) || (isMobileOpen$ | async)) {
                        <span class="nav-text">{{ nav.name }}</span>
                      }
                    </a>
                  }
                }
              </li>
            }
          </ul>
        </nav>
      </div>

      <!-- Footer -->
      @if ((isExpanded$ | async) || (isHovered$ | async) || (isMobileOpen$ | async)) {
        <div class="sidebar-footer">
          <div class="footer-user">
            <div class="footer-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="footer-info">
              <p class="footer-name">{{ userName }}</p>
              <p class="footer-role">{{ userRole }}</p>
            </div>
          </div>
        </div>
      } @else {
        <div class="sidebar-footer footer-centered">
          <div class="footer-avatar-small">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
      }
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      display: flex;
      flex-direction: column;
      top: 0;
      left: 0;
      padding: 0 var(--space-md);
      background: white;
      color: var(--color-text);
      height: 100vh;
      transition: all var(--transition-slow);
      z-index: 1000;
      border-right: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      width: 72px;
      transform: translateX(-100%);
      overflow-y: auto;
      overflow-x: hidden;
    }

    :host-context(.dark) .sidebar {
      background: var(--color-slate-900);
      border-right-color: var(--color-slate-800);
    }

    .sidebar.expanded {
      width: 280px;
    }

    .sidebar.collapsed {
      width: 72px;
    }

    @media (min-width: 1280px) {
      .sidebar.mobile-closed {
        transform: translateX(0);
      }
    }

    .sidebar.mobile-open {
      transform: translateX(0);
    }

    .sidebar.mobile-closed {
      transform: translateX(-100%);
    }

    .sidebar-logo {
      padding: var(--space-xl) 0;
      display: flex;
    }

    .sidebar-logo.logo-centered {
      justify-content: center;
    }

    .sidebar-logo.logo-start {
      justify-content: flex-start;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      overflow: hidden;
      text-decoration: none;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
      transition: box-shadow var(--transition-base);
    }

    .logo-link:hover .logo-icon {
      box-shadow: var(--shadow-md);
    }

    .logo-text {
      font-size: 18px;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.5px;
      color: var(--color-text);
    }

    :host-context(.dark) .logo-text {
      color: white;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;
      padding-bottom: var(--space-md);
    }

    .nav-label {
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-text-muted);
      margin-bottom: var(--space-sm);
      display: flex;
    }

    :host-context(.dark) .nav-label {
      color: var(--color-slate-500);
    }

    .nav-label.label-centered {
      justify-content: center;
    }

    .nav-label.label-start {
      justify-content: flex-start;
    }

    .nav-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      text-decoration: none;
      color: var(--color-text);
    }

    .nav-item-button {
      width: 100%;
      background: none;
      border: none;
    }

    .nav-item.nav-item-active {
      background: var(--color-brand-500);
      color: white;
    }

    .nav-item.nav-item-inactive:hover {
      background: var(--color-bg);
    }

    :host-context(.dark) .nav-item.nav-item-inactive:hover {
      background: var(--color-slate-800);
    }

    .nav-item.item-centered {
      justify-content: center;
    }

    .nav-item.item-start {
      justify-content: flex-start;
    }

    .nav-icon {
      flex-shrink: 0;
      color: var(--color-text-muted);
      transition: color var(--transition-base);
    }

    .nav-icon svg {
      width: 24px;
      height: 24px;
    }

    .nav-icon.nav-icon-active {
      color: white;
    }

    .nav-icon.nav-icon-inactive {
      color: var(--color-text-muted);
    }

    .nav-text {
      flex: 1;
      font-size: 14px;
      font-weight: var(--font-weight-medium);
    }

    .nav-arrow {
      width: 16px;
      height: 16px;
      transition: transform var(--transition-base);
      flex-shrink: 0;
    }

    .nav-arrow.arrow-rotated {
      transform: rotate(180deg);
      color: var(--color-brand-500);
    }

    .submenu-wrapper {
      overflow: hidden;
      transition: all var(--transition-slow);
    }

    .submenu-list {
      margin-top: var(--space-xs);
      margin-left: var(--space-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .submenu-item {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-size: 13px;
      text-decoration: none;
      color: var(--color-text);
      transition: all var(--transition-base);
    }

    .submenu-item.submenu-item-active {
      background: var(--color-brand-500);
      color: white;
    }

    .submenu-item.submenu-item-inactive:hover {
      background: var(--color-bg);
    }

    :host-context(.dark) .submenu-item.submenu-item-inactive:hover {
      background: var(--color-slate-800);
    }

    .sidebar-footer {
      border-top: 1px solid var(--color-border);
      padding: var(--space-md) 0;
    }

    :host-context(.dark) .sidebar-footer {
      border-top-color: var(--color-slate-800);
    }

    .footer-user {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 0 var(--space-xs);
    }

    .footer-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: var(--font-weight-bold);
      font-size: 12px;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }

    .footer-info {
      overflow: hidden;
    }

    .footer-name {
      font-size: 14px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host-context(.dark) .footer-name {
      color: white;
    }

    .footer-role {
      font-size: 12px;
      color: var(--color-text-muted);
      margin: 2px 0 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .footer-centered {
      display: flex;
      justify-content: center;
      padding: var(--space-md) 0;
    }

    .footer-avatar-small {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
    }

    .footer-avatar-small:hover {
      box-shadow: var(--shadow-md);
      transform: scale(1.05);
    }
  `]
})
export class SidebarComponent {
  sidebarService = inject(SidebarService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private api = inject(ApiService);

  isExpanded$ = this.sidebarService.isExpanded$;
  isMobileOpen$ = this.sidebarService.isMobileOpen$;
  isHovered$ = this.sidebarService.isHovered$;

  openSubmenu: string | null = null;
  subMenuHeights: { [key: string]: number } = {};
  private subscription = new Subscription();

  navItems: NavItem[] = [];
  userName = '';
  userRole = '';
  userInitials = '';

  // SVG icon templates
  private svg(name: string): string {
    const icons: Record<string, string> = {
      grid: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 3.25C4.26 3.25 3.25 4.26 3.25 5.5V9C3.25 10.24 4.26 11.25 5.5 11.25H9C10.24 11.25 11.25 10.24 11.25 9V5.5C11.25 4.26 10.24 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.09 5.09 4.75 5.5 4.75H9C9.41 4.75 9.75 5.09 9.75 5.5V9C9.75 9.41 9.41 9.75 9 9.75H5.5C5.09 9.75 4.75 9.41 4.75 9V5.5ZM5.5 12.75C4.26 12.75 3.25 13.76 3.25 15V18.5C3.25 19.74 4.26 20.75 5.5 20.75H9C10.24 20.75 11.25 19.74 11.25 18.5V15C11.25 13.76 10.24 12.75 9 12.75H5.5ZM4.75 15C4.75 14.59 5.09 14.25 5.5 14.25H9C9.41 14.25 9.75 14.59 9.75 15V18.5C9.75 18.91 9.41 19.25 9 19.25H5.5C5.09 19.25 4.75 18.91 4.75 18.5V15ZM12.75 5.5C12.75 4.26 13.76 3.25 15 3.25H18.5C19.74 3.25 20.75 4.26 20.75 5.5V9C20.75 10.24 19.74 11.25 18.5 11.25H15C13.76 11.25 12.75 10.24 12.75 9V5.5ZM15 4.75C14.59 4.75 14.25 5.09 14.25 5.5V9C14.25 9.41 14.59 9.75 15 9.75H18.5C18.91 9.75 19.25 9.41 19.25 9V5.5C19.25 5.09 18.91 4.75 18.5 4.75H15ZM15 12.75C13.76 12.75 12.75 13.76 12.75 15V18.5C12.75 19.74 13.76 20.75 15 20.75H18.5C19.74 20.75 20.75 19.74 20.75 18.5V15C20.75 13.76 19.74 12.75 18.5 12.75H15ZM14.25 15C14.25 14.59 14.59 14.25 15 14.25H18.5C18.91 14.25 19.25 14.59 19.25 15V18.5C19.25 18.91 18.91 19.25 18.5 19.25H15C14.59 19.25 14.25 18.91 14.25 18.5V15Z" fill="currentColor"/></svg>`,
      building: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      users: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      credit: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M3 10h18M3 6h18M3 14h18M3 18h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      package: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      shield: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      journal: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      chat: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      clipboard: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      settings: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      rocket: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.16-.05-3.05a2.14 2.14 0 0 0-2.95-.05ZM12 15l-3-3M16 2l-3.5 5.5L8 12l4 4 4.5-4.5L22 8l-6-6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      calendar: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      clock: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      calendarCheck: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM9 14l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      userPlus: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M20 8h-4M18 6v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      report: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      folder: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      list: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      activity: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      bug: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M8 2v4M16 2v4M9 13h6M9 17h6M12 8c-4.42 0-8 2.24-8 5v3c0 2.76 3.58 5 8 5s8-2.24 8-5v-3c0-2.76-3.58-5-8-5ZM2 13h2M20 13h2M3.34 7.34 5 9M18.66 7.34 17 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      doc: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      map: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4ZM8 2v16M16 6v16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      bell: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      home: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      briefcase: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M20 8H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      send: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      user: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    };
    return icons[name] || icons['grid'];
  }

  ngOnInit() {
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      })
    );
    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(() => {
        this.cdr.detectChanges();
      })
    );
    this.loadUserInfo();
    this.generateMenuByRole();
    this.setActiveMenuFromRoute(this.router.url);
  }

  loadUserInfo() {
    const user = this.api.getCurrentUser();
    if (user) {
      const sanitize = (val: any) => (val && typeof val === 'string') ? val.replace(/undefined/g, '').trim() : (val || '');
      const prenom = sanitize(user.prenom || user.Prenom);
      const nom = sanitize(user.nom || user.Nom);
      
      this.userName = `${prenom} ${nom}`.trim() || 'Utilisateur';
      this.userInitials = (prenom?.charAt(0) || '') + (nom?.charAt(0) || '');
    }
  }

  generateMenuByRole() {
    const role = this.api.getUserRole();
    const s = (name: string) => this.svg(name);

    const menuConfigs: { [key: string]: NavItem[] } = {
      'superadmin': [
        { name: 'Tableau de bord', icon: s('grid'), path: '/superadmin' },
        { name: 'Sociétés', icon: s('building'), path: '/superadmin/societes' },
        { name: 'Utilisateurs', icon: s('users'), path: '/superadmin/utilisateurs' },
        { name: 'Abonnements', icon: s('credit'), path: '/superadmin/abonnements' },
        { name: 'Rôles', icon: s('users'), path: '/superadmin/roles' },
        { name: 'Sécurité', icon: s('shield'), path: '/superadmin/alertes' },
        { name: 'IP Bloquées', icon: s('shield'), path: '/superadmin/ipblocked' },
        { name: 'Surveillance', icon: s('activity'), path: '/superadmin/surveillance' },
        { name: 'Politique', icon: s('journal'), path: '/superadmin/politique' },
        { name: 'Logs Système', icon: s('journal'), path: '/superadmin/logs' },
        { name: 'Communication', icon: s('chat'), path: '/superadmin/chat' },
        { name: 'Notifications', icon: s('bell'), path: '/superadmin/notifications' },
        { name: 'Tests', icon: s('clipboard'), path: '/superadmin/tests-disponibles' },
        { name: 'Paramètres', icon: s('settings'), path: '/superadmin/parametre' },
        { name: 'Mon Profil', icon: s('user'), path: '/superadmin/profil' }
      ],
      'admin_societe': [
        { name: 'Tableau de bord', icon: s('grid'), path: '/admin/dashboard' },
        { name: 'Projets', icon: s('rocket'), path: '/admin/projets' },
        { name: 'Employés', icon: s('users'), path: '/admin/employes' },
        { name: 'Clients', icon: s('briefcase'), path: '/admin/clients' },
        { name: 'Talent Metrics', icon: s('activity'), path: '/rh/talent-metrics' },
        { name: 'Ressources Humaines', icon: s('users'), path: '/admin/rh' },
        { name: 'Pointage Équipe', icon: s('clock'), path: '/admin/pointage' },
        { name: 'Congés', icon: s('calendarCheck'), path: '/admin/conges' },
        { name: 'Paiements', icon: s('credit'), path: '/admin/paiements' },
        { name: 'Communication', icon: s('chat'), path: '/admin/chat' },
        { name: 'Modules', icon: s('package'), path: '/admin/modules' },
        { name: 'Notifications', icon: s('bell'), path: '/admin/notifications' },
        { name: 'Paramètres', icon: s('settings'), path: '/admin/parametres' },
        { name: 'Mon Profil', icon: s('user'), path: '/admin/profil' }
      ],
      'rh': [
        { name: 'Tableau de bord', icon: s('grid'), path: '/rh/dashboard' },
        { name: 'Talent Intelligence', icon: s('activity'), path: '/rh/talent-metrics' },
        { name: 'Présences', icon: s('clock'), path: '/rh/pointage' },
        { name: 'Congés', icon: s('calendarCheck'), path: '/rh/conges' },
        { name: 'Employés', icon: s('users'), path: '/rh/employes' },
        { name: 'Recrutement', icon: s('userPlus'), path: '/rh/recrutement' },
        { name: 'Tests Candidats', icon: s('clipboard'), path: '/rh/tests' },
        { name: 'Rapports RH', icon: s('report'), path: '/rh/rapports' },
        { name: 'Communication', icon: s('chat'), path: '/rh/chat' },
        { name: 'Notifications', icon: s('bell'), path: '/rh/notifications' },
        { name: 'Paramètres', icon: s('settings'), path: '/rh/parametres' },
        { name: 'Mon Profil', icon: s('user'), path: '/rh/profil' }
      ],
      'chef_projet': [
        { name: 'Dashboard', icon: s('grid'), path: '/chef/dashboard' },
        { name: 'Projets', icon: s('folder'), path: '/chef/projets' },
        { name: 'Tâches', icon: s('list'), path: '/chef/taches' },
        { name: 'Équipe', icon: s('users'), path: '/chef/equipe' },
        { name: 'Congés', icon: s('calendarCheck'), path: '/chef/conges' },
        { name: 'Suivi & Stats', icon: s('activity'), path: '/chef/suivi' },
        { name: 'Bugs', icon: s('bug'), path: '/chef/bugs' },
        { name: 'Rapports', icon: s('report'), path: '/chef/rapports' },
        { name: 'Time Tracking', icon: s('clock'), path: '/chef/time' },
        { name: 'Communication', icon: s('chat'), path: '/chef/chat' },
        { name: 'Notifications', icon: s('bell'), path: '/chef/notifications' },
        { name: 'Paramètres', icon: s('settings'), path: '/chef/parametres' },
        { name: 'Mon Profil', icon: s('user'), path: '/chef/profil' }
      ],
      'developpeur': [
        { name: 'Dashboard', icon: s('grid'), path: '/dev/dashboard' },
        { name: 'Mes Tâches', icon: s('list'), path: '/dev/taches' },
        { name: 'Projets', icon: s('folder'), path: '/dev/projets' },
        { name: 'Congés', icon: s('calendarCheck'), path: '/dev/conges' },
        { name: 'Bugs', icon: s('bug'), path: '/dev/bugs' },
        { name: 'Time Tracking', icon: s('clock'), path: '/dev/time' },
        { name: 'API Docs', icon: s('doc'), path: '/dev/api' },
        { name: 'Diagrams', icon: s('map'), path: '/dev/diagrams' },
        { name: 'Communication', icon: s('chat'), path: '/dev/chat' },
        { name: 'Notifications', icon: s('bell'), path: '/dev/notifications' },
        { name: 'Paramètres', icon: s('settings'), path: '/dev/parametres' },
        { name: 'Mon Profil', icon: s('user'), path: '/dev/profil' }
      ],
      'testeur': [
        { name: 'Dashboard', icon: s('grid'), path: '/qa/dashboard' },
        { name: 'Congés', icon: s('calendarCheck'), path: '/qa/conges' },
        { name: 'Tests & QA', icon: s('clipboard'), path: '/qa/tests' },
        { name: 'Plans de Test', icon: s('map'), path: '/qa/plans' },
        { name: 'Bugs', icon: s('bug'), path: '/qa/bugs' },
        { name: 'Projets', icon: s('folder'), path: '/qa/projets' },
        { name: 'Time Tracking', icon: s('clock'), path: '/qa/time' },
        { name: 'Rapports QA', icon: s('report'), path: '/qa/rapports' },
        { name: 'Communication', icon: s('chat'), path: '/qa/chat' },
        { name: 'Notifications', icon: s('bell'), path: '/qa/notifications' },
        { name: 'Paramètres', icon: s('settings'), path: '/qa/parametres' },
        { name: 'Mon Profil', icon: s('user'), path: '/qa/profil' }
      ],
      'candidat': [
        { name: 'Accueil', icon: s('home'), path: '/applicant' },
        { name: 'Offres', icon: s('briefcase'), path: '/applicant/offres' },
        { name: 'Candidatures', icon: s('send'), path: '/applicant/postuler' },
        { name: 'Profil', icon: s('user'), path: '/applicant/profil' }
      ],
      'client_projet': [
        { name: 'Dashboard', icon: s('grid'), path: '/client/dashboard' },
        { name: 'Mes Projets', icon: s('folder'), path: '/client/projets' },
        { name: 'Rapports', icon: s('report'), path: '/client/rapports' },
        { name: 'Feedback', icon: s('chat'), path: '/client/feedback' },
        { name: 'Messagerie', icon: s('send'), path: '/client/chat' },
        { name: 'Notifications', icon: s('bell'), path: '/client/notifications' },
        { name: 'Paramètres', icon: s('settings'), path: '/client/parametres' },
        { name: 'Mon Profil', icon: s('user'), path: '/client/profil' }
      ]
    };

    const roleMapping: { [key: string]: string } = {
      't001': 'superadmin', 't002': 'admin_societe', 't003': 'rh',
      't004': 'chef_projet', 't005': 'developpeur', 't006': 'testeur', 't007': 'candidat',
      't008': 'client_projet',
      'admin_societe': 'admin_societe', 'admin': 'admin_societe',
      'client_projet': 'client_projet', 'client': 'client_projet'
    };

    const normalizedRole = roleMapping[role] || role;
    console.log('Sidebar - Rôle détecté:', role, 'Rôle normalisé:', normalizedRole);
    this.navItems = menuConfigs[normalizedRole] || menuConfigs['candidat'];
    this.userRole = this.getRoleLabel(normalizedRole);
  }

  private getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'superadmin': 'Super Admin', 'admin_societe': 'Admin Société', 'rh': 'Ressources Humaines',
      'chef_projet': 'Chef de Projet', 'developpeur': 'Développeur', 'testeur': 'Testeur QA',
      'candidat': 'Candidat', 'client_projet': 'Client Projet'
    };
    return labels[role] || role;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;
    if (this.openSubmenu === key) {
      this.openSubmenu = null;
    } else {
      this.openSubmenu = key;
      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.sidebarService.setHovered(true);
  }

  onSubmenuClick() {
    this.sidebarService.setMobileOpen(false);
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    this.navItems.forEach((nav, i) => {
      if (nav.subItems) {
        nav.subItems.forEach(sub => {
          if (currentUrl.includes(sub.path)) {
            this.openSubmenu = `main-${i}`;
            setTimeout(() => {
              const el = document.getElementById(`main-${i}`);
              if (el) this.subMenuHeights[`main-${i}`] = el.scrollHeight;
            });
          }
        });
      }
    });
  }
}
