import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  section: string;
}

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex" style="height: 100vh;">
      <div class="sidebar" style="width: 280px; background: #0f172a; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; overflow: hidden;">
        <div class="sidebar-header p-3">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
              <i class="bi bi-terminal" style="color: #fff; font-size: 20px;"></i>
            </div>
            <div>
              <span class="d-block fw-bold" style="color: #fff; font-size: 14px;">ANTIGRAVITY</span>
              <span class="d-block" style="color: #94a3b8; font-size: 11px;">SaaS Command Center</span>
            </div>
          </div>
        </div>

        <div class="flex-grow-1 overflow-y-auto" style="padding: 0 12px;">
          @for (section of menuSections; track section) {
            <div class="mb-4">
              <span class="d-block px-3 mb-2" style="color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">{{getSectionLabel(section)}}</span>
              @for (item of getMenuBySection(section); track item.route) {
                <a class="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" 
                   [routerLink]="item.route" 
                   routerLinkActive="active"
                   [routerLinkActiveOptions]="{exact: item.route === '/superadmin'}"
                   style="color: #94a3b8; transition: all 0.2s; margin-bottom: 4px;">
                  <i class="bi bi-{{item.icon}}" [style.color]="item.icon === 'dashboard' ? '#6366f1' : item.icon === 'apartment' ? '#10b981' : '#94a3b8'"></i>
                  <span>{{item.label}}</span>
                </a>
              }
            </div>
          }
        </div>

        <div class="sidebar-footer p-3" style="border-top: 1px solid rgba(255,255,255,0.05);">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background: #6366f1; color: #fff; font-size: 14px; font-weight: 600;">
              {{ currentUser?.nom?.charAt(0) }}
            </div>
            <div class="flex-grow-1">
              <span class="d-block" style="color: #fff; font-size: 13px;">{{ currentUser?.nom || 'Admin' }}</span>
              <span class="d-block" style="color: #94a3b8; font-size: 11px;">System Root</span>
            </div>
            <button class="btn btn-sm btn-light" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="flex-grow-1 d-flex flex-column" style="background: #f8fafc;">
        <div class="d-flex justify-content-between align-items-center p-3" style="background: #fff; border-bottom: 1px solid #e2e8f0;">
           <div>
              <span class="fw-bold" style="font-size: 18px; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Command Hub</span>
           </div>
           <div class="d-flex align-items-center gap-3">
              <div class="d-flex align-items-center gap-2">
                 <span class="rounded-circle" style="width: 8px; height: 8px; background: #10b981; animation: pulse 2s infinite;"></span>
                 <span style="color: #64748b; font-size: 12px;">Nodes Online</span>
              </div>
              <button class="btn btn-sm btn-light position-relative">
                <i class="bi bi-bell"></i>
                <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
              </button>
              <div class="d-flex align-items-center gap-2 px-3 py-1 rounded-3" style="background: #f1f5f9; cursor: pointer;">
                 <span style="color: #1a1a2e; font-size: 13px;">Root Admin</span>
                 <i class="bi bi-chevron-down" style="font-size: 12px; color: #64748b;"></i>
              </div>
           </div>
        </div>
        <main class="flex-grow-1 p-4 overflow-y-auto">
           <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    a.active {
      background: rgba(99, 102, 241, 0.1) !important;
      color: #fff !important;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class SuperAdminLayoutComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  currentUser: any = null;

  menuItems: MenuItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/superadmin', section: 'PRINCIPAL' },
    { label: 'Chat', icon: 'chat', route: '/superadmin/chat', section: 'PRINCIPAL' },
    { label: 'Sociétés', icon: 'apartment', route: '/superadmin/societes', section: 'GESTION' },
    { label: 'Utilisateurs', icon: 'supervisor_account', route: '/superadmin/utilisateurs', section: 'GESTION' },
    { label: 'Rôles & Permissions', icon: 'admin_panel_settings', route: '/superadmin/roles', section: 'GESTION' },
    { label: 'Modules', icon: 'inventory_2', route: '/superadmin/modules', section: 'GESTION' },
    { label: 'Abonnements', icon: 'subscriptions', route: '/superadmin/abonnements', section: 'ABONNEMENTS' },
    
    { label: 'Historique', icon: 'history', route: '/superadmin/logs', section: 'SURVEILLANCE' },
    { label: 'IPs Bloquées', icon: 'block', route: '/superadmin/ipblocked', section: 'SURVEILLANCE' },
    { label: 'Notifications', icon: 'notifications', route: '/superadmin/notifications', section: 'SURVEILLANCE' },
    { label: 'Politique', icon: 'policy', route: '/superadmin/politique', section: 'SURVEILLANCE' },
    { label: 'Surveillance Temps Réel', icon: 'monitoring', route: '/superadmin/surveillance', section: 'SURVEILLANCE' }
  ];

  menuSections = ['PRINCIPAL', 'GESTION', 'ABONNEMENTS', 'SURVEILLANCE', 'SYSTÈME'];
  isDarkMode = false;

  getMenuBySection(section: string): MenuItem[] {
    return this.menuItems.filter(item => item.section === section);
  }

  getSectionLabel(section: string): string {
    const labels: { [key: string]: string } = {
      'PRINCIPAL': 'Principal',
      'GESTION': 'Gestion',
      'ABONNEMENTS': 'Abonnements',
      'SURVEILLANCE': 'Surveillance',
      'SYSTÈME': 'Système'
    };
    return labels[section] || section;
  }

  ngOnInit() {
    this.currentUser = this.api.getCurrentUser();
    this.api.getUserPreference('apparence').subscribe({
      next: (prefs: any) => {
        this.isDarkMode = prefs?.darkMode || false;
        this.applyTheme();
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.api.setUserPreference('apparence', { darkMode: this.isDarkMode });
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/']);
  }
}
