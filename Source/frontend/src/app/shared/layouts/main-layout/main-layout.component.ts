import { Component, Input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  template: `

    <div [class]="'main-layout ' + theme">
      <app-sidebar
        [variant]="sidebarVariant"
        [collapsed]="sidebarCollapsed"
        [menuSections]="menuSections"
        [userName]="userName"
        [userRole]="userRole"
        [userInitials]="userInitials">
      </app-sidebar>

      <div class="main-content" [class.collapsed]="sidebarCollapsed">
        <app-header
          [variant]="headerVariant"
          [showMenuToggle]="showMenuToggle"
          [showSearch]="showSearch"
          [showNotifications]="showNotifications"
          [showSettings]="showSettings"
          [showUserInfo]="showUserInfo"
          [collapsed]="sidebarCollapsed"
          [notificationCount]="notificationCount"
          [breadcrumb]="breadcrumb"
          [userName]="userName"
          [userRole]="userRole"
          [userInitials]="userInitials"
          (onMenuToggle)="toggleSidebar()"
          (onSearch)="onSearch.emit($event)"
          (onNotifications)="onNotifications.emit()"
          (onSettings)="onSettings.emit()"
          (onUserMenu)="onUserMenu.emit()">
        </app-header>

        <main class="content-wrapper">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      min-height: 100vh;
      background: #f0f4f8;
    }

    .main-layout.dark {
      background: #0f172a;
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      transition: margin-left 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .main-content.collapsed {
      margin-left: 80px;
    }

    .content-wrapper {
      margin-top: 70px;
      padding: 32px;
      min-height: calc(100vh - 70px);
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }

      .main-content.collapsed {
        margin-left: 0;
      }

      .content-wrapper {
        padding: 20px;
      }
    }
  `]
})
export class MainLayoutComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() sidebarVariant: 'dark' | 'light' = 'dark';
  @Input() headerVariant: 'light' | 'dark' = 'light';
  @Input() showMenuToggle = true;
  @Input() showSearch = true;
  @Input() showNotifications = true;
  @Input() showSettings = true;
  @Input() showUserInfo = true;
  @Input() sidebarCollapsed = false;
  @Input() notificationCount = 0;
  @Input() menuSections: any[] = [];
  @Input() breadcrumb?: any[];
  @Input() userName = 'Utilisateur';
  @Input() userRole = 'Admin';
  @Input() userInitials = 'U';

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onSearch = output<Event>();
  onNotifications = output<void>();
  onSettings = output<void>();
  onUserMenu = output<void>();
}
