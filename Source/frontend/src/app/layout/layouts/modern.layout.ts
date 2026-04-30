import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { AIAssistantComponent } from '@shared/components/ai-assistant/ai-assistant.component';
import { AIHealthBadge } from '@shared/components/ai-health-badge/ai-health-badge.component';

@Component({
  selector: 'app-modern-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    AIAssistantComponent,
    AIHealthBadge
  ],
  template: `
    <mat-sidenav-container class="h-screen bg-slate-50 dark:bg-slate-950">
      <!-- Sidebar -->
      <mat-sidenav #sidenav mode="side" [opened]="isSidebarOpen()" 
                   class="w-72 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300">
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="p-8">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <mat-icon class="text-white">rocket_launch</mat-icon>
              </div>
              <span class="text-xl font-black text-slate-900 dark:text-white tracking-tight">GestProjet</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="flex-1 px-4 space-y-1">
            @for (item of menuItems(); track item.path) {
              <a [routerLink]="item.path" routerLinkActive="active-link"
                 class="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all group">
                <mat-icon class="group-hover:scale-110 transition-transform">{{ item.icon }}</mat-icon>
                <span class="font-bold text-sm">{{ item.label }}</span>
              </a>
            }
          </nav>

          <!-- User Card (Bottom) -->
          <div class="p-4 border-t border-slate-100 dark:border-slate-800">
            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                {{ userInitials() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ userName() }}</p>
                <p class="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{{ userRole() }}</p>
              </div>
              <button mat-icon-button class="text-slate-400" [matMenuTriggerFor]="userMenu">
                <mat-icon>settings</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="flex flex-col">
        <!-- Header -->
        <header class="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
          <div class="flex items-center space-x-4">
            <button mat-icon-button (click)="isSidebarOpen.set(!isSidebarOpen())">
              <mat-icon>{{ isSidebarOpen() ? 'menu_open' : 'menu' }}</mat-icon>
            </button>
            
            <!-- Global Search -->
            <div class="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2 w-96 border border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
              <mat-icon class="text-slate-400 mr-2">search</mat-icon>
              <input type="text" placeholder="Rechercher (Ctrl+K)..." 
                     class="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200">
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <app-ai-health-badge></app-ai-health-badge>
            <!-- Context Switcher (Super Admin) -->
            @if (userRole() === 'SUPER_ADMIN') {
              <button mat-stroked-button class="rounded-xl border-slate-200 dark:border-slate-700">
                <mat-icon class="mr-2">business</mat-icon>
                Société: Toutes
              </button>
            }

            <!-- Notifications -->
            <button mat-icon-button [matBadge]="notifCount()" matBadgeColor="warn" matBadgeSize="small" class="text-slate-500 hover:text-indigo-600">
              <mat-icon>notifications</mat-icon>
            </button>

            <!-- Theme Toggle -->
            <button mat-icon-button (click)="toggleTheme()" class="text-slate-500">
              <mat-icon>{{ isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
          </div>
        </header>

        <!-- Page Outlet -->
        <main class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <!-- Floating AI Assistant -->
    <app-ai-assistant></app-ai-assistant>

    <!-- Menus -->
    <mat-menu #userMenu="matMenu" class="rounded-2xl mt-2 overflow-hidden">
      <div class="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <p class="text-xs text-slate-500 mb-1">Connecté en tant que</p>
        <p class="text-sm font-bold text-slate-900 dark:text-white">{{ userEmail() }}</p>
      </div>
      <button mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon> Profil
      </button>
      <button mat-menu-item routerLink="/settings">
        <mat-icon>settings</mat-icon> Paramètres
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="logout()" class="text-rose-500">
        <mat-icon class="text-rose-500">logout</mat-icon> Déconnexion
      </button>
    </mat-menu>
  `,
  styles: [`
    .active-link {
      @apply bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 !important;
    }
  `]
})
export class ModernLayoutComponent {
  private auth = inject(AuthService);
  private notifService = inject(NotificationService);
  private router = inject(Router);

  isSidebarOpen = signal(true);
  isDarkMode = signal(false);
  
  userName = computed(() => this.auth.currentUser()?.nom || 'Utilisateur');
  userEmail = computed(() => this.auth.currentUser()?.email || '');
  userRole = computed(() => this.auth.getUserRole());
  userInitials = computed(() => this.userName().substring(0, 2).toUpperCase());
  notifCount = computed(() => this.notifService.unreadCount());

  menuItems = computed(() => {
    const role = this.userRole();
    const items = [
      { label: 'Dashboard', icon: 'grid_view', path: `/${role.toLowerCase().replace('_', '-')}` }
    ];

    if (role === 'SUPER_ADMIN') {
      items.push(
        { label: 'Sociétés', icon: 'business', path: '/super-admin/societes' },
        { label: 'Abonnements', icon: 'subscriptions', path: '/super-admin/abonnements' },
        { label: 'Modules', icon: 'extension', path: '/super-admin/modules' }
      );
    } else if (role === 'ADMIN_SOCIETE') {
      items.push(
        { label: 'Utilisateurs', icon: 'people', path: '/admin/utilisateurs' },
        { label: 'Projets', icon: 'assignment', path: '/admin/projets' },
        { label: 'Recrutement', icon: 'work', path: '/admin/recrutement' }
      );
    } else if (role === 'CHEF_PROJET') {
      items.push(
        { label: 'Projets', icon: 'assignment', path: '/chef-projet/liste' },
        { label: 'Tâches', icon: 'task_alt', path: '/chef-projet/taches' },
        { label: 'Équipe', icon: 'groups', path: '/chef-projet/equipe' }
      );
    } else if (role === 'DEVELOPPEUR') {
      items.push(
        { label: 'Mes Tâches', icon: 'checklist', path: '/dev/mes-taches' },
        { label: 'Pointage', icon: 'timer', path: '/dev/pointage' },
        { label: 'IA Analytics', icon: 'analytics', path: '/dev/ai-performance' }
      );
    } else if (role === 'TESTEUR_QA') {
      items.push(
        { label: 'Tableau QA', icon: 'bug_report', path: '/qa/bugs' },
        { label: 'Mes Tâches', icon: 'checklist', path: '/qa/mes-taches' },
        { label: 'Tests Auto', icon: 'fact_check', path: '/qa/tests-auto' }
      );
    } else if (role === 'CLIENT') {
      items.push(
        { label: 'Mes Projets', icon: 'business_center', path: '/client/dashboard' },
        { label: 'Factures', icon: 'receipt_long', path: '/client/factures' },
        { label: 'Support', icon: 'support_agent', path: '/client/support' }
      );
    }

    return items;
  });

  toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
