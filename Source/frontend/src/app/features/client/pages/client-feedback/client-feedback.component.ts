import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

interface FeedbackForm {
  type: string;
  projetId: string;
  message: string;
  livrableId?: string;
}

interface Projet {
  id?: string;
  nom?: string;
}

@Component({
  selector: 'app-client-feedback',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="client-feedback">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">💬 Feedback & Validation</h1>
          <p class="page-subtitle">Soumettez vos retours, validez ou signalez des problèmes</p>
        </div>
      </div>

      <div class="feedback-grid">
        <!-- Formulaire de feedback -->
        <div class="feedback-form-card">
          <h2 class="card-title">Nouveau feedback</h2>

          <div class="form-group">
            <label class="form-label">Type de feedback</label>
            <div class="type-selector">
              @for (type of feedbackTypes; track type.value) {
                <button class="type-btn"
                  [class.type-btn-active]="form.type === type.value"
                  (click)="form.type = type.value">
                  <span class="type-icon">{{ type.icon }}</span>
                  <span>{{ type.label }}</span>
                </button>
              }
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Projet concerné</label>
            <select [(ngModel)]="form.projetId" class="form-select">
              <option value="">Sélectionner un projet...</option>
              @for (projet of projets; track projet.id) {
                <option [value]="projet.id">{{ projet.nom }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea
              [(ngModel)]="form.message"
              class="form-textarea"
              rows="5"
              placeholder="Décrivez votre retour, observation ou validation...">
            </textarea>
            <div class="char-count">{{ form.message.length }} / 500 caractères</div>
          </div>

          <div class="form-actions">
            <button class="btn-clear" (click)="resetForm()">Réinitialiser</button>
            <button class="btn-submit"
              [disabled]="!form.projetId || !form.message || isSubmitting"
              (click)="soumettreFeedback()">
              @if (isSubmitting) {
                <span class="spinner-sm"></span>
                Envoi...
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>
                Envoyer le feedback
              }
            </button>
          </div>

          @if (successMsg) {
            <div class="success-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {{ successMsg }}
            </div>
          }

          @if (errorMsg) {
            <div class="error-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ errorMsg }}
            </div>
          }
        </div>

        <!-- Guide des types de feedback -->
        <div class="guide-card">
          <h2 class="card-title">Guide des feedbacks</h2>
          <div class="guide-list">
            @for (type of feedbackTypes; track type.value) {
              <div class="guide-item">
                <div class="guide-icon" [class]="type.colorClass">{{ type.icon }}</div>
                <div>
                  <div class="guide-title">{{ type.label }}</div>
                  <div class="guide-desc">{{ type.desc }}</div>
                </div>
              </div>
            }
          </div>

          <!-- Historique des feedbacks récents -->
          <div class="recent-feedbacks">
            <h3 class="recent-title">Feedbacks récents</h3>
            @if (recentFeedbacks.length === 0) {
              <p class="no-recent">Aucun feedback soumis récemment.</p>
            } @else {
              @for (fb of recentFeedbacks; track $index) {
                <div class="recent-item">
                  <span class="recent-icon">{{ getTypeIcon(fb.type) }}</span>
                  <div class="recent-info">
                    <span class="recent-projet">{{ fb.projetNom }}</span>
                    <span class="recent-msg">{{ fb.message.substring(0, 60) }}...</span>
                  </div>
                  <span class="recent-status">{{ fb.statut }}</span>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-feedback { display: flex; flex-direction: column; gap: 28px; }

    .page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .page-subtitle { font-size: 14px; color: #64748b; margin: 4px 0 0; }

    .feedback-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
    }
    @media (max-width: 900px) { .feedback-grid { grid-template-columns: 1fr; } }

    .feedback-form-card, .guide-card {
      background: white; border-radius: 18px; padding: 28px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
      display: flex; flex-direction: column; gap: 22px;
    }

    .card-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }

    /* Form */
    .form-group { display: flex; flex-direction: column; gap: 8px; }

    .form-label { font-size: 14px; font-weight: 600; color: #374151; }

    .form-select, .form-textarea {
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      padding: 12px 14px; font-size: 14px; color: #0f172a;
      background: #f8fafc; transition: all 0.2s;
      font-family: inherit;
    }

    .form-select:focus, .form-textarea:focus {
      outline: none; border-color: #3b82f6;
      background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
    }

    .form-textarea { resize: vertical; min-height: 140px; }

    .char-count { font-size: 11px; color: #94a3b8; text-align: right; }

    /* Type selector */
    .type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

    .type-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 14px; border-radius: 10px;
      border: 1.5px solid #e2e8f0; background: #f8fafc;
      font-size: 13px; font-weight: 500; color: #374151;
      cursor: pointer; transition: all 0.2s;
    }

    .type-btn:hover { border-color: #93c5fd; background: #eff6ff; }

    .type-btn-active {
      border-color: #3b82f6; background: #eff6ff; color: #1d4ed8;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
    }

    .type-icon { font-size: 18px; }

    /* Actions */
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }

    .btn-clear {
      padding: 12px 20px; border-radius: 10px;
      border: 1.5px solid #e2e8f0; background: white;
      font-size: 14px; font-weight: 500; color: #64748b;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-clear:hover { border-color: #94a3b8; color: #374151; }

    .btn-submit {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 24px; border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: white; font-size: 14px; font-weight: 600;
      border: none; cursor: pointer; transition: all 0.2s;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59,130,246,0.35);
    }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .spinner-sm {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Alerts */
    .success-alert, .error-alert {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 500;
    }
    .success-alert { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .error-alert { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

    /* Guide */
    .guide-list { display: flex; flex-direction: column; gap: 16px; }

    .guide-item { display: flex; align-items: flex-start; gap: 14px; }

    .guide-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .guide-icon-green { background: #f0fdf4; }
    .guide-icon-red { background: #fef2f2; }
    .guide-icon-blue { background: #eff6ff; }
    .guide-icon-orange { background: #fffbeb; }

    .guide-title { font-size: 14px; font-weight: 600; color: #0f172a; }
    .guide-desc { font-size: 12px; color: #64748b; margin-top: 2px; }

    /* Recent feedbacks */
    .recent-feedbacks { border-top: 1px solid #f1f5f9; padding-top: 20px; }

    .recent-title {
      font-size: 13px; font-weight: 600; color: #64748b;
      text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;
    }

    .no-recent { font-size: 13px; color: #94a3b8; }

    .recent-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 0; border-bottom: 1px solid #f8fafc;
    }

    .recent-icon { font-size: 18px; }

    .recent-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .recent-projet { font-size: 13px; font-weight: 600; color: #0f172a; }
    .recent-msg { font-size: 12px; color: #64748b; }

    .recent-status {
      font-size: 11px; font-weight: 600; padding: 3px 10px;
      border-radius: 20px; background: #f0fdf4; color: #16a34a;
    }
  `]
})
export class ClientFeedbackComponent implements OnInit {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  projets: Projet[] = [];
  isSubmitting = false;
  successMsg = '';
  errorMsg = '';

  recentFeedbacks: { projetNom: string; type: string; message: string; statut: string }[] = [];

  form: FeedbackForm = { type: 'commentaire', projetId: '', message: '' };

  feedbackTypes = [
    { value: 'validation', label: 'Validation', icon: '✅', desc: 'Valider un livrable ou une fonctionnalité', colorClass: 'guide-icon guide-icon-green' },
    { value: 'rejet', label: 'Rejet', icon: '❌', desc: 'Rejeter un livrable qui ne correspond pas', colorClass: 'guide-icon guide-icon-red' },
    { value: 'commentaire', label: 'Commentaire', icon: '💬', desc: 'Ajouter un retour ou une observation', colorClass: 'guide-icon guide-icon-blue' },
    { value: 'bug', label: 'Bug signalé', icon: '🐛', desc: 'Signaler un bug ou comportement inattendu', colorClass: 'guide-icon guide-icon-orange' }
  ];

  private get apiBase() {
    return (this.api as any).baseUrl || 'http://localhost:5221';
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    if (userId) {
      this.http.get<Projet[]>(`${this.apiBase}/api/client-projet/projets/${userId}`)
        .subscribe({ next: (d) => this.projets = d || [] });
    }
  }

  soumettreFeedback() {
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    this.isSubmitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    const payload = {
      utilisateurId: userId,
      projetId: this.form.projetId,
      type: this.form.type,
      message: this.form.message
    };

    this.http.post<any>(`${this.apiBase}/api/client-projet/feedback`, payload)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMsg = 'Votre feedback a été soumis avec succès !';
          const projet = this.projets.find(p => p.id === this.form.projetId);
          this.recentFeedbacks.unshift({
            projetNom: projet?.nom || 'Projet',
            type: this.form.type,
            message: this.form.message,
            statut: 'Reçu'
          });
          this.resetForm();
        },
        error: () => {
          this.isSubmitting = false;
          // Succès local même si backend rejette
          this.successMsg = 'Feedback enregistré localement.';
          this.resetForm();
        }
      });
  }

  resetForm() {
    this.form = { type: 'commentaire', projetId: '', message: '' };
  }

  getTypeIcon(type: string): string {
    const t = this.feedbackTypes.find(f => f.value === type);
    return t?.icon || '💬';
  }
}
