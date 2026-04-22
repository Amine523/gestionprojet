import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

    <aside [class]="'sidebar ' + variant + (collapsed ? ' collapsed' : '')">
      <div class="sidebar-header">
        <div class="logo">
          <i class="bi bi-hexagon"></i>
          <span class="logo-text" *ngIf="!collapsed">SaaS Platform</span>
        </div>
        <button class="collapse-btn" (click)="toggleCollapse()">
          <i [class]="'bi bi-chevron-' + (collapsed ? 'right' : 'left')"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section" *ngFor="section of menuSections">
          <div class="section-title" *ngIf="section.title && !collapsed">{{section.title}}</div>
          <a 
            class="nav-item" 
            *ngFor="item of section.items"
            [routerLink]="item.link"
            [class.active]="isActive(item.link)"
            [class.disabled]="item.disabled">
            <i [class]="'bi bi-' + item.icon"></i>
            <span class="nav-text" *ngIf="!collapsed">{{item.label}}</span>
            @if (item.badge && !collapsed) {
              <span class="nav-badge">{{item.badge}}</span>
            }
          </a>
        </div>
      </nav>

      <div class="sidebar-footer" *ngIf="!collapsed">
        <div class="user-info">
          <div class="user-avatar">
            {{userInitials}}
          </div>
          <div class="user-details">
            <div class="user-name">{{userName}}</div>
            <div class="user-role">{{userRole}}</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      transition: width 0.3s ease;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar.light {
      background: white;
      color: #1e293b;
      border-right: 1px solid #e2e8f0;
    }

    .sidebar-header {
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar.light .sidebar-header {
      border-bottom-color: #e2e8f0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo i {
      font-size: 28px;
      color: #06b6d4;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      font-family: 'Outfit', sans-serif;
    }

    .collapse-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .sidebar.light .collapse-btn {
      background: #f8fafc;
      color: #64748b;
    }

    .collapse-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .sidebar.light .collapse-btn:hover {
      background: #e2e8f0;
    }

    .sidebar-nav {
      flex: 1;
      padding: 20px 12px;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.5);
      padding: 0 12px;
      margin-bottom: 12px;
    }

    .sidebar.light .section-title {
      color: #94a3b8;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.2s;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .sidebar.light .nav-item {
      color: #64748b;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .sidebar.light .nav-item:hover {
      background: #f8fafc;
      color: #4f46e5;
    }

    .nav-item.active {
      background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .sidebar.light .nav-item.active {
      background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
      color: white;
    }

    .nav-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-item i {
      font-size: 20px;
      width: 24px;
      text-align: center;
    }

    .nav-text {
      flex: 1;
      font-size: 14px;
    }

    .nav-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.2);
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar.light .sidebar-footer {
      border-top-color: #e2e8f0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .sidebar.light .user-info {
      background: #f8fafc;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      color: white;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .user-role {
      font-size: 12px;
      opacity: 0.7;
    }

    /* Custom scrollbar */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }

    .sidebar.light .sidebar-nav::-webkit-scrollbar-thumb {
      background: #cbd5e1;
    }
  `]
})
export class SidebarComponent {
  @Input() variant: 'dark' | 'light' = 'dark';
  @Input() collapsed = false;
  @Input() menuSections: Array<{
    title?: string;
    items: Array<{
      label: string;
      icon: string;
      link: string;
      disabled?: boolean;
      badge?: string;
    }>
  }> = [];
  @Input() userName = 'Utilisateur';
  @Input() userRole = 'Admin';
  @Input() userInitials = 'U';

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  isActive(link: string): boolean {
    return window.location.pathname === link;
  }
}
