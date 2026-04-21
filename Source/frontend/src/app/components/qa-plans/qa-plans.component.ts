import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qa-plans',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatSnackBarModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Plans de Test</h1>
          <p>Gérez vos plans de test - {{societeNom}}</p>
        </div>
        <button mat-flat-button class="add-btn">
          <mat-icon>add</mat-icon> Nouveau plan
        </button>
      </div>

      <div class="plans-list">
        @for (plan of plans; track plan.id) {
          <mat-card class="plan-card">
            <div class="plan-header">
              <h3>{{plan.nom}}</h3>
              <mat-chip>{{plan.projet}}</mat-chip>
            </div>
            <p class="plan-desc">{{plan.description}}</p>
            <div class="plan-stats">
              <span><mat-icon>assignment</mat-icon> {{plan.tests}} tests</span>
              <span><mat-icon>check_circle</mat-icon> {{plan.reussis}} réussit</span>
              <span><mat-icon>cancel</mat-icon> {{plan.echecs}} échecs</span>
            </div>
            <div class="plan-actions">
              <button mat-button color="primary">
                <mat-icon>visibility</mat-icon> Détails
              </button>
              <button mat-button color="primary">
                <mat-icon>edit</mat-icon> Modifier
              </button>
            </div>
          </mat-card>
        } @empty {
          <p class="no-plans">Aucun plan de test pour cette société</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .add-btn { background: #2196f3; color: white; }

    .plans-list { display: flex; flex-direction: column; gap: 16px; }
    .plan-card { padding: 24px; border-radius: 12px; }
    .plan-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .plan-header h3 { margin: 0; font-size: 18px; }
    .plan-desc { font-size: 13px; color: #666; margin: 0 0 16px; }
    .plan-stats { display: flex; gap: 20px; font-size: 13px; color: #888; margin-bottom: 16px; }
    .plan-stats span { display: flex; align-items: center; gap: 6px; }
    .plan-actions { display: flex; gap: 8px; border-top: 1px solid #eee; padding-top: 12px; }
  `]
})
export class QaPlansComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);

  societeId = '';
  societeNom = '';

  plans: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPlans();
  }

  loadPlans() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const storedPlans = data.qaPlans?.[this.societeId] || [];
    if (storedPlans.length > 0) {
      this.plans = storedPlans;
    }
  }
}
