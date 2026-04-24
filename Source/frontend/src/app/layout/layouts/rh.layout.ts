import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { AIAssistantComponent } from '../components/ai-assistant.component';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-rh-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, AIAssistantComponent],
  template: `

    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <app-sidebar></app-sidebar>

      @if (isMobileOpen$ | async) {
        <div (click)="sidebarService.setMobileOpen(false)"
          class="fixed inset-0 z-40 bg-gray-900/50 xl:hidden"></div>
      }

      <div class="transition-all duration-300 ease-in-out"
        [ngClass]="{
          'xl:ml-[290px]': (isExpanded$ | async) || (isHovered$ | async),
          'xl:ml-[90px]': !((isExpanded$ | async) || (isHovered$ | async)),
          'ml-0': true
        }">
        <app-header></app-header>
        <main class="p-4 md:p-6 max-w-[1600px] mx-auto">
          <router-outlet></router-outlet>
        </main>
      </div>

      <app-ai-assistant></app-ai-assistant>
    </div>
  `
})
export class RhLayoutComponent {
  sidebarService = inject(SidebarService);
  isExpanded$ = this.sidebarService.isExpanded$;
  isHovered$ = this.sidebarService.isHovered$;
  isMobileOpen$ = this.sidebarService.isMobileOpen$;
}
