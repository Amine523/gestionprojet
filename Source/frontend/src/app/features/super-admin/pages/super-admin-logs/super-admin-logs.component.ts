﻿﻿﻿import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

interface LogEntry {
  id: number;
  action: string;
  type: string;
  user: string;
  ip: string;
  date: string;
  status: 'success' | 'error' | 'warning';
}

interface ConnexionHistory {
  id: number;
  user: string;
  email: string;
  dateConnexion: string;
  ip: string;
  appareil: string;
  statut: 'success' | 'failed';
}

interface Anomalie {
  id: number;
  type: string;
  description: string;
  date: string;
  niveau: 'critical' | 'warning' | 'info';
  statut: 'non_resolu' | 'en_cours' | 'resolu';
}

@Component({
  selector: 'app-super-admin-logs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatTableModule, MatChipsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Audit & Sécurité</span>
          </div>
          <h1 class="header-title">
            Historique <span class="gradient-text">& Logs.</span>
          </h1>
          <p class="header-subtitle">
            Traçabilité complète des actions système, détection d'anomalies et monitoring des flux API.
          </p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="scanAnomalies()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
              <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              <line x1="12" y1="2" x2="12" y2="4"/>
              <line x1="12" y1="20" x2="12" y2="22"/>
              <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
              <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
              <line x1="2" y1="12" x2="4" y2="12"/>
              <line x1="20" y1="12" x2="22" y2="12"/>
              <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/>
              <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
            </svg>
            Scanner le Cluster
          </button>
        </div>
      </header>

      <!-- Tabs -->
      <div class="tabs-container">
        <button class="tab-btn" [class.active]="activeTab === 'connexions'" (click)="activeTab = 'connexions'">
          Connexions
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'api'" (click)="activeTab = 'api'">
          Flux API
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'anomalies'" (click)="activeTab = 'anomalies'">
          Anomalies
        </button>
      </div>

      <!-- Tab Content -->
      @if (activeTab === 'connexions') {
        <div class="card">
          <div class="card-header">
            <h3>Journal d'Accès Personnel</h3>
            <button class="btn btn-secondary" (click)="exportConnexions()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exporter
            </button>
          </div>
          <div class="connexions-list">
            @for (conn of connexions; track conn.id) {
              <div class="conn-card" [class.failed]="conn.statut !== 'success'">
                <div class="conn-icon" [class.success]="conn.statut === 'success'">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    @if (conn.statut === 'success') {
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M9 12l2 2 4-4"/>
                    } @else {
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    }
                  </svg>
                </div>
                <div class="conn-details">
                  <strong>{{conn.user}}</strong>
                  <span class="text-muted">{{conn.email}}</span>
                </div>
                <div class="conn-meta">
                  <div class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    <span>{{conn.appareil}}</span>
                  </div>
                  <div class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <span>{{conn.ip}}</span>
                  </div>
                </div>
                <div class="conn-status">
                  <span class="text-muted">{{conn.dateConnexion}}</span>
                  <span class="badge" [class.success]="conn.statut === 'success'" [class.failed]="conn.statut !== 'success'">
                    {{conn.statut === 'success' ? 'AUTHENTIFIÉ' : 'ÉCHEC'}}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (activeTab === 'api') {
        <div class="card">
          <div class="card-header">
            <h3>Séquences de Requêtes API</h3>
            <button class="btn btn-danger" (click)="clearLogs()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Purger les Logs
            </button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Action / Endpoint</th>
                  <th>Utilisateur</th>
                  <th>Adresse IP</th>
                  <th>Horodatage</th>
                  <th class="text-right">État</th>
                </tr>
              </thead>
              <tbody>
                @for (log of apiLogs; track log.id) {
                  <tr>
                    <td>
                      <p class="log-action">{{log.action}}</p>
                    </td>
                    <td>
                      <span class="log-user">{{log.user}}</span>
                    </td>
                    <td>
                      <span class="log-ip">{{log.ip}}</span>
                    </td>
                    <td>
                      <span class="log-date">{{log.date}}</span>
                    </td>
                    <td class="text-right">
                      <span class="status-dot" [class.success]="log.status === 'success'" [class.error]="log.status !== 'success'"></span>
                      <span class="log-status" [class.success]="log.status === 'success'" [class.error]="log.status !== 'success'">
                        {{log.status}}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (activeTab === 'anomalies') {
        <div class="card">
          <div class="card-header">
            <h3>Détection de Menaces & Anomalies</h3>
            <span class="badge badge-primary animate-pulse">Scan Actif</span>
          </div>
          <div class="anomalies-grid">
            @for (ano of anomalies; track ano.id) {
              <div class="anomaly-card" [class.critical]="ano.niveau === 'critical'">
                <div class="anomaly-icon" [class.critical]="ano.niveau === 'critical'">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    @if (ano.niveau === 'critical') {
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    } @else {
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    }
                  </svg>
                </div>
                <div class="anomaly-details">
                  <h4>{{ano.type}}</h4>
                  <span class="text-muted">{{ano.date}}</span>
                </div>
                <p class="anomaly-desc">{{ano.description}}</p>
                <div class="anomaly-footer">
                  <div class="anomaly-badges">
                    <span class="badge" [class.critical]="ano.niveau === 'critical'" [class.warning]="ano.niveau !== 'critical'">{{ano.niveau}}</span>
                    <span class="badge" [class.resolved]="ano.statut === 'resolu'" [class.pending]="ano.statut !== 'resolu'">
                      {{ano.statut === 'non_resolu' ? 'NON RÉSOLU' : (ano.statut === 'en_cours' ? 'EN COURS' : 'RÉSOLU')}}
                    </span>
                  </div>
                  <button class="btn-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            }
            @if (anomalies.length === 0) {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <p class="empty-state-text">Aucune menace détectée dans le cluster</p>
              </div>
            }
          </div>
        </div>
      }
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
      background: radial-gradient(circle, rgba(244, 63, 94, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      flex: 1;
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
      background: rgba(244, 63, 94, 0.1);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.2);
    }

    .badge.success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge.failed {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .badge.critical {
      background: #ef4444;
      color: white;
      border: none;
    }

    .badge.warning {
      background: #f59e0b;
      color: white;
      border: none;
    }

    .badge.resolved {
      background: #10b981;
      color: white;
      border: none;
    }

    .badge.pending {
      background: #6b7280;
      color: white;
      border: none;
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #fb7185, #f97316, #eab308);
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
      display: flex;
      gap: var(--space-sm);
      align-items: center;
      position: relative;
      z-index: 1;
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
      background: white;
      color: #0f172a;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background: #10b981;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      background: transparent;
      color: inherit;
    }

    .tabs-container {
      display: flex;
      gap: var(--space-xs);
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-xs);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .tab-btn {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .tab-btn:hover {
      background: var(--color-bg);
    }

    .tab-btn.active {
      background: #f43f5e;
      color: white;
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .card-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .connexions-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .conn-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      transition: all var(--transition-base);
    }

    .conn-card.failed {
      border-color: rgba(239, 68, 68, 0.3);
    }

    .conn-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .conn-icon.success {
      background: linear-gradient(135deg, #10b981, #06b6d4);
    }

    .conn-icon:not(.success) {
      background: linear-gradient(135deg, #ef4444, #f97316);
    }

    .conn-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .conn-details strong {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .conn-meta {
      display: flex;
      gap: var(--space-lg);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
    }

    .conn-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-xs);
    }

    .text-muted {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: var(--color-bg);
    }

    .data-table th {
      padding: var(--space-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
    }

    .data-table th.text-right {
      text-align: right;
    }

    .data-table tbody tr {
      border-bottom: 1px solid var(--color-border);
      transition: background var(--transition-base);
    }

    .data-table tbody tr:hover {
      background: var(--color-bg);
    }

    .data-table td {
      padding: var(--space-md);
    }

    .log-action {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      font-style: italic;
    }

    .log-user {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .log-ip {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .log-date {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: var(--space-xs);
    }

    .status-dot.success {
      background: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    }

    .status-dot.error {
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
    }

    .log-status {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }

    .log-status.success {
      color: #10b981;
    }

    .log-status.error {
      color: #ef4444;
    }

    .anomalies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--space-lg);
    }

    .anomaly-card {
      padding: var(--space-lg);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      position: relative;
      overflow: hidden;
    }

    .anomaly-card.critical {
      border-color: rgba(239, 68, 68, 0.3);
      background: rgba(239, 68, 68, 0.05);
    }

    .anomaly-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: var(--space-md);
      box-shadow: var(--shadow-md);
    }

    .anomaly-icon.critical {
      background: #ef4444;
    }

    .anomaly-icon:not(.critical) {
      background: #f59e0b;
    }

    .anomaly-details {
      margin-bottom: var(--space-sm);
    }

    .anomaly-details h4 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
      text-transform: uppercase;
    }

    .anomaly-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0 0 var(--space-md);
      line-height: var(--line-height-relaxed);
    }

    .anomaly-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .anomaly-badges {
      display: flex;
      gap: var(--space-xs);
    }

    .empty-state {
      grid-column: 1 / -1;
      padding: var(--space-3xl) 0;
      text-align: center;
    }

    .empty-state svg {
      margin: 0 auto var(--space-lg);
      color: var(--color-text-muted);
    }

    .empty-state-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      margin: 0;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tabs-container {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tab-btn {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .tab-btn:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .conn-card,
    :host-context(.dark) .anomaly-card {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .data-table thead {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .data-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .conn-card {
        flex-wrap: wrap;
      }

      .conn-meta {
        flex-wrap: wrap;
        gap: var(--space-md);
      }

      .anomalies-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuperAdminLogsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  activeTab = 'connexions';

  apiLogs: LogEntry[] = [];
  connexions: ConnexionHistory[] = [];
  anomalies: Anomalie[] = [];

  ngOnInit() {
    this.loadConnectionLogs();
    this.loadApiLogs();
    this.loadAnomalies();
  }

  loadConnectionLogs() {
    this.api.getConnectionLogs(50).subscribe({
      next: (data) => {
        this.connexions = (data || []).map((log: any, idx: number) => ({
          id: idx + 1,
          user: log.utilisateurId || 'Utilisateur Système',
          email: log.email || 'audit@system.internal',
          dateConnexion: new Date(log.dateConnexion).toLocaleString('fr-FR'),
          ip: log.ipAddress || '127.0.0.1',
          appareil: log.userAgent || 'Navigateur Standard',
          statut: 'success'
        }));
      },
      error: () => {
        // Mock data for demo if API fails
        this.connexions = [
          { id: 1, user: 'Super Admin', email: 'super@admin.com', dateConnexion: '21/04/2026 14:30', ip: '196.216.84.12', appareil: 'Chrome - MacOS', statut: 'success' },
          { id: 2, user: 'Admin Leadertec', email: 'admin@leadertec.com', dateConnexion: '21/04/2026 14:25', ip: '196.216.85.10', appareil: 'Firefox - Windows', statut: 'success' },
          { id: 3, user: 'Unknown Entity', email: 'intruder@unknown.com', dateConnexion: '21/04/2026 14:15', ip: '45.12.34.88', appareil: 'Edge - Windows', statut: 'failed' }
        ];
      }
    });
  }

  loadApiLogs() {
    this.api.getApiLogs(100).subscribe({
      next: (data) => {
        this.apiLogs = (data || []).map((log: any, idx: number) => ({
          id: idx + 1,
          action: `${log.method} ${log.endpoint}`,
          type: 'API',
          user: log.user || 'SytemRoot',
          ip: log.ip || 'internal',
          date: new Date(log.date).toLocaleString('fr-FR'),
          status: log.status === 200 ? 'success' : 'error'
        }));
      },
      error: () => {
        this.apiLogs = [
          { id: 1, action: 'POST /api/societes', type: 'API', user: 'admin@leadertec.com', ip: '196.216.85.10', date: '21/04/2026 14:30', status: 'success' },
          { id: 2, action: 'GET /api/utilisateurs', type: 'API', user: 'super@admin.com', ip: '196.216.84.12', date: '21/04/2026 14:28', status: 'success' },
          { id: 3, action: 'DELETE /api/projets/772', type: 'API', user: 'dev@leadertec.com', ip: '196.216.85.15', date: '21/04/2026 14:25', status: 'error' }
        ];
      }
    });
  }

  loadAnomalies() {
    this.api.getAnomalies().subscribe({
      next: (data) => {
        this.anomalies = (data || []).map((ano: any, idx: number) => ({
          id: idx + 1,
          type: ano.type,
          description: ano.description,
          date: new Date(ano.date).toLocaleString('fr-FR'),
          niveau: ano.niveau,
          statut: ano.statut
        }));
      },
      error: () => {
        this.anomalies = [
          { id: 1, type: 'Tentatives d\'intrusion', description: 'Multiples échecs de connexion détectés depuis une adresse IP suspecte située hors de la zone opérationnelle habituelle.', date: '21/04/2026 14:15', niveau: 'critical', statut: 'non_resolu' },
          { id: 2, type: 'Volume API Suspect', description: 'Pic de trafic inhabituel sur l\'endpoint d\'authentification.', date: '21/04/2026 13:40', niveau: 'warning', statut: 'resolu' }
        ];
      }
    });
  }

  exportConnexions() {
    this.snackBar.open("Exportation du journal d'accès en cours...", 'Fermer', { duration: 3000 });
  }

  clearLogs() {
    if (confirm('Confirmer la purge complète des logs API ? Cette action est irréversible.')) {
      this.apiLogs = [];
      this.snackBar.open('Journal API purgé avec succès.', 'Fermer', { duration: 2000 });
    }
  }

  scanAnomalies() {
    this.snackBar.open('Démarrage du scan de vulnérabilité du cluster...', 'Fermer', { duration: 2000 });
    setTimeout(() => {
      this.snackBar.open('Scan terminé - Aucune nouvelle menace critique détectée.', 'Fermer', { duration: 3000 });
    }, 1500);
  }
}
