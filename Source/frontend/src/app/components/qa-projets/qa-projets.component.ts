import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-qa-projets',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Projets Assignés</h1>
        <p>Accédez rapidement à vos projets</p>
      </div>

      <div class="projets-grid">
        @for (projet of projets; track projet.id) {
          <mat-card class="projet-card">
            <mat-icon>folder</mat-icon>
            <h3>{{projet.nom}}</h3>
            <p>{{projet.description}}</p>
            <div class="projet-stats">
              <span>{{projet.tests}} tests</span>
              <span>{{projet.bugs}} bugs</span>
            </div>
            <div class="projet-actions">
              <button mat-button color="primary" routerLink="/qa/tests">
                <mat-icon>assignment</mat-icon> Tests
              </button>
              <button mat-button color="primary" routerLink="/qa/bugs">
                <mat-icon>bug_report</mat-icon> Bugs
              </button>
            </div>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .page-header p { font-size: 14px; color: #666; margin: 4px 0 0; }

    .projets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .projet-card { padding: 24px; border-radius: 12px; text-align: center; }
    .projet-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #2196f3; }
    .projet-card h3 { margin: 12px 0 8px; }
    .projet-card p { font-size: 13px; color: #666; margin: 0 0 16px; }
    .projet-stats { display: flex; gap: 20px; justify-content: center; font-size: 13px; color: #888; margin-bottom: 16px; }
    .projet-actions { display: flex; gap: 12px; justify-content: center; }
  `]
})
export class QaProjetsComponent implements OnInit {
  projets: any[] = [];

  ngOnInit() {}
}
