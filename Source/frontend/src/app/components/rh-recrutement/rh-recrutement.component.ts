import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-rh-recrutement',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatBadgeModule, MatDialogModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-icon"><mat-icon>work</mat-icon></div>
        <div class="header-title">
          <h1>Recrutement</h1>
          <p>Gestion des candidats et embauches - {{societeNom}}</p>
        </div>
        <button mat-stroked-button color="warn" (click)="initRecrutement()">
          <mat-icon>refresh</mat-icon> Réinitialiser
        </button>
      </div>

      <div class="stats-row">
        <mat-card class="stat-card">
          <mat-icon class="stat-icon" style="background: linear-gradient(135deg, #2196f3, #1976d2);">assignment</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{Offres.length}}</span>
            <span class="stat-label">Postes ouverts</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon" style="background: linear-gradient(135deg, #ff9800, #f57c00);">people</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{Candidats.length}}</span>
            <span class="stat-label">Candidats</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon" style="background: linear-gradient(135deg, #9c27b0, #7b1fa2);">pending</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{candidatsEnAttente}}</span>
            <span class="stat-label">En attente / Tests</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon" style="background: linear-gradient(135deg, #4caf50, #388e3c);">check_circle</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{embauches}}</span>
            <span class="stat-label">Embauché(s)</span>
          </div>
        </mat-card>
      </div>

      <mat-card class="content-card">
        <mat-tab-group #tabGroup>
          <mat-tab label="Offres d'emploi">
            <div class="tab-content">
              <div class="tab-header">
                <h3>Postes disponibles</h3>
                <button mat-flat-button class="add-btn" (click)="openOffreForm()">
                  <mat-icon>add</mat-icon>Créer une offre
                </button>
              </div>
              
              <div class="offres-grid">
                @for (o of Offres; track o.id) {
                  <mat-card class="offre-card">
                    <div class="offre-header">
                      <div class="offre-title">
                        <mat-icon>work</mat-icon>
                        <span>{{o.titre}}</span>
                      </div>
                      <mat-chip [class]="o.statut?.toUpperCase() === 'OUVERTE' ? 'chip-ouverte' : 'chip-fermee'">
                        {{o.statut}}
                      </mat-chip>
                    </div>
                    <p class="offre-desc">{{o.description}}</p>
                    <div class="offre-meta">
                      <span><mat-icon>location_on</mat-icon> {{$any(o).lieu || 'Non défini'}}</span>
                      <span><mat-icon>attach_money</mat-icon> {{$any(o).salaire || 'À discuter'}}</span>
                      <span><mat-icon>schedule</mat-icon> {{$any(o).type || 'CDI'}}</span>
                    </div>
                    @if ($any(o).experience || $any(o).education || $any(o).competences || $any(o).nbPostes) {
                      <div class="offre-meta">
                        @if ($any(o).experience) {
                          <span><mat-icon>trending_up</mat-icon> {{$any(o).experience}}</span>
                        }
                        @if ($any(o).education) {
                          <span><mat-icon>school</mat-icon> {{$any(o).education}}</span>
                        }
                        @if ($any(o).nbPostes) {
                          <span><mat-icon>people</mat-icon> {{$any(o).nbPostes}} poste(s)</span>
                        }
                      </div>
                    }
                    @if ($any(o).competences) {
                      <div class="offre-competences">
                        <span class="comp-label">Compétences:</span>
                        <div class="comp-tags">
                          @for (comp of $any(o).competences.split(','); track comp) {
                            <span class="comp-tag">{{comp.trim()}}</span>
                          }
                        </div>
                      </div>
                    }
                    @if ($any(o).dateLimite) {
                      <div class="offre-meta">
                        <span><mat-icon>event</mat-icon> Deadline: {{$any(o).dateLimite | date:'dd/MM/yyyy'}}</span>
                      </div>
                    }
                    <div class="offre-meta" *ngIf="$any(o).quiz">
                      <span><mat-icon>quiz</mat-icon> Quiz: {{$any(o).quiz}}</span>
                    </div>
                    <div class="offre-stats">
                      <span>{{getCandidatsCount(o)}} candidat(s)</span>
                    </div>
                    <div class="offre-actions">
                      <button mat-button color="primary" (click)="viewCandidats(o)">
                        <mat-icon>visibility</mat-icon> Voir candidats
                      </button>
                      <button mat-button color="primary" (click)="editOffre(o)">
                        <mat-icon>edit</mat-icon> Modifier
                      </button>
                      <button mat-button color="warn" (click)="deleteOffre(o)">
                        <mat-icon>delete</mat-icon> Supprimer
                      </button>
                    </div>
                  </mat-card>
                }
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Candidats">
            <div class="tab-content">
              <div class="toolbar">
                <mat-form-field appearance="outline" class="search-field">
                  <mat-label>Rechercher candidat</mat-label>
                  <input matInput [(ngModel)]="searchCandidat" (ngModelChange)="onSearchChange()" placeholder="Nom, email, compétence...">
                  <mat-icon matPrefix>search</mat-icon>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Offre</mat-label>
                  <mat-select [(ngModel)]="selectedOffre" (ngModelChange)="onSearchChange()">
                    <mat-option value="">Toutes les offres</mat-option>
@for (o of Offres; track o.id) {
                      <mat-option [value]="o.titre">{{o.titre}}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Statut</mat-label>
                  <mat-select [(ngModel)]="filterStatutCandidat" (ngModelChange)="onSearchChange()">
                    <mat-option value="">Tous</mat-option>
                    <mat-option value="En_attente">Nouvelles (En attente)</mat-option>
                    <mat-option value="Test_autorise">Test autorisé</mat-option>
                    <mat-option value="Test_termine">Test terminé</mat-option>
                    <mat-option value="Entretien">Entretien planifié</mat-option>
                    <mat-option value="Accepté">Recruté</mat-option>
                    <mat-option value="Refusé">Refusé</mat-option>
                  </mat-select>
                </mat-form-field>
                
                @if (selectedOffre) {
                  <button mat-stroked-button color="warn" (click)="clearOffreFilter()">
                    <mat-icon>clear</mat-icon>
                    {{selectedOffre}}
                  </button>
                }
              </div>
              
              <table mat-table [dataSource]="filteredCandidats" class="candidats-table">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let c">#{{c.id}}</td>
                </ng-container>
                <ng-container matColumnDef="nom">
                  <th mat-header-cell *matHeaderCellDef>Nom</th>
                  <td mat-cell *matCellDef="let c">{{c.nom}}</td>
                </ng-container>
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let c">{{c.email}}</td>
                </ng-container>
                <ng-container matColumnDef="poste">
                  <th mat-header-cell *matHeaderCellDef>Poste</th>
                  <td mat-cell *matCellDef="let c">{{c.poste}}</td>
                </ng-container>
                <ng-container matColumnDef="telephone">
                  <th mat-header-cell *matHeaderCellDef>Téléphone</th>
                  <td mat-cell *matCellDef="let c">{{c.telephone || '-'}}</td>
                </ng-container>
                <ng-container matColumnDef="quiz">
                  <th mat-header-cell *matHeaderCellDef>Test</th>
                  <td mat-cell *matCellDef="let c">
                    @if (c.quiz && c.quizScore !== undefined) {
                      <mat-chip [class]="c.quizScore >= (c.quizTotal * 0.6) ? 'chip-success' : 'chip-warning'">
                        {{c.quizScore}}/{{c.quizTotal}} ({{Math.round((c.quizScore/c.quizTotal)*100)}}%)
                      </mat-chip>
                    } @else {
                        <span style="color: #999;">Non passé</span>
                    }
                  </td>
                </ng-container>
                <ng-container matColumnDef="competences">
                  <th mat-header-cell *matHeaderCellDef>Compétences</th>
                  <td mat-cell *matCellDef="let c">{{c.competences}}</td>
                </ng-container>
                <ng-container matColumnDef="statut">
                  <th mat-header-cell *matHeaderCellDef>Statut</th>
                  <td mat-cell *matCellDef="let c">
                    <mat-chip [class]="'chip-' + c.statut.toLowerCase().replace('_', '-')">
                      {{c.statut}}
                    </mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let c">
                    <button mat-icon-button (click)="viewCandidat(c)" title="Voir Détails/CV">
                      <mat-icon>description</mat-icon>
                    </button>
                    <!-- Flow 1: New -> Authorize Test -->
                    <button mat-icon-button color="primary" (click)="updateStatut(c, 'Test_autorise')" *ngIf="c.statut === 'En_attente' && c.quiz" title="Autoriser Test">
                      <mat-icon>quiz</mat-icon>
                    </button>
                    <!-- Flow 1b: New -> No test -> Directly to interview -->
                    <button mat-icon-button color="primary" (click)="planifierEntretien(c)" *ngIf="c.statut === 'En_attente' && !c.quiz" title="Planifier Entretien">
                      <mat-icon>event</mat-icon>
                    </button>
                    <!-- Flow 2: Test Done -> Interview -->
                    <button mat-icon-button color="primary" (click)="planifierEntretien(c)" *ngIf="c.statut === 'Test_termine'" title="Planifier entretien">
                      <mat-icon>event</mat-icon>
                    </button>
                    <!-- flow: Direct Accept -->
                    <button mat-icon-button color="accent" (click)="updateStatut(c, 'Accepté')" *ngIf="c.statut !== 'Accepté' && c.statut !== 'Refusé'" title="Accepter / Recruter">
                      <mat-icon>check_circle</mat-icon>
                    </button>
                    <!-- Any -> Refused -->
                    <button mat-icon-button color="warn" (click)="updateStatut(c, 'Refusé')" *ngIf="c.statut !== 'Refusé' && c.statut !== 'Accepté'" title="Refuser">
                      <mat-icon>block</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteCandidat(c)" title="Supprimer de la DB">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
              
              @if (filteredCandidats.length === 0) {
                <div class="empty">
                  <mat-icon>person_search</mat-icon>
                  <span>Aucun candidat trouvé</span>
                </div>
              }
            </div>
          </mat-tab>
          
          <mat-tab label="Entretiens">
            <div class="tab-content">
              <div class="tab-header">
                <h3>Entretiens Planifiés</h3>
              </div>
              <table mat-table [dataSource]="entretiensPrevus" class="candidats-table">
                <ng-container matColumnDef="candidat">
                  <th mat-header-cell *matHeaderCellDef>Candidat</th>
                  <td mat-cell *matCellDef="let e"><strong>{{e.nom}}</strong><br/><small style="color:#666">{{e.email}}</small></td>
                </ng-container>
                <ng-container matColumnDef="poste">
                  <th mat-header-cell *matHeaderCellDef>Poste</th>
                  <td mat-cell *matCellDef="let e">{{e.poste}}</td>
                </ng-container>
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date Entretien</th>
                  <td mat-cell *matCellDef="let e">
                     <mat-chip class="chip-success"><mat-icon style="font-size:16px;width:16px;height:16px;vertical-align:bottom;">event</mat-icon> {{e.dateEntretien | date:'dd/MM/yyyy HH:mm'}}</mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="notes">
                  <th mat-header-cell *matHeaderCellDef>Notes</th>
                  <td mat-cell *matCellDef="let e"><em>{{e.observations || 'Aucune note'}}</em></td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let e">
                    <button mat-icon-button (click)="viewCandidat(e)" title="Détails">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="primary" (click)="planifierEntretien(e)" title="Reprogrammer">
                      <mat-icon>edit_calendar</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" (click)="accepterCandidat(e)" title="Accepter (Embaucher)">
                      <mat-icon>check_circle</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="refuserCandidat(e)" title="Refuser">
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['candidat', 'poste', 'date', 'notes', 'actions']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['candidat', 'poste', 'date', 'notes', 'actions'];"></tr>
              </table>
              
              @if (entretiensPrevus.length === 0) {
                <div class="empty">
                  <mat-icon>event_busy</mat-icon>
                  <span>Aucun entretien planifié</span>
                </div>
              }
            </div>
          </mat-tab>
          
          <mat-tab label="Paramètres Email">
            <div class="tab-content">
              <div class="settings-card">
                <h3>Configuration EmailJS</h3>
                <p class="settings-info">Configurez vos identifiants EmailJS pour envoyer des notifications automatiques aux candidats.</p>
                
                <div class="settings-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Service ID</mat-label>
                    <input matInput [(ngModel)]="emailConfig.serviceId" placeholder="service_xxxx">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Public Key</mat-label>
                    <input matInput [(ngModel)]="emailConfig.publicKey" placeholder="Public Key">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Template Test Autorisé</mat-label>
                    <input matInput [(ngModel)]="emailConfig.templates.testAuthorized" placeholder="template_xxxx">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Template Candidature Refusée</mat-label>
                    <input matInput [(ngModel)]="emailConfig.templates.candidatureRefused" placeholder="template_xxxx">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Template Embauche (Accepté)</mat-label>
                    <input matInput [(ngModel)]="emailConfig.templates.candidatureAccepted" placeholder="template_xxxx">
                  </mat-form-field>
                </div>
                
                <div class="settings-actions">
                  <button mat-raised-button color="primary" (click)="saveEmailConfig()">
                    <mat-icon>save</mat-icon> Enregistrer
                  </button>
                  <button mat-stroked-button color="accent" (click)="testEmailJsConfig()">
                    <mat-icon>send</mat-icon> Tester la config (Envoyer test à moi)
                  </button>
                  <button mat-button (click)="resetEmailConfig()">Réinitialiser</button>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
      
      @if (showOffreForm || editingOffre) {
        <div class="dialog-overlay" (click)="closeOffreForm()">
          <mat-card class="dialog-card" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{editingOffre ? 'Modifier' : 'Nouvelle'}} Offre d'emploi</h2>
              <button mat-icon-button (click)="closeOffreForm()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="dialog-body">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Titre du poste</mat-label>
                <mat-select [(ngModel)]="offreForm.titre" (selectionChange)="onPosteChange($event.value)">
                  @for (poste of postes; track poste) {
                    <mat-option [value]="poste">{{poste}}</mat-option>
                  }
                  <mat-option value="AUTRE">Autre (personnalisé)</mat-option>
                </mat-select>
              </mat-form-field>
              
              @if (offreForm.titre === 'AUTRE') {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nom du poste</mat-label>
                  <input matInput [(ngModel)]="nouveauPoste" placeholder="Nouveau poste...">
                </mat-form-field>
              }
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput [(ngModel)]="offreForm.description" rows="4" placeholder="Description du poste..."></textarea>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Société</mat-label>
                <input matInput [(ngModel)]="offreForm.societe" [placeholder]="societeNom">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Adresse</mat-label>
                <input matInput [(ngModel)]="offreForm.adresse" placeholder="Adresse de l'entreprise">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Lieu</mat-label>
                <input matInput [(ngModel)]="offreForm.lieu" placeholder="Tunis, Tunisia">
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Salaire</mat-label>
                <input matInput [(ngModel)]="offreForm.salaire" placeholder="1500 - 3000 TND">
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Type de contrat</mat-label>
                <mat-select [(ngModel)]="offreForm.type">
                  <mat-option value="CDI">CDI</mat-option>
                  <mat-option value="CDD">CDD</mat-option>
                  <mat-option value="Stage">Stage</mat-option>
                  <mat-option value="Freelance">Freelance</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Expérience requise</mat-label>
                <mat-select [(ngModel)]="offreForm.experience">
                  <mat-option value="Débutant">Débutant (0-1 ans)</mat-option>
                  <mat-option value="Junior">Junior (1-3 ans)</mat-option>
                  <mat-option value="Intermédiaire">Intermédiaire (3-5 ans)</mat-option>
                  <mat-option value="Senior">Senior (5+ ans)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Niveau d'éducation</mat-label>
                <mat-select [(ngModel)]="offreForm.education">
                  <mat-option value="Bac">Bac</mat-option>
                  <mat-option value="Bac+2">Bac+2 (DUT/BTS)</mat-option>
                  <mat-option value="Bac+3">Bac+3 (Licence)</mat-option>
                  <mat-option value="Bac+4">Bac+4 (Master 1)</mat-option>
                  <mat-option value="Bac+5">Bac+5 (Master/Ingénieur)</mat-option>
                  <mat-option value="Doctorat">Doctorat</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Compétences</mat-label>
                <input matInput [(ngModel)]="offreForm.competences" placeholder="React, Node.js, TypeScript...">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre de postes</mat-label>
                <input matInput type="number" [(ngModel)]="offreForm.nbPostes" placeholder="1" min="1">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Date limite</mat-label>
                <input matInput type="date" [(ngModel)]="offreForm.dateLimite">
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Quiz de sélection</mat-label>
                <mat-select [(ngModel)]="offreForm.quiz">
                  <mat-option value="">Aucun quiz</mat-option>
                  <mat-option value="JavaScript Avancé">JavaScript Avancé</mat-option>
                  <mat-option value="TypeScript">TypeScript</mat-option>
                  <mat-option value="Angular Framework">Angular Framework</mat-option>
                  <mat-option value="Développeur Frontend">Développeur Frontend</mat-option>
                  <mat-option value="Développeur Backend">Développeur Backend</mat-option>
                  <mat-option value="Développeur Full Stack">Développeur Full Stack</mat-option>
                  <mat-option value="Développeur Mobile">Développeur Mobile</mat-option>
                  <mat-option value="Testeur Logiciel">Testeur Logiciel</mat-option>
                  <mat-option value="Testeur Automation">Testeur Automation</mat-option>
                  <mat-option value="Tests Unitaires">Tests Unitaires</mat-option>
                  <mat-option value="Gestion de Projet">Gestion de Projet</mat-option>
                  <mat-option value="Chef de Projet IT">Chef de Projet IT</mat-option>
                  <mat-option value="Product Owner">Product Owner</mat-option>
                  <mat-option value="Scrum Master">Scrum Master</mat-option>
                  <mat-option value="Droit du Travail">Droit du Travail</mat-option>
                  <mat-option value="RH IT">RH IT</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="dialog-footer">
              <button mat-stroked-button (click)="closeOffreForm()">Annuler</button>
              <button mat-flat-button class="save-btn" (click)="saveOffre()">Enregistrer</button>
            </div>
          </mat-card>
        </div>
      }
    
    @if (showCandidatDialog) {
      <div class="dialog-overlay" (click)="closeCandidatDialog()">
        <mat-card class="dialog-card candidats-details" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2><mat-icon>person</mat-icon>Détails candidat</h2>
            <button mat-icon-button (click)="closeCandidatDialog()"><mat-icon>close</mat-icon></button>
          </div>
          <div class="dialog-body">
            <div class="detail-row"><strong>Nom:</strong> {{selectedCandidat?.nom}}</div>
            <div class="detail-row"><strong>Email:</strong> {{selectedCandidat?.email}}</div>
            <div class="detail-row"><strong>Téléphone:</strong> {{selectedCandidat?.telephone || 'Non fourni'}}</div>
            <div class="detail-row"><strong>Poste:</strong> {{selectedCandidat?.poste}}</div>
            @if (selectedCandidat?.quiz && selectedCandidat?.quizScore !== undefined) {
              <div class="detail-row"><strong>Test:</strong> {{selectedCandidat?.quiz}} - Score: {{selectedCandidat?.quizScore}}/{{selectedCandidat?.quizTotal}} ({{Math.round((selectedCandidat?.quizScore/selectedCandidat?.quizTotal)*100)}}%)</div>
            }
            <div class="detail-row"><strong>Statut:</strong> <mat-chip>{{selectedCandidat?.statut}}</mat-chip></div>
            @if (selectedCandidat?.dateEntretien) {
              <div class="detail-row"><strong>Entretien:</strong> {{selectedCandidat?.dateEntretien | date:'dd/MM/yyyy HH:mm'}}</div>
            }
            <div class="detail-row" *ngIf="selectedCandidat?.competences !== '-'"><strong>CV:</strong> {{selectedCandidat?.competences}}</div>
            <div class="detail-row" *ngIf="selectedCandidat?.competences === '-'"><em>Pas de CV joint</em></div>
          </div>
          <div class="dialog-footer">
            <button mat-stroked-button (click)="closeCandidatDialog()">Fermer</button>
            @if (selectedCandidat?.statut === 'En_attente') {
              <button mat-flat-button color="primary" (click)="updateStatut(selectedCandidat, 'Test_autorise')"><mat-icon>quiz</mat-icon> Autoriser Test</button>
            }
            @if (selectedCandidat?.statut === 'Test_termine' || (selectedCandidat?.statut === 'En_attente' && !selectedCandidat?.quiz)) {
              <button mat-flat-button color="primary" (click)="planifierEntretien(selectedCandidat)"><mat-icon>event</mat-icon> Planifier entretien</button>
            }
            @if (selectedCandidat?.statut === 'Entretien') {
              <button mat-flat-button color="accent" (click)="updateStatut(selectedCandidat, 'Accepté')"><mat-icon>check</mat-icon> Valider l'embauche</button>
              <button mat-flat-button color="warn" (click)="updateStatut(selectedCandidat, 'Refusé')"><mat-icon>close</mat-icon> Refuser</button>
            }
          </div>
        </mat-card>
      </div>
    }

    @if (showEntretienDialog) {
      <div class="dialog-overlay" (click)="closeEntretienDialog()">
        <mat-card class="dialog-card" (click)="$event.stopPropagation()">
          <div class="dialog-header" style="background: linear-gradient(135deg, #059669, #10b981);">
            <h2><mat-icon>event</mat-icon>Planifier entretien</h2>
            <button mat-icon-button (click)="closeEntretienDialog()"><mat-icon>close</mat-icon></button>
          </div>
          <div class="dialog-body">
            <div class="detail-row"><strong>Candidat:</strong> {{selectedCandidat?.nom}}</div>
            <div class="detail-row"><strong>Poste:</strong> {{selectedCandidat?.poste}}</div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date</mat-label>
              <input matInput [(ngModel)]="entretienDate" type="date">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Heure</mat-label>
              <input matInput [(ngModel)]="entretienHeure" type="time">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput [(ngModel)]="entretienNotes" rows="3" placeholder="Notes pour l'entretien..."></textarea>
            </mat-form-field>
          </div>
          <div class="dialog-footer">
            <button mat-stroked-button (click)="closeEntretienDialog()">Annuler</button>
            <button mat-flat-button color="primary" (click)="saveEntretien()"><mat-icon>save</mat-icon> Enregistrer</button>
          </div>
        </mat-card>
      </div>
    }
    </div>
  `,
  styles: [`
    .container { padding: 28px; }
    .page-header { display: flex; align-items: center; gap: 18px; padding: 28px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); border-radius: 16px; color: white; margin-bottom: 28px; box-shadow: 0 4px 20px rgba(29,78,216,0.3); }
    .header-title { flex: 1; }
    .header-icon { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .header-icon mat-icon { font-size: 30px; }
    h1 { margin: 0; font-size: 26px; font-weight: 700; }
    p { margin: 6px 0 0; opacity: 0.85; font-size: 14px; }
    
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
    .stat-card { display: flex; align-items: center; gap: 16px; padding: 24px; border-radius: 16px; transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 26px; }
    .stat-value { font-size: 28px; font-weight: 700; color: #0f172a; display: block; }
    .stat-label { font-size: 14px; color: #64748b; font-weight: 500; }
    
    .content-card { border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .tab-content { padding: 24px 0; }
    .tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }
    .tab-header h3 { margin: 0; color: #1e293b; font-size: 20px; font-weight: 600; }
    .add-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-radius: 10px; font-weight: 500; }
    .add-btn:hover { background: linear-gradient(135deg, #1e40af, #2563eb); }
    .save-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-radius: 10px; }
    
    .offres-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .offre-card { padding: 24px; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); transition: all 0.3s ease; }
    .offre-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .offre-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .offre-title { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 600; color: #1a1a2e; }
    .offre-title mat-icon { color: #3b82f6; font-size: 22px; }
    .offre-desc { font-size: 14px; color: #64748b; margin: 0 0 16px; line-height: 1.5; }
    .offre-meta { display: flex; gap: 20px; font-size: 13px; color: #94a3b8; margin-bottom: 16px; flex-wrap: wrap; }
    .offre-meta span { display: flex; align-items: center; gap: 6px; }
    .offre-stats { font-size: 14px; color: #334155; margin-bottom: 16px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-weight: 500; }
    .offre-stats span { background: #eff6ff; padding: 4px 12px; border-radius: 20px; color: #1d4ed8; }
    .offre-actions { display: flex; gap: 8px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
    .chip-ouverte { background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; font-weight: 500; }
    .chip-fermee { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; font-weight: 500; }
    .chip-en-cours { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; font-weight: 500; }
    .chip-entretien { background: linear-gradient(135deg, #ffedd5, #fed7aa); color: #c2410c; font-weight: 500; }
    .chip-accepte { background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; font-weight: 500; }
    .chip-refuse { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; font-weight: 500; }
    .chip-success { background: linear-gradient(135deg, #dcfce7, #86efac); color: #166534; font-weight: 500; }
    .chip-warning { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; font-weight: 500; }
    
    .offre-competences { margin: 12px 0; }
    .comp-label { font-size: 12px; color: #64748b; font-weight: 500; display: block; margin-bottom: 6px; }
    .comp-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .comp-tag { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    
    .toolbar { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .search-field { min-width: 300px; }
    .candidats-table { width: 100%; border-radius: 12px; overflow: hidden; }
    
    .empty { display: flex; flex-direction: column; align-items: center; padding: 60px; color: #94a3b8; }
    .empty mat-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.5; }
    
    .dialog-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
    .dialog-card { width: 520px; max-height: 90vh; padding: 0; border-radius: 20px; background: #fff; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; border-radius: 20px 20px 0 0; }
    .dialog-header h2 { margin: 0; font-size: 20px; font-weight: 600; }
    .dialog-header button { color: white; opacity: 0.8; }
    .dialog-header button:hover { opacity: 1; }
    .dialog-body { padding: 28px; max-height: 60vh; overflow-y: auto; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid #f1f5f9; }
  `]
})
export class RhRecrutementComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);
  
  societeId: string = '';
  societeNom: string = '';
  
  Offres: any[] = [];
  
  Candidats: any[] = [];
  
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  
  filteredCandidats: any[] = [];
  entretiensPrevus: any[] = [];
  displayedColumns = ['id', 'nom', 'email', 'poste', 'telephone', 'quiz', 'competences', 'statut', 'actions'];
  Math = Math;
  
  searchCandidat = '';
  filterStatutCandidat = '';
  selectedOffre: string = '';
  
  showOffreForm = false;
  editingOffre: any = null;
  offreForm: any = { titre: '', description: '', lieu: '', salaire: '', type: 'CDI', poste: '', societe: '', adresse: '' };
  
  postes: string[] = [
    // Developpeur
    'Développeur Frontend',
    'Développeur Backend',
    'Développeur Full Stack',
    'Développeur Mobile',
    'Développeur React',
    'Développeur Angular',
    'Développeur Node.js',
    'Développeur .NET',
    'Développeur Python',
    'DevOps Engineer',
    // Testeur
    'Ingénieur QA',
    'Testeur Logiciel',
    'Testeur Automation',
    // Chef de Projet
    'Chef de Projet IT',
    'Chef de Projet Digital',
    'Product Owner',
    'Scrum Master',
    'Tech Lead',
    // RH
    'RH Développeur',
    'Recruteur IT'
  ];
  
  nouveauPoste = '';
  
  candidatsEnAttente = 0;
  embauches = 0;
  candidatsRecuperes = 0;
  selectedCandidat: any = null;
  showCandidatDialog = false;
  showEntretienDialog = false;
  entretienDate = '';
  entretienHeure = '';
  entretienNotes = '';

  emailConfig: any = {
    serviceId: '',
    publicKey: '',
    templates: {
      testAuthorized: '',
      candidatureRefused: '',
      candidatureAccepted: ''
    }
  };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    const stored = this.api.getRawStorage();
    if (!stored.offresEmploi || stored.offresEmploi.length === 0) {
      this.api.initRecrutementData();
    }
    this.api.loadEmailJsConfig(); 
    this.emailConfig = this.api.getEmailJsConfig();
    this.loadData();
  }

  loadData() {
    this.api.getOffresEmploi().subscribe(offres => {
      this.Offres = offres.filter((o: any) => o.societeId === this.societeId);
    });

    this.api.getCandidatures().subscribe(candidatures => {
      const societeApplications = candidatures.filter((c: any) => c.societeId === this.societeId);
      this.Candidats = societeApplications.map((c: any) => ({
        id: c.id,
        nom: c.candidatNom || c.nom || 'Sans nom',
        email: c.candidatEmail || c.email,
        telephone: c.candidatTelephone || c.telephone,
        poste: c.offreTitre || c.poste,
        competences: c.cvPath ? 'CV joint' : '-',
        statut: c.statut || 'EN_ATTENTE',
        quiz: c.quiz,
        quizScore: c.quizScore,
        quizTotal: c.quizTotal,
        dateCandidature: c.dateCandidature,
        dateEntretien: c.dateEntretien || null,
        observations: c.notes || c.observations || ''
      }));
      this.filteredCandidats = [...this.Candidats];
      this.calculateStats();
    });
  }

  calculateStats() {
    this.candidatsEnAttente = this.Candidats.filter(c => {
      const s = (c.statut || '').toUpperCase();
      return s === 'EN_ATTENTE' || s === 'TEST_AUTORISE' || s === 'TEST_TERMINE';
    }).length;
    this.embauches = this.Candidats.filter(c => (c.statut || '').toUpperCase() === 'ACCEPTEE' || (c.statut || '').toUpperCase() === 'ACCEPTE').length;
    this.candidatsRecuperes = this.Candidats.filter(c => c.quizScore && c.quizScore >= (c.quizTotal * 0.6)).length;
    this.updateEntretiensList();
  }
  
  updateEntretiensList() {
    this.entretiensPrevus = this.Candidats.filter(c => {
      const s = (c.statut || '').toUpperCase();
      return s === 'ENTRETIEN' || s === 'ENTRETIEN_PLANIFIE' || c.dateEntretien;
    }).sort((a,b) => {
      const dateA = a.dateEntretien ? new Date(a.dateEntretien).getTime() : 0;
      const dateB = b.dateEntretien ? new Date(b.dateEntretien).getTime() : 0;
      return dateA - dateB;
    });
  }
  
  onSearchChange() {
    if (!this.selectedOffre && this.searchCandidat === '' && this.filterStatutCandidat === '') {
      this.filteredCandidats = [...this.Candidats];
    } else {
      this.filterCandidats();
    }
  }
  
  clearOffreFilter() {
    this.selectedOffre = '';
    this.searchCandidat = '';
    this.filterStatutCandidat = '';
    this.filteredCandidats = [...this.Candidats];
  }

  filterCandidats() {
    let candidatesToFilter = this.Candidats;
    if (this.selectedOffre) {
      candidatesToFilter = candidatesToFilter.filter(c => c.poste === this.selectedOffre);
    }
    this.filteredCandidats = candidatesToFilter.filter(c => {
      const matchesSearch = !this.searchCandidat || 
        c.nom.toLowerCase().includes(this.searchCandidat.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchCandidat.toLowerCase()) ||
        c.competences.toLowerCase().includes(this.searchCandidat.toLowerCase());
      const matchesStatut = !this.filterStatutCandidat || c.statut === this.filterStatutCandidat;
      return matchesSearch && matchesStatut;
    });
  }

  openOffreForm() {
    this.offreForm = { titre: '', description: '', lieu: '', salaire: '', type: 'CDI', poste: '', quiz: '', societe: '', adresse: '' };
    this.nouveauPoste = '';
    this.showOffreForm = true;
  }

  closeOffreForm() {
    this.showOffreForm = false;
    this.editingOffre = null;
    this.nouveauPoste = '';
  }

  onPosteChange(poste: string) {
    if (poste !== 'AUTRE') {
      this.offreForm.poste = poste;
    }
  }

  saveOffre() {
    const titreFinal = this.offreForm.titre === 'AUTRE' ? this.nouveauPoste : this.offreForm.titre;
    if (!titreFinal) {
      this.snackBar.open('Veuillez entrer un titre', 'Fermer', { duration: 2000 });
      return;
    }
    const offreToSave = { 
      id: this.editingOffre?.id || null,
      societeId: this.societeId,
      titre: titreFinal,
      description: this.offreForm.description,
      profilRecherche: this.offreForm.description, // Par défaut
      competencesRequises: this.offreForm.competences,
      experience: this.offreForm.experience,
      niveauEtudes: this.offreForm.education,
      typeContrat: this.offreForm.type,
      lieu: this.offreForm.lieu,
      salaire: this.offreForm.salaire,
      dateLimite: this.offreForm.dateLimite || null,
      statut: this.editingOffre ? this.editingOffre.statut : 'OUVERTE'
    };
    
    this.api.saveOffreEmploi(offreToSave).subscribe({
      next: () => {
        this.api.getOffresEmploi().subscribe(offres => {
          this.Offres = offres.filter((o: any) => o.societeId === this.societeId);
          this.snackBar.open('Offre enregistrée avec succès', 'Fermer', { duration: 2000 });
          this.closeOffreForm();
        });
      },
      error: (err: any) => {
        console.error('Erreur sauvegarde offre:', err);
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
      }
    });
  }

  viewCandidats(o: any) {
    this.selectedOffre = o.titre;
    this.filterStatutCandidat = '';
    this.filteredCandidats = this.Candidats.filter(c => c.poste === o.titre || c.poste === o.id);
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 1;
    }
    this.snackBar.open('Affichage des candidats pour: ' + o.titre, 'Fermer', { duration: 2000 });
  }
  editOffre(o: any) { 
    this.editingOffre = o; 
    this.offreForm = { 
      ...o,
      type: o.typeContrat || o.type,
      competences: o.competencesRequises || o.competences,
      education: o.niveauEtudes || o.education
    }; 
  }
  
  deleteOffre(o: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer l\'offre: ' + o.titre + '?')) {
      this.api.deleteOffreEmploi(o.id).subscribe(() => {
        this.api.getOffresEmploi().subscribe(offres => {
          this.Offres = offres.filter((o2: any) => o2.societeId === this.societeId);
          this.snackBar.open('Offre supprimée', 'Fermer', { duration: 2000 });
        });
      });
    }
  }
  
  getCandidatsCount(o: any): number {
    return this.Candidats.filter(c => c.poste === o.titre || c.poste === o.id).length;
  }
  
  viewCandidat(c: any) { 
    this.selectedCandidat = c; 
    this.showCandidatDialog = true; 
  }
  closeCandidatDialog() { this.showCandidatDialog = false; }
  planifierEntretien(c: any) { 
    this.selectedCandidat = c;
    this.showEntretienDialog = true;
  }
  
  saveEntretien() {
    if (!this.selectedCandidat || !this.entretienDate || !this.entretienHeure) {
      this.snackBar.open('Veuillez remplir la date et l\'heure', 'Fermer', { duration: 2000 });
      return;
    }
    
    const updatedCandidat = {
      id: this.selectedCandidat.id,
      dateEntretien: this.entretienDate + 'T' + this.entretienHeure,
      statut: 'Entretien',
      observations: this.entretienNotes
    };
    
    this.api.updateCandidature(updatedCandidat).subscribe();
    
    this.selectedCandidat.statut = 'Entretien';
    this.selectedCandidat.dateEntretien = this.entretienDate + ' ' + this.entretienHeure;
    this.selectedCandidat.observations = this.entretienNotes;
    
    this.showEntretienDialog = false;
    this.entretienDate = '';
    this.entretienHeure = '';
    this.entretienNotes = '';
    
    this.filterCandidats();
    this.calculateStats();
    this.snackBar.open('Entretien planifié pour ' + this.selectedCandidat.nom, 'Fermer', { duration: 3000 });
  }
  
  closeEntretienDialog() {
    this.showEntretienDialog = false;
    this.entretienDate = '';
    this.entretienHeure = '';
    this.entretienNotes = '';
  }
  
  accepterCandidat(c: any) {
    if (confirm('Voulez-vous accepter ce candidat et créer son compte employé ?')) {
      this.api.convertCandidatToEmploye(c.id).subscribe({
        next: (res: any) => {
          if (res.success) {
            c.statut = 'Accepté';
            this.filterCandidats();
            this.calculateStats();
            this.snackBar.open(`Compte créé pour ${c.nom}. Password temporaire: ${res.user.password}`, 'Copier', { duration: 10000 });
            this.updateEntretiensList();
          } else {
            this.snackBar.open('Erreur: ' + res.error, 'Fermer', { duration: 3000 });
          }
        }
      });
    }
  }
  
  refuserCandidat(c: any) {
    if (confirm('Voulez-vous refuser ce candidat?')) {
      c.statut = 'Refusé';
      this.api.updateCandidature({ id: c.id, statut: 'Refusé' }).subscribe();
      this.filterCandidats();
      this.calculateStats();
      this.updateEntretiensList();
      this.snackBar.open(c.nom + ' a été refusé', 'Fermer', { duration: 2000 });
    }
  }
  
  deleteCandidat(c: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature?')) {
      this.api.deleteCandidature(c.id).subscribe();
      this.Candidats = this.Candidats.filter((cand: any) => cand.id !== c.id);
      this.filteredCandidats = this.filteredCandidats.filter((cand: any) => cand.id !== c.id);
      this.calculateStats();
      this.snackBar.open('Candidature supprimée', 'Fermer', { duration: 2000 });
    }
  }
  
  updateStatut(c: any, statut: string) {
    c.statut = statut;
    this.api.updateCandidature({ id: c.id, statut: statut }).subscribe();
    this.filterCandidats();
    this.calculateStats();
    
    // ── Envoi automatique d'email via EmailJS ──
    if (statut === 'Test_autorise') {
      this.api.sendTestAuthorizationEmail(c).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.snackBar.open('✅ Test autorisé — Email envoyé à ' + c.email, 'Fermer', { duration: 4000 });
          } else {
            this.snackBar.open('⚠️ Test autorisé — Échec envoi email (vérifiez la config EmailJS)', 'Fermer', { duration: 4000 });
          }
        }
      });
    } else if (statut === 'Refusé') {
      this.api.sendCandidatureRefusedEmail(c).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.snackBar.open('Candidature refusée — Email de notification envoyé', 'Fermer', { duration: 3000 });
          } else {
            this.snackBar.open('Candidature refusée — Échec envoi email', 'Fermer', { duration: 3000 });
          }
        }
      });
    } else if (statut === 'Accepté') {
      this.api.sendCandidatureAcceptedEmail(c).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.snackBar.open('✅ Candidature acceptée — Email de félicitations envoyé !', 'Fermer', { duration: 4000 });
          } else {
            this.snackBar.open('⚠️ Candidat accepté — Échec envoi email', 'Fermer', { duration: 4000 });
          }
        }
      });
    } else {
      this.snackBar.open('Statut mis à jour: ' + statut, 'Fermer', { duration: 2000 });
    }
  }
  
  initRecrutement() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le recrutement? Toutes les offres et candidats seront supprimés.')) {
      this.api.initRecrutementData();
      this.Offres = [];
      this.Candidats = [];
      this.filteredCandidats = [];
      this.calculateStats();
      this.snackBar.open('Recrutement réinitialisé', 'Fermer', { duration: 2000 });
    }
  }

  saveEmailConfig() {
    this.api.updateEmailJsConfig(this.emailConfig);
    this.snackBar.open('Configuration EmailJS mise à jour !', 'Fermer', { duration: 3000 });
  }

  resetEmailConfig() {
    if (confirm('Voulez-vous réinitialiser les réglages par défaut ?')) {
      localStorage.removeItem('emailjs_config');
    }
  }

  testEmailJsConfig() {
    const user = this.api.getCurrentUser();
    if (!user || !user.email) {
      this.snackBar.open('Erreur: Aucun email trouvé pour votre compte RH', 'Fermer', { duration: 3000 });
      return;
    }

    this.snackBar.open('Envoi de l\'email de test...', 'Fermer', { duration: 2000 });
    
    // On utilise le template de test
    const testData = {
      nom: user.nom,
      email: user.email,
      poste: 'TEST CONFIGURATION',
      societe: this.societeNom
    };

    this.api.sendTestAuthorizationEmail(testData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.snackBar.open('✅ Configuration validée ! Email de test envoyé à ' + user.email, 'Fermer', { duration: 5000 });
        } else {
          this.snackBar.open('❌ Échec du test : ' + (res.error?.error || 'Vérifiez vos IDs'), 'Fermer', { duration: 5000 });
        }
      }
    });
  }
}
