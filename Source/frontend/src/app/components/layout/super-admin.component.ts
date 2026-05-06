import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  bg: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule],
  template: `
    <div class="dashboard">
      <div class="header">
        <div class="header-left">
          <h1>Dashboard Super Admin</h1>
          <p>Vue d'ensemble de la plateforme</p>
        </div>
        <div class="header-right">
          <button mat-stroked-button>
            <mat-icon>download</mat-icon>Exporter
          </button>
          <button mat-flat-button color="primary">
            <mat-icon>add</mat-icon>Nouvelle Société
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <mat-card *ngFor="let stat of stats" class="stat-card">
          <div class="stat-icon" [style.background]="stat.bg">
            <mat-icon>{{stat.icon}}</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{stat.value}}</span>
            <span class="stat-label">{{stat.title}}</span>
          </div>
        </mat-card>
      </div>

      <div class="main-grid">
        <mat-card class="activity-card">
          <div class="card-header">
            <h3>Activité Récente</h3>
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item>Voir tout</button>
            </mat-menu>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let item of activities">
              <div class="activity-icon" [ngClass]="item.type">
                <mat-icon>{{item.icon}}</mat-icon>
              </div>
              <div class="activity-content">
                <span class="activity-title">{{item.title}}</span>
                <span class="activity-meta">{{item.user}} • {{item.time}}</span>
              </div>
            </div>
          </div>
        </mat-card>

        <mat-card class="chart-card">
          <div class="card-header">
            <h3>Répartition</h3>
          </div>
          <div class="chart-content">
            <div class="chart-item" *ngFor="let item of chartData">
              <div class="chart-label">{{item.label}}</div>
              <div class="chart-bar">
                <div class="chart-fill" [style.width.%]="item.percent" [style.background]="item.color"></div>
              </div>
              <div class="chart-value">{{item.value}}</div>
            </div>
          </div>
        </mat-card>
      </div>

      <mat-card class="table-card">
        <div class="card-header">
          <h3>Dernières Sociétés</h3>
          <button mat-stroked-button routerLink="/superadmin/societes">
            Voir tout
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
        <table mat-table [dataSource]="societes">
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Société</th>
            <td mat-cell *matCellDef="let s">{{s.nom}}</td>
          </ng-container>
          <ng-container matColumnDef="adresse">
            <th mat-header-cell *matHeaderCellDef>Adresse</th>
            <td mat-cell *matCellDef="let s">{{s.adresse}}</td>
          </ng-container>
          <ng-container matColumnDef="telephone">
            <th mat-header-cell *matHeaderCellDef>Téléphone</th>
            <td mat-cell *matCellDef="let s">{{s.telephoneContact}}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let s">
              <mat-chip [ngClass]="s.actif ? 'active' : 'inactive'">
                {{s.actif ? 'Actif' : 'Inactif'}}
              </mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let s">
              <button mat-icon-button [matMenuTriggerFor]="actionMenu" matTooltip="Actions">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #actionMenu="matMenu">
                <button mat-menu-item routerLink="/superadmin/societes"><mat-icon>visibility</mat-icon>Voir</button>
                <button mat-menu-item><mat-icon>edit</mat-icon>Modifier</button>
                <button mat-menu-item><mat-icon>delete</mat-icon>Supprimer</button>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard { padding: 24px; }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .header h1 { font-size: 28px; font-weight: 600; color: #1a1a2e; margin: 0; }
    .header p { font-size: 14px; color: #666; margin: 4px 0 0; }
    .header-right { display: flex; gap: 12px; }
    .header-right button mat-flat-button { background: #d32f2f; color: #fff; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon mat-icon { font-size: 26px; width: 26px; height: 26px; color: #fff; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 26px; font-weight: 700; color: #1a1a2e; }
    .stat-label { font-size: 13px; color: #666; }

    .main-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .activity-card, .chart-card, .table-card {
      padding: 20px;
      border-radius: 12px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .card-header h3 { font-size: 16px; font-weight: 600; color: #1a1a2e; margin: 0; }
    .card-header button mat-icon { font-size: 20px; }

    .activity-list { display: flex; flex-direction: column; gap: 12px; }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
    }
    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .activity-icon.user { background: #e3f2fd; }
    .activity-icon.societe { background: #fce4ec; }
    .activity-icon.projet { background: #e8f5e9; }
    .activity-icon.conge { background: #fff3e0; }
    .activity-icon mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .activity-icon.user mat-icon { color: #1976d2; }
    .activity-icon.societe mat-icon { color: #c2185b; }
    .activity-icon.projet mat-icon { color: #388e3c; }
    .activity-icon.conge mat-icon { color: #f57c00; }

    .activity-content { display: flex; flex-direction: column; }
    .activity-title { font-size: 14px; color: #333; }
    .activity-meta { font-size: 12px; color: #888; }

    .chart-content { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }
    .chart-item { display: flex; align-items: center; gap: 12px; }
    .chart-label { width: 90px; font-size: 13px; color: #666; }
    .chart-bar { flex: 1; height: 10px; background: #eee; border-radius: 5px; overflow: hidden; }
    .chart-fill { height: 100%; border-radius: 5px; transition: width 0.5s; }
    .chart-value { width: 30px; text-align: right; font-size: 14px; font-weight: 500; }

    table { width: 100%; }
    th.mat-header-cell { font-weight: 600; color: #666; font-size: 13px; padding: 12px; }
    td.mat-cell { font-size: 14px; padding: 12px; }

    mat-chip { font-size: 11px; }
    mat-chip.active { background: #e8f5e9; color: #2e7d32; }
    mat-chip.inactive { background: #ffebee; color: #c62828; }

    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .main-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .dashboard { padding: 16px; }
      .header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .header-right { width: 100%; }
      .header-right button { flex: 1; }
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SuperAdminDashboardComponent implements OnInit {
  private api = inject(ApiService);

  stats: StatCard[] = [
    { title: 'Sociétés', value: 16, icon: 'apartment', color: '#fff', bg: 'linear-gradient(135deg, #d32f2f, #b71c1c)' },
    { title: 'Utilisateurs', value: 248, icon: 'supervisor_account', color: '#fff', bg: 'linear-gradient(135deg, #1976d2, #1565c0)' },
    { title: 'Projets', value: 45, icon: 'assignment', color: '#fff', bg: 'linear-gradient(135deg, #4caf50, #388e3c)' },
    { title: 'Abonnements', value: 12, icon: 'subscriptions', color: '#fff', bg: 'linear-gradient(135deg, #ff9800, #f57c00)' }
  ];

  activities = [
    { type: 'societe', icon: 'business', title: 'Nouvelle société "TechCorp"', user: 'SuperAdmin', time: 'Il y a 2h' },
    { type: 'user', icon: 'person_add', title: 'Nouvel utilisateur ajouté', user: 'Admin', time: 'Il y a 4h' },
    { type: 'projet', icon: 'folder_open', title: 'Projet "Site Web" démarré', user: 'Chef', time: 'Hier' },
    { type: 'conge', icon: 'event_busy', title: 'Demande de congé approuvée', user: 'RH', time: 'Hier' }
  ];

  chartData = [
    { label: 'Sociétés', value: '16', percent: 80, color: '#d32f2f' },
    { label: 'Utilisateurs', value: '248', percent: 60, color: '#1976d2' },
    { label: 'Projets', value: '45', percent: 45, color: '#4caf50' },
    { label: 'Inactifs', value: '8', percent: 20, color: '#9e9e9e' }
  ];

  societes: any[] = [];
  displayedColumns = ['nom', 'adresse', 'telephone', 'status', 'actions'];

  ngOnInit() {
    this.api.getSocietes().subscribe({
      next: (data: any) => { this.societes = (data || []).slice(0, 5); },
      error: () => { this.societes = []; }
    });
  }
}
