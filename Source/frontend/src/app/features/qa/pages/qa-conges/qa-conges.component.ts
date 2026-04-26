import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="conges-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Espace Absences</h1>
          <p class="header-subtitle">Gérez vos demandes de congés en toute simplicité</p>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="balance-card">
          <div class="balance-header">
            <div class="balance-info">
              <span class="balance-label">Solde Restant</span>
              <h2 class="balance-value">{{solde.soldeRestant}} <span>jours</span></h2>
            </div>
            <div class="balance-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 18a5 5 0 0 0-10 0"></path>
                <line x1="12" y1="2" x2="12" y2="9"></line>
                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                <line x1="1" y1="18" x2="3" y2="18"></line>
                <line x1="21" y1="18" x2="23" y2="18"></line>
                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                <line x1="23" y1="22" x2="1" y2="22"></line>
                <polyline points="16 5 12 9 8 5"></polyline>
              </svg>
            </div>
          </div>
          <div class="balance-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(solde.soldeRestant / solde.soldeTotal) * 100"></div>
            </div>
            <div class="progress-labels">
              <span>Consommé: {{solde.soldeUtilise}}j</span>
              <span>Total: {{solde.soldeTotal}}j</span>
            </div>
          </div>
        </div>

        <div class="quick-stats">
          <div class="mini-tile">
            <svg class="icon-amber" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div class="mini-info">
              <span class="mini-value">{{solde.congesEnAttente}}</span>
              <span class="mini-label">En attente</span>
            </div>
          </div>
          <div class="mini-tile">
            <svg class="icon-emerald" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div class="mini-info">
              <span class="mini-value">{{solde.congesValides}}</span>
              <span class="mini-label">Approuvés</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <div class="form-widget">
          <div class="widget-header">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Nouvelle Demande
            </h3>
          </div>
          <form (ngSubmit)="soumettreDemande()">
            <div class="form-group">
              <label class="form-label">Type de congé</label>
              <select [(ngModel)]="nouvelleDemande.typePointageId" name="type" class="form-select" required>
                <option value="NORMAL">Congé Annuel</option>
                <option value="MALADIE">Maladie</option>
                <option value="EXCEP">Exceptionnel</option>
                <option value="HALFDAY">Demi-journée</option>
                <option value="AUTORISATION">Autorisation (Heures)</option>
                <option value="VACATION">Vacances / Vacation</option>
              </select>
            </div>

            @if (nouvelleDemande.typePointageId === 'HALFDAY' || nouvelleDemande.typePointageId === 'AUTORISATION') {
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Date</label>
                  <input type="date" [(ngModel)]="nouvelleDemande.dateDebut" name="start" class="form-input" required>
                </div>

                @if (nouvelleDemande.typePointageId === 'HALFDAY') {
                  <div class="form-group">
                    <label class="form-label">Période</label>
                    <select [(ngModel)]="nouvelleDemande.periode" name="periode" class="form-select" required>
                      <option value="Matin">Matin</option>
                      <option value="Après-midi">Après-midi</option>
                    </select>
                  </div>
                }
                @if (nouvelleDemande.typePointageId === 'AUTORISATION') {
                  <div class="form-group">
                    <label class="form-label">Nombre d'heures</label>
                    <input type="number" [(ngModel)]="nouvelleDemande.heures" name="heures" class="form-input" required min="1" max="8">
                  </div>
                }
              </div>
            } @else {
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Date de début</label>
                  <input type="date" [(ngModel)]="nouvelleDemande.dateDebut" name="start" class="form-input" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Date de fin</label>
                  <input type="date" [(ngModel)]="nouvelleDemande.dateFin" name="end" class="form-input" required>
                </div>
              </div>
            }

            <div class="form-group">
              <label class="form-label">Motif / Justification</label>
              <textarea [(ngModel)]="nouvelleDemande.motif" name="motif" class="form-textarea" rows="3" placeholder="Ex: Vacances d'été, Rendez-vous médical..."></textarea>
            </div>

            @if (nouvelleDemande.typePointageId === 'MALADIE') {
              <div class="upload-zone" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onFileDrop($event)" [class.has-file]="justificatifFile">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                @if (!justificatifFile) {
                  <span class="upload-text">Joindre un justificatif médical<br><small>PDF, JPG, PNG · max 5MB</small></span>
                }
                @if (justificatifFile) {
                  <span class="upload-text">{{justificatifFile.name}}<br><small>{{(justificatifFile.size / 1024 / 1024).toFixed(2)}} MB · Cliquer pour changer</small></span>
                }
                <input #fileInput type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileSelect($event)" style="display:none">
              </div>
            }

            <button class="btn btn-primary btn-full" type="submit" [disabled]="loading">
              @if (!loading) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13"></polygon>
                </svg>
              }
              {{loading ? 'Traitement...' : 'Envoyer la demande'}}
            </button>
          </form>
        </div>

        <div class="history-widget">
          <div class="widget-header">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Mes Demandes Récentes
            </h3>
          </div>
          <div class="history-list">
            @for (c of conges; track c.id) {
              <div class="history-item">
                <div class="history-icon">
                  @if (c.status === 'Validée') {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  }
                  @if (c.status !== 'Validée') {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  }
                </div>
                <div class="history-main">
                  <div class="history-top">
                    <span class="history-type">{{c.typeNom}}</span>
                    <span class="status-badge" [class.status-validée]="c.status === 'Validée'" [class.status-refusée]="c.status === 'Refusée'" [class.status-en-attente]="c.status === 'En attente'">
                      {{c.status}}
                    </span>
                  </div>
                  <div class="history-bottom">
                    <span class="history-range">{{c.dateDebut | date:'dd MMM'}} - {{c.dateFin | date:'dd MMM yyyy'}}</span>
                    <span class="history-days">• {{c.nombreJours}} jours</span>
                  </div>
                </div>
              </div>
            }
            @if (conges.length === 0) {
              <div class="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p>Aucune demande enregistrée</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .conges-container {
      padding: var(--space-xl);
      max-width: 1300px;
      margin: 0 auto;
      background: var(--color-bg);
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-2xl);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
      margin: var(--space-xs) 0 0;
    }

    .stats-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: var(--space-lg);
      margin-bottom: var(--space-2xl);
    }

    .balance-card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
    }

    .balance-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-lg);
    }

    .balance-info {
      flex: 1;
    }

    .balance-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .balance-value {
      font-size: 40px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: var(--space-xs) 0 0;
      line-height: 1;
    }

    .balance-value span {
      font-size: 18px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .balance-icon {
      width: 56px;
      height: 56px;
      background: #eff6ff;
      color: #3b82f6;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .balance-progress {
      margin-top: var(--space-lg);
    }

    .progress-bar {
      height: 8px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      border-radius: var(--radius-full);
      transition: width 0.5s ease-out;
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      margin-top: var(--space-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
    }

    .quick-stats {
      display: grid;
      grid-template-rows: 1fr 1fr;
      gap: var(--space-md);
    }

    .mini-tile {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      box-shadow: var(--shadow-sm);
    }

    .icon-amber {
      color: #f59e0b;
    }

    .icon-emerald {
      color: #10b981;
    }

    .mini-info {
      display: flex;
      flex-direction: column;
    }

    .mini-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      line-height: 1;
    }

    .mini-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-xl);
      align-items: start;
    }

    .form-widget,
    .history-widget {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
    }

    .widget-header {
      margin-bottom: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: var(--space-md);
    }

    .widget-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      border-color: #3b82f6;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .upload-zone {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      border: 2px dashed var(--color-border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      margin-bottom: var(--space-md);
      background: var(--color-bg);
      color: var(--color-text-muted);
    }

    .upload-zone:hover {
      border-color: #3b82f6;
      background: #eff6ff;
      color: #3b82f6;
    }

    .upload-zone.has-file {
      border-color: #10b981;
      background: #ecfdf5;
      color: #059669;
    }

    .upload-text {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      line-height: 1.6;
    }

    .upload-text small {
      font-weight: var(--font-weight-normal);
      font-size: var(--font-size-xs);
      opacity: 0.8;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-full {
      width: 100%;
      height: 54px;
      margin-top: var(--space-sm);
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      max-height: 480px;
      overflow-y: auto;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      transition: all var(--transition-base);
    }

    .history-item:hover {
      transform: translateY(-2px);
      background: white;
      border-color: var(--color-border);
      box-shadow: var(--shadow-md);
    }

    .history-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      box-shadow: var(--shadow-sm);
    }

    .history-main {
      flex: 1;
    }

    .history-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xs);
    }

    .history-type {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .status-badge {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      letter-spacing: 0.05em;
    }

    .status-badge.status-validée {
      background: #ecfdf5;
      color: #059669;
    }

    .status-badge.status-refusée {
      background: #fef2f2;
      color: #dc2626;
    }

    .status-badge.status-en-attente {
      background: #fffbeb;
      color: #d97706;
    }

    .history-bottom {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
    }

    .history-days {
      color: #3b82f6;
      font-weight: var(--font-weight-bold);
    }

    .empty-state {
      padding: var(--space-2xl);
      text-align: center;
      color: var(--color-text-muted);
    }

    .empty-state svg {
      margin-bottom: var(--space-sm);
    }

    .empty-state p {
      margin: 0;
    }

    /* Dark mode */
    :host-context(.dark) .conges-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .balance-card,
    :host-context(.dark) .mini-tile,
    :host-context(.dark) .form-widget,
    :host-context(.dark) .history-widget {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .balance-value,
    :host-context(.dark) .mini-value,
    :host-context(.dark) .widget-header h3,
    :host-context(.dark) .form-label,
    :host-context(.dark) .history-type {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .balance-label,
    :host-context(.dark) .mini-label,
    :host-context(.dark) .progress-labels {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .form-input,
    :host-context(.dark) .form-select,
    :host-context(.dark) .form-textarea {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .upload-zone {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .history-item {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .history-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .history-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-row {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QaCongesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  solde = { soldeTotal: 30, soldeUtilise: 0, soldeRestant: 30, congesEnAttente: 0, congesValides: 0 };
  conges: any[] = [];
  nouvelleDemande = { typePointageId: 'NORMAL', dateDebut: null, dateFin: null, motif: '', periode: 'Matin', heures: 2 };
  loading = false;
  justificatifFile: File | null = null;
  lastDemandeId: string | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const uid = this.api.getCurrentUserId();
    this.api.getSoldeConge(uid).subscribe(res => {
      this.solde = res;
    });
    
    // Get all requests for history
    this.api.getDemandesCongeByUtilisateur(uid).subscribe(data => {
      if (data) {
        this.conges = data.map((d: any) => {
            const dDebut = new Date(d.dateDebut || d.DateDebut);
            const dFin = new Date(d.dateFin || d.DateFin);
            let nj = d.jours || d.Jours || 0;
            if (!nj && !isNaN(dDebut.getTime()) && !isNaN(dFin.getTime())) {
              const diffTime = Math.abs(dFin.getTime() - dDebut.getTime());
              nj = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            }
            return {
              ...d,
              id: d.id || d.Id,
              nombreJours: nj,
              dateDebut: d.dateDebut || d.DateDebut,
              dateFin: d.dateFin || d.DateFin,
              typeNom: d.typeNom || d.TypeNom || 'Congé',
              status: this.formatStatus(d.status || d.Status || 'En attente')
            };
          })
          .sort((a: any, b: any) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime());
      } else {
        this.conges = [];
      }
    });
  }

  private formatStatus(status: string): string {
    if (!status) return 'En attente';
    const s = status.toLowerCase().replace('_', ' ');
    if (s === 'en attente' || s === 'pending') return 'En attente';
    if (s === 'validée' || s === 'validee' || s === 'validated' || s === 'approved') return 'Validée';
    if (s === 'refusée' || s === 'refusee' || s === 'rejected') return 'Refusée';
    return status;
  }

  soumettreDemande() {
    if (this.nouvelleDemande.typePointageId === 'HALFDAY' || this.nouvelleDemande.typePointageId === 'AUTORISATION') {
      if (!this.nouvelleDemande.dateDebut) {
        this.snackBar.open('Veuillez remplir la date', 'Fermer', { duration: 3000 });
        return;
      }
      this.nouvelleDemande.dateFin = this.nouvelleDemande.dateDebut; // Same date for single day
    } else {
      if (!this.nouvelleDemande.dateDebut || !this.nouvelleDemande.dateFin) {
        this.snackBar.open('Veuillez remplir les dates', 'Fermer', { duration: 3000 });
        return;
      }
    }

    this.loading = true;
    const uid = this.api.getCurrentUserId();
    const sid = this.api.getCurrentSocieteId();
    
    let finalMotif = this.nouvelleDemande.motif;
    if (this.nouvelleDemande.typePointageId === 'HALFDAY') {
      finalMotif = `[Demi-journée : ${this.nouvelleDemande.periode}] ` + finalMotif;
    } else if (this.nouvelleDemande.typePointageId === 'AUTORISATION') {
      finalMotif = `[Autorisation : ${this.nouvelleDemande.heures}h] ` + finalMotif;
    }
    
    const dto = {
      utilisateurId: uid,
      societeId: sid,
      typePointageId: this.nouvelleDemande.typePointageId,
      dateDebut: this.nouvelleDemande.dateDebut,
      dateFin: this.nouvelleDemande.dateFin,
      status: 'En attente',
      motif: finalMotif
    };

    this.api.createDemandeCongeReal(dto).subscribe({
      next: (res: any) => {
        const demandeId = res?.id;
        this.lastDemandeId = demandeId;

        // If sick leave and a file is selected, upload it right after
        if (this.nouvelleDemande.typePointageId === 'MALADIE' && this.justificatifFile && demandeId) {
          this.api.uploadJustificatif(demandeId, this.justificatifFile).subscribe({
            next: () => {
              this.snackBar.open('Demande envoyée avec justificatif ✓', 'Fermer', { duration: 4000 });
            },
            error: () => {
              this.snackBar.open('Demande envoyée, échec upload justificatif', 'Fermer', { duration: 4000 });
            }
          });
        } else {
          this.snackBar.open('Votre demande a été envoyée au service RH 📎', 'Fermer', { duration: 4000 });
        }

        this.nouvelleDemande = { typePointageId: 'NORMAL', dateDebut: null, dateFin: null, motif: '', periode: 'Matin', heures: 2 };
        this.justificatifFile = null;
        this.loadData();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi de la demande', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.justificatifFile = input.files[0];
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.justificatifFile = file;
  }
}
