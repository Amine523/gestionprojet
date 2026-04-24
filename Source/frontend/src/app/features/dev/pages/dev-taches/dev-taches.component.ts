import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dev-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Mes Engagements</h1>
          <p class="header-subtitle">{{societeNom}} • Excellence technique et livraison continue</p>
        </div>
        <div class="header-actions">
          <button class="btn" [class.btn-primary]="viewMode === 'kanban'" [class.btn-secondary]="viewMode !== 'kanban'" (click)="viewMode = 'kanban'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            Kanban
          </button>
          <button class="btn" [class.btn-primary]="viewMode === 'list'" [class.btn-secondary]="viewMode !== 'list'" (click)="viewMode = 'list'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Liste
          </button>
        </div>
      </div>

      @if (viewMode === 'kanban') {
        <div class="kanban-board">
          @for (column of columns; track column.id) {
            <div class="kanban-column">
              <div class="kanban-header">
                <span class="column-title">{{column.title}}</span>
                <span class="column-count">{{getColumnTasks(column.id).length}}</span>
              </div>
              
              <div cdkDropList [cdkDropListData]="getColumnTasks(column.id)" [id]="column.id" [cdkDropListConnectedTo]="connectedLists" (cdkDropListDropped)="drop($event)" class="kanban-list">
                @for (tache of getColumnTasks(column.id); track tache.id) {
                  <div class="task-card" cdkDrag [class.active]="activeTask?.id === tache.id" (click)="viewTache(tache)">
                    <div class="task-priority-bar" [class.priority-high]="tache.priorite.toLowerCase() === 'high'" [class.priority-medium]="tache.priorite.toLowerCase() === 'medium'" [class.priority-low]="tache.priorite.toLowerCase() === 'low'"></div>
                    <div class="task-content">
                      <h4 class="task-title">{{tache.titre}}</h4>
                      <div class="task-badges">
                        <span class="badge" [class.badge-high]="tache.priorite.toLowerCase() === 'high'" [class.badge-medium]="tache.priorite.toLowerCase() === 'medium'" [class.badge-low]="tache.priorite.toLowerCase() === 'low'">{{tache.priorite}}</span>
                        <span class="badge badge-secondary">{{tache.projet}}</span>
                      </div>
                      <div class="task-meta">
                        <div class="meta-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {{tache.tempsEstime}}h
                        </div>
                        <div class="meta-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {{tache.deadline}}
                        </div>
                      </div>
                      <div class="task-actions" (click)="$event.stopPropagation()">
                        @if (tache.statut === 'todo') {
                          <button class="btn-icon" (click)="startTask(tache)" title="Démarrer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                        }
                        @if (tache.statut === 'inprogress') {
                          <button class="btn-icon" (click)="pauseTask(tache)" title="Pause">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <rect x="6" y="4" width="4" height="16"></rect>
                              <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                          </button>
                          <button class="btn-icon" (click)="doneTask(tache)" title="Terminer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="card">
          <div class="card-header">
            <h3>Backlog & Liste des Tâches</h3>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Projet</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (tache of taches; track tache.id) {
                  <tr>
                    <td>
                      <strong>{{tache.titre}}</strong><br/>
                      <small class="text-muted">{{tache.description.substring(0, 60)}}...</small>
                    </td>
                    <td><span class="badge badge-secondary">{{tache.projet}}</span></td>
                    <td><span class="badge" [class.badge-high]="tache.priorite.toLowerCase() === 'high'" [class.badge-medium]="tache.priorite.toLowerCase() === 'medium'" [class.badge-low]="tache.priorite.toLowerCase() === 'low'">{{tache.priorite}}</span></td>
                    <td>
                      <span class="badge" [class.badge-secondary]="tache.statut === 'todo'" [class.badge-primary]="tache.statut === 'inprogress'" [class.badge-success]="tache.statut === 'done'">{{tache.statut || 'todo'}}</span>
                    </td>
                    <td>
                      <div class="text-muted">{{tache.deadline}}</div>
                    </td>
                    <td>
                      <button class="btn-icon" (click)="viewTache(tache)" title="Voir">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      @if (tache.statut === 'todo') {
                        <button class="btn-icon" (click)="startTask(tache)" title="Démarrer">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            @if (taches.length === 0) {
              <div class="empty-state">Aucune tâche dans le backlog.</div>
            }
          </div>
        </div>
      }

      @if (activeTask) {
        <div class="timer-bar">
          <div class="timer-dot"></div>
          <div class="timer-info">
            <span class="timer-label">Séquence de travail active</span>
            <span class="timer-task">{{activeTask.titre}}</span>
          </div>
          <div class="timer-value">{{formatTime(timerSeconds)}}</div>
          <button class="btn-icon btn-danger" (click)="stopTimer()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
        </div>
      }

      @if (viewingTache) {
        <div class="modal-overlay" (click)="viewingTache = null">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Explorateur de Tâche</h3>
              <button class="btn-close" (click)="viewingTache = null">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <h4 class="task-detail-title">{{viewingTache.titre}}</h4>
              <p class="task-detail-description">{{viewingTache.description}}</p>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="4 17 10 11 4 5"></polyline>
                      <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                    Artifacts de livraison (Git / PR)
                  </label>
                  <input type="text" [(ngModel)]="gitLink" class="form-input" placeholder="https://github.com/...">
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Notes d'implémentation
                  </label>
                  <textarea [(ngModel)]="techNotes" class="form-textarea" rows="3"></textarea>
                </div>
              </div>

              <label class="form-label">Journal de Tâche</label>
              <div class="comments-list">
                @for (comment of viewingTache.commentaires; track comment.id) {
                  <div class="comment-item">
                    <span class="comment-author">{{comment.auteur}}</span>
                    <div class="comment-text">{{comment.texte}}</div>
                    <span class="comment-time">{{comment.heure}}</span>
                  </div>
                }
              </div>
            </div>
            <div class="modal-footer">
              <div class="input-group">
                <input type="text" [(ngModel)]="newComment" class="form-input" placeholder="Ajouter une note...">
                <button class="btn btn-primary" (click)="addComment()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13"></polygon>
                    <polyline points="11 13 2 13 2 22"></polyline>
                  </svg>
                </button>
              </div>
              <button class="btn btn-primary" (click)="saveChanges()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Mettre à jour
              </button>
            </div>
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
      height: 100vh;
      overflow: hidden;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .header-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: var(--font-size-sm);
      margin: var(--space-xs) 0 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-sm);
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
      background: white;
      color: #6366f1;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .btn-icon.btn-danger:hover {
      color: #ef4444;
      border-color: #ef4444;
    }

    .kanban-board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
      flex: 1;
      overflow: hidden;
    }

    .kanban-column {
      background: var(--color-bg);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      overflow: hidden;
    }

    .kanban-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 var(--space-sm);
    }

    .column-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .column-count {
      width: 24px;
      height: 24px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #6366f1;
      background: white;
    }

    .kanban-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .task-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all var(--transition-base);
      position: relative;
    }

    .task-card:hover {
      border-color: rgba(99, 102, 241, 0.5);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .task-card.active {
      border: 2px solid rgba(99, 102, 241, 0.2);
      box-shadow: var(--shadow-md);
    }

    .task-priority-bar {
      width: 4px;
      border-radius: var(--radius-sm) 0 0 var(--radius-sm);
    }

    .task-priority-bar.priority-high {
      background: #ef4444;
    }

    .task-priority-bar.priority-medium {
      background: #f59e0b;
    }

    .task-priority-bar.priority-low {
      background: #10b981;
    }

    .task-content {
      padding: var(--space-md);
      padding-left: calc(var(--space-md) - 4px);
    }

    .task-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-sm);
    }

    .task-badges {
      display: flex;
      gap: var(--space-xs);
      margin-bottom: var(--space-sm);
    }

    .badge {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }

    .badge-high {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge-medium {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-low {
      background: #d1fae5;
      color: #059669;
    }

    .badge-secondary {
      background: var(--color-surface);
      color: var(--color-text-muted);
    }

    .badge-primary {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-success {
      background: #d1fae5;
      color: #059669;
    }

    .task-meta {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-sm);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
    }

    .task-actions {
      display: flex;
      gap: var(--space-xs);
      justify-content: flex-end;
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      margin-bottom: var(--space-lg);
    }

    .card-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .table-container {
      flex: 1;
      overflow: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      text-align: left;
      padding: var(--space-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-md) var(--space-sm);
      border-bottom: 1px solid var(--color-border);
    }

    .data-table tr:hover {
      background: var(--color-bg);
    }

    .text-muted {
      color: var(--color-text-muted);
    }

    .empty-state {
      padding: var(--space-3xl);
      text-align: center;
      color: var(--color-text-muted);
    }

    .timer-bar {
      position: fixed;
      bottom: var(--space-xl);
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      padding: var(--space-md) var(--space-lg);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      z-index: 100;
    }

    .timer-dot {
      width: 12px;
      height: 12px;
      background: #6366f1;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .timer-info {
      flex: 1;
    }

    .timer-label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .timer-task {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .timer-value {
      font-family: monospace;
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: #6366f1;
      margin: 0 var(--space-lg);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-xl);
    }

    .modal-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-close:hover {
      background: var(--color-surface);
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--space-lg);
      overflow-y: auto;
      flex: 1;
    }

    .task-detail-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-sm);
    }

    .task-detail-description {
      color: var(--color-text-muted);
      margin: 0 0 var(--space-lg);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input,
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
    .form-textarea:focus {
      border-color: #6366f1;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .comment-item {
      background: var(--color-bg);
      border-radius: var(--radius-md);
      padding: var(--space-md);
      position: relative;
    }

    .comment-author {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #6366f1;
    }

    .comment-text {
      font-size: var(--font-size-sm);
      color: var(--color-text);
      margin: var(--space-xs) 0;
    }

    .comment-time {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .modal-footer {
      display: flex;
      gap: var(--space-md);
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .input-group {
      flex: 1;
      display: flex;
      gap: var(--space-xs);
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .kanban-column,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .task-card {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .task-content {
      color: var(--color-text);
    }

    :host-context(.dark) .task-title {
      color: var(--color-text);
    }

    :host-context(.dark) .timer-bar {
      background: rgba(30, 41, 59, 0.95);
      border-color: rgba(99, 102, 241, 0.3);
    }

    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-input,
    :host-context(.dark) .form-textarea {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .comment-item {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 1024px) {
      .kanban-board {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
      }

      .timer-bar {
        width: calc(100% - var(--space-2xl));
        left: var(--space-xl);
      }
    }
  `]
})
export class DevTachesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private timerInterval: any;

  viewMode = 'kanban';

  columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  connectedLists = ['todo', 'inprogress', 'done'];

taches: any[] = [
    { id: 1, titre: 'Implémenter auth JWT', description: 'Créer le middleware d\'authentification JWT avec refresh token', priorite: 'High', statut: 'inprogress', projet: 'API REST', deadline: 'Aujourd\'hui', tempsEstime: 4, piecesJointes: [], commentaires: [{id: 1, auteur: 'Chef', texte: 'Penser à inclure le refresh token', heure: 'Hier'}] },
    { id: 2, titre: 'Tests unitaires', description: 'Écrire les tests pour le module auth', priorite: 'Medium', statut: 'todo', projet: 'API REST', deadline: 'Demain', tempsEstime: 2, piecesJointes: [], commentaires: [] },
    { id: 3, titre: 'Page profil utilisateur', description: 'Design et implémentation du profil', priorite: 'Low', statut: 'todo', projet: 'App Mobile', deadline: '25/04', tempsEstime: 3, piecesJointes: ['mockup.png'], commentaires: [] },
    { id: 4, titre: 'Correction bug login', description: 'Debug de la validation mot de passe', priorite: 'High', statut: 'done', projet: 'App Mobile', deadline: 'Terminé', tempsEstime: 2, piecesJointes: [], commentaires: [{id: 1, auteur: 'QA', texte: 'Bug confirmé', heure: 'Mardi'}] }
  ];

  displayedColumns = ['titre', 'projet', 'priorite', 'statut', 'deadline', 'actions'];

  activeTask: any = null;
  isTimerRunning = false;
  timerSeconds = 0;
  viewingTache: any = null;
  gitLink = '';
  techNotes = '';
  tempsTravaille = 0;
  newComment = '';
  
  societeId = '';
  societeNom = '';
  compactMode = false;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPreferences();
    this.loadData();
  }

  loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    this.compactMode = prefs.dev?.compactKanban || false;
  }
  
  loadData() {
    const currentUser = this.api.getCurrentUser();
    this.api.getTaches().subscribe({
      next: (taches) => {
        let societeTaches = (taches || []).filter((t: any) => t.societeId === this.societeId);
        this.taches = societeTaches.filter((t: any) => t.assignee === currentUser?.nom || t.assignee === currentUser?.id);
        if (this.taches.length === 0) {
          this.initDefaultTasks();
        }
      },
      error: () => { this.initDefaultTasks(); }
    });
  }
  
  initDefaultTasks() {
    this.taches = [];
  }

  getColumnTasks(status: string): any[] {
    return this.taches.filter(t => t.statut === status);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.statut = event.container.id;
    }
  }

  startTask(tache: any) {
    this.activeTask = tache;
    this.startTimer();
    this.snackBar.open('Tâche démarrée', 'Fermer', { duration: 3000 });
  }

  pauseTask(tache: any) {
    this.stopTimer();
    this.snackBar.open('Tâche en pause', 'Fermer', { duration: 3000 });
  }

  doneTask(tache: any) {
    tache.statut = 'done';
    this.activeTask = null;
    this.stopTimer();

    // Trigger notification for Test/QA team
    this.api.createNotification(
      this.societeId,
      'qa',
      'Tâche Prête pour Test (QA)',
      `La tâche "${tache.titre}" a été complétée par le développeur et attend votre validation.`
    );

    this.snackBar.open('Tâche terminée et envoyée en QA!', 'Fermer', { duration: 3000 });
  }

  viewTache(tache: any) {
    this.viewingTache = tache;
    this.gitLink = '';
    this.techNotes = tache.techNotes || '';
    this.tempsTravaille = tache.tempsTravaille || 0;
    this.newComment = '';
  }

  addComment() {
    if (this.newComment && this.viewingTache) {
      this.viewingTache.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }

  saveChanges() {
    if (this.viewingTache) {
      this.viewingTache.gitLink = this.gitLink;
      this.viewingTache.techNotes = this.techNotes;
      this.viewingTache.tempsTravaille = this.tempsTravaille;
    }
    this.viewingTache = null;
    this.snackBar.open('Modifications enregistrées', 'Fermer', { duration: 3000 });
  }

  startTimer() {
    this.isTimerRunning = true;
    this.timerInterval = setInterval(() => { this.timerSeconds++; }, 1000);
  }

  stopTimer() {
    this.isTimerRunning = false;
    if (this.timerInterval) { clearInterval(this.timerInterval); }
  }

  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}

