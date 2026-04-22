import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Configuration</span>
          </div>
          <h1 class="header-title">
            System <span class="gradient-text">Nexus.</span>
          </h1>
          <p class="header-subtitle">
            Global Environment Parameters & Security Protocols for {{societeNom}}.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="saveAll()" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Commit Global Changes
          </button>
        </div>
      </header>

      <!-- Settings Grid -->
      <div class="settings-grid">
         <!-- Left Column -->
         <div class="settings-main">
            <section class="card">
               <div class="card-header">
                  <div class="header-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 21h18"/>
                      <path d="M5 21V7l7-4 7 4v14"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <h3>Identity Matrix</h3>
               </div>

               <div class="form-grid">
                  <div class="form-field">
                     <label>Entity Nomenclature</label>
                     <input [(ngModel)]="societe.nom" class="form-input" placeholder="Enterprise Name">
                  </div>
                  <div class="form-field">
                     <label>Transmission Frequency (Email)</label>
                     <input [(ngModel)]="societe.email" class="form-input" placeholder="contact@nexus.com">
                  </div>
                  <div class="form-field">
                     <label>Communication Line</label>
                     <input [(ngModel)]="societe.telephone" class="form-input" placeholder="+216 ...">
                  </div>
                  <div class="form-field">
                     <label>Geographical Sector</label>
                     <input [(ngModel)]="societe.adresse" class="form-input" placeholder="Physical Address">
                  </div>
               </div>

               <div class="form-field">
                  <label>Executive Summary</label>
                  <textarea [(ngModel)]="societe.description" class="form-input" rows="4" placeholder="Enterprise mission directive..."></textarea>
               </div>
            </section>

            <section class="card">
               <div class="card-header">
                  <div class="header-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <h3>Operational Schedule</h3>
               </div>

               <div class="form-grid">
                  <div class="form-field">
                     <label>Standard Start</label>
                     <input type="time" [(ngModel)]="config.heureDebut" class="form-input">
                  </div>
                  <div class="form-field">
                     <label>Standard End</label>
                     <input type="time" [(ngModel)]="config.heureFin" class="form-input">
                  </div>
                  <div class="form-field">
                     <label>Temporal Zone</label>
                     <select class="form-input">
                        <option>GMT+1 (Tunis/Paris)</option>
                        <option>UTC (Global Standard)</option>
                     </select>
                  </div>
               </div>
            </section>
         </div>

         <!-- Right Column -->
         <div class="settings-sidebar">
            <section class="card card-dark">
               <div class="card-header">
                  <div class="header-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="13.5" cy="6.5" r=".5"/>
                      <circle cx="17.5" cy="10.5" r=".5"/>
                      <circle cx="8.5" cy="7.5" r=".5"/>
                      <circle cx="6.5" cy="12.5" r=".5"/>
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                    </svg>
                  </div>
                  <h3>Interface Prefs</h3>
               </div>

               <div class="settings-toggles">
                  <div class="toggle-item">
                     <div class="toggle-info">
                        <p>Cimmerian Mode</p>
                        <span>Enable high-contrast dark environment</span>
                     </div>
                     <button (click)="toggleDarkMode()" class="toggle-btn" [class.active]="isDarkMode">
                       <span class="toggle-knob"></span>
                     </button>
                  </div>

                  <div class="toggle-item">
                     <div class="toggle-info">
                        <p>Signal Notifications</p>
                        <span>Audio-visual operational alerts</span>
                     </div>
                     <button class="toggle-btn active">
                       <span class="toggle-knob"></span>
                     </button>
                  </div>

                  <div class="toggle-item">
                     <div class="toggle-info">
                        <p>Neural Sync (AI)</p>
                        <span>Llama 3.2 real-time assistance</span>
                     </div>
                     <button class="toggle-btn active">
                       <span class="toggle-knob"></span>
                     </button>
                  </div>
               </div>
            </section>

            <section class="card">
               <div class="card-header">
                  <div class="header-icon header-icon-danger">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <h3>Security Protocols</h3>
               </div>
               
               <p class="security-text">Unauthorized access attempts will be logged and the originating node will be quarantined. Dual-factor authentication is mandatory for all Command Level entities.</p>
               
               <button class="btn btn-danger w-full">
                  Rotate Encryption Keys
               </button>
            </section>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(148, 163, 184, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #cbd5e1, #94a3b8, #64748b);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .header-actions {
      position: relative;
      z-index: 1;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #94a3b8;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-lg);
    }

    .settings-main {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .settings-sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
    }

    .card-dark {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .header-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--color-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text);
    }

    .header-icon-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .card-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .card-dark .card-header h3 {
      color: white;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
    }

    .form-field {
      margin-bottom: var(--space-md);
    }

    .form-field label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-xs);
    }

    .form-input {
      width: 100%;
      padding: var(--space-sm);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      border-color: rgba(148, 163, 184, 0.3);
    }

    .card-dark .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .card-dark .form-input:focus {
      border-color: rgba(255, 255, 255, 0.2);
    }

    .card-dark .form-field label {
      color: #94a3b8;
    }

    .settings-toggles {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) 0;
    }

    .toggle-info p {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .toggle-info span {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .card-dark .toggle-info p {
      color: white;
    }

    .card-dark .toggle-info span {
      color: #94a3b8;
    }

    .toggle-btn {
      width: 48px;
      height: 24px;
      background: #d1d5db;
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: background var(--transition-base);
      border: none;
    }

    .toggle-btn.active {
      background: #6366f1;
    }

    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-base);
    }

    .toggle-btn.active .toggle-knob {
      transform: translateX(24px);
    }

    .security-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-md);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .card-header h3 {
      color: var(--color-text);
    }

    :host-context(.dark) .form-input {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .toggle-info p {
      color: var(--color-text);
    }

    @media (max-width: 1024px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminParametresComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societe: any = { nom: '', email: '', telephone: '', adresse: '', description: '' };
  config: any = { heureDebut: '08:00', heureFin: '17:00' };
  isDarkMode = false;
  societeNom = '';

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const societeId = user?.societeId || '';
    if (societeId) {
      this.api.getSocieteById(societeId).subscribe(s => {
        this.societe = s;
        this.societeNom = s.nom;
      });
    }
    this.api.getUserPreference('apparence').subscribe((p: any) => this.isDarkMode = p === true);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.api.setUserPreference('apparence', this.isDarkMode);
    if (this.isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }

  saveAll() {
    this.api.updateSociete(this.societe).subscribe(() => {
      this.snackBar.open('System Nexus Updated Successfully', 'OK', { duration: 3000 });
    });
  }
}
