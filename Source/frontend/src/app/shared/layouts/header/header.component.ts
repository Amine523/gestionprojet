import { Component, Input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `

    <header [class]="'header ' + variant">
      <div class="header-left">
        @if (showMenuToggle) {
          <button class="menu-toggle" (click)="onMenuToggle.emit()">
            <i class="bi bi-list"></i>
          </button>
        }
        @if (breadcrumb) {
          <nav class="breadcrumb">
            <a *ngFor="let crumb of breadcrumb; let last = last" [href]="crumb.link" [class.active]="last">
              <i *ngIf="crumb.icon" [class]="'bi bi-' + crumb.icon"></i>
              {{crumb.label}}
            </a>
          </nav>
        }
      </div>

      <div class="header-right">
        @if (showSearch) {
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="Rechercher..." (input)="onSearch.emit($event)">
          </div>
        }

        <div class="header-actions">
          @if (showNotifications) {
            <button class="action-btn" (click)="onNotifications.emit()">
              <i class="bi bi-bell"></i>
              @if (notificationCount > 0) {
                <span class="badge">{{notificationCount}}</span>
              }
            </button>
          }

          @if (showSettings) {
            <button class="action-btn" (click)="onSettings.emit()">
              <i class="bi bi-gear"></i>
            </button>
          }

          <div class="user-menu" (click)="onUserMenu.emit()">
            <div class="user-avatar">
              {{userInitials}}
            </div>
            <div class="user-info" *ngIf="showUserInfo">
              <span class="user-name">{{userName}}</span>
              <span class="user-role">{{userRole}}</span>
            </div>
            <i class="bi bi-chevron-down"></i>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 70px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: fixed;
      top: 0;
      left: 280px;
      right: 0;
      z-index: 90;
      transition: left 0.3s ease;
    }

    .header.collapsed {
      left: 80px;
    }

    .header.light {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
    }

    .header.dark {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(10px);
      border-bottom-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .menu-toggle {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background: #f8fafc;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 20px;
    }

    .menu-toggle:hover {
      background: #e2e8f0;
      color: #4f46e5;
    }

    .header.dark .menu-toggle {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .header.dark .menu-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb a {
      color: #64748b;
      text-decoration: none;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s;
    }

    .breadcrumb a:hover {
      color: #4f46e5;
    }

    .breadcrumb a.active {
      color: #1e293b;
      font-weight: 600;
    }

    .header.dark .breadcrumb a {
      color: rgba(255, 255, 255, 0.7);
    }

    .header.dark .breadcrumb a.active {
      color: white;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      min-width: 280px;
    }

    .header.dark .search-box {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .search-box i {
      color: #64748b;
    }

    .header.dark .search-box i {
      color: rgba(255, 255, 255, 0.7);
    }

    .search-box input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 14px;
      color: #1e293b;
      outline: none;
    }

    .header.dark .search-box input {
      color: white;
    }

    .search-box input::placeholder {
      color: #94a3b8;
    }

    .header.dark .search-box input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background: #f8fafc;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 18px;
      position: relative;
    }

    .action-btn:hover {
      background: #e2e8f0;
      color: #4f46e5;
    }

    .header.dark .action-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .header.dark .action-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .action-btn .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-menu:hover {
      background: #e2e8f0;
    }

    .header.dark .user-menu {
      background: rgba(255, 255, 255, 0.1);
    }

    .header.dark .user-menu:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }

    .header.dark .user-name {
      color: white;
    }

    .user-role {
      font-size: 11px;
      color: #64748b;
    }

    .header.dark .user-role {
      color: rgba(255, 255, 255, 0.7);
    }

    .user-menu i {
      color: #64748b;
      font-size: 12px;
    }

    .header.dark .user-menu i {
      color: rgba(255, 255, 255, 0.7);
    }

    @media (max-width: 768px) {
      .search-box {
        display: none;
      }

      .user-info {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() variant: 'light' | 'dark' = 'light';
  @Input() showMenuToggle = true;
  @Input() showSearch = true;
  @Input() showNotifications = true;
  @Input() showSettings = true;
  @Input() showUserInfo = true;
  @Input() collapsed = false;
  @Input() notificationCount = 0;
  @Input() breadcrumb?: Array<{label: string, link?: string, icon?: string}>;
  @Input() userName = 'Utilisateur';
  @Input() userRole = 'Admin';
  @Input() userInitials = 'U';

  onMenuToggle = output<void>();
  onSearch = output<Event>();
  onNotifications = output<void>();
  onSettings = output<void>();
  onUserMenu = output<void>();
}
