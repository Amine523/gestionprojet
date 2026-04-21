import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-super-admin-abonnements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="abo-container">
      <div class="abo-header">
        <div class="header-icon">
          <i class="bi bi-card-checklist text-white" style="font-size: 32px;"></i>
        </div>
        <div>
          <h1>Abonnements</h1>
          <p>Gestion des plans, paiements et facturation</p>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item">
          <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#plans">Plans</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#abonnements">Abonnements</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#societes">Sociétés</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#factures">Factures</button>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane fade show active" id="plans">
          <div class="tab-content">
            <div class="plans-header">
              <h3>Plans d'abonnement</h3>
              <button class="btn btn-outline-primary" (click)="loadAllAbonnements()">
                <i class="bi bi-eye me-2"></i> Voir tous les abonnements
              </button>
            </div>
            <div class="plans-grid">
              @for (plan of plans; track plan.id) {
                <div class="card plan-card border-0 shadow-sm" [class.populaire]="plan.populaire">
                  @if (plan.populaire) {
                    <div class="popular-badge">Plus populaire</div>
                  }
                  <div class="plan-actions">
                    <button class="btn btn-sm btn-outline-primary" (click)="editPlan(plan)" title="Modifier">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="deletePlan(plan)" title="Supprimer" class="delete-btn">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <i class="bi bi-{{getPlanIcon(plan.id)}} plan-icon"></i>
                  <h4>{{plan.nom}}</h4>
                  <div class="price">
                    <span class="amount">{{plan.prix}}</span>
                    <span class="currency">DT</span>
                    <span class="period">/{{plan.periode}}</span>
                  </div>
                  <div class="limits">
                    <div class="limit"><i class="bi bi-people me-2"></i> {{plan.utilisateurs === -1 ? 'Illimité' : plan.utilisateurs}} utilisateurs</div>
                    <div class="limit"><i class="bi bi-cloud me-2"></i> {{plan.stockage}}</div>
                  </div>
                  <ul class="features">
                    @for (feat of plan.features; track feat) {
                      <li><i class="bi bi-check text-success me-2"></i> {{feat}}</li>
                    }
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="abonnements">
          <div class="tab-content">
            <div class="abo-header">
              <h3>Abonnements actifs</h3>
            </div>
            <div class="filters-row">
              <div class="mb-3">
                <label class="form-label">Société</label>
                <select class="form-select" [(ngModel)]="filterSocieteId" (change)="applyFilters()">
                  <option value="">Toutes les sociétés</option>
                  @for (s of societes; track s.id) {
                    <option [value]="s.id">{{s.nom}}</option>
                  }
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Mode paiement</label>
                <select class="form-select" [(ngModel)]="filterModePaiement" (change)="applyFilters()">
                  <option value="">Tous</option>
                  <option value="Mensuel">Mensuel</option>
                  <option value="Trimestriel">Trimestriel</option>
                  <option value="Annuel">Annuel</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Plan</label>
                <select class="form-select" [(ngModel)]="filterPlan" (change)="applyFilters()">
                  <option value="">Tous les plans</option>
                  <option value="Starter">Starter</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div class="abo-list">
              @for (abo of abonnements; track abo.id) {
                <div class="card abo-card border-0 shadow-sm">
                  <div class="card-body d-flex align-items-center gap-3">
                    <div class="abo-avatar">{{abo.societeNom?.charAt(0) || 'S'}}</div>
                    <div class="abo-info flex-grow-1">
                    <strong>{{abo.societeNom || 'Société'}}</strong>
                    <span class="abo-id">ID: {{abo.societeIdDisplay || abo.societeId}}</span>
                    <span class="abo-plan">{{abo.planNom || 'Plan'}}</span>
                    @if (abo.coordonnees) {
                      <span class="abo-contact">{{abo.coordonnees}}</span>
                    }
                    @if (abo.adminPar) {
                      <span class="abo-admin">Payé par: {{abo.adminPar}}</span>
                    }
                  </div>
                  <div class="abo-details">
                    <span class="abo-users"><i class="bi bi-people me-1"></i> {{abo.nbUsers || 0}} utilisateurs</span>
                    <span class="abo-period">{{abo.dateDebut}} - {{abo.dateFin}}</span>
                  </div>
                  <span class="badge rounded-pill" [class.bg-success]="abo.statut === 'Actif'" [class.bg-secondary]="abo.statut !== 'Actif'">
                    <i class="bi bi-{{abo.statut === 'Actif' ? 'check-circle' : 'x-circle'}} me-1"></i>
                    {{abo.statut || 'Inactif'}}
                  </span>
                  <span class="abo-montant">{{abo.montant || 0}} DT</span>
                  <button class="btn btn-sm btn-outline-primary" (click)="sendRenewalAlert(abo)" title="Envoyer alerte renouvellement">
                    <i class="bi bi-bell"></i>
                  </button>
                </div>
              </div>
              }
              @if (abonnements.length === 0) {
                <div class="empty">Aucun abonnement</div>
              }
            </div>
          </div>

          @if (showAddDialog) {
            <div class="dialog-overlay" (click)="closeDialog()">
              <div class="dialog-container" (click)="$event.stopPropagation()">
                <div class="dialog-title-bar">
                  <div class="title-content">
                    <i class="bi bi-plus-circle"></i>
                    <span>Nouvel Abonnement</span>
                  </div>
                  <button class="btn btn-sm btn-light close-btn" (click)="closeDialog()">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>

                <div class="dialog-scroll-content">
                  <div class="form-section">
                    <label class="section-label">Informations de l'abonnement</label>

                    <div class="mb-3">
                      <label class="form-label">Société</label>
                      <select class="form-select" [(ngModel)]="newAbo.societeId">
                        <option [value]=""><em>Sélectionner une société</em></option>
                        @for (s of societes; track s.id) {
                          <option [value]="s.id">
                            {{s.nom}}
                          </option>
                        }
                      </select>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Plan</label>
                      <select class="form-select" [(ngModel)]="newAbo.planId">
                        <option [value]=""><em>Sélectionner un plan</em></option>
                        @for (p of plans; track p.id) {
                          <option [value]="p.id">
                            {{p.nom}} - {{p.prix}} DT/mois
                          </option>
                        }
                      </select>
                    </div>
                  </div>

                  @if (selectedPlanForForm) {
                    <div class="plan-summary">
                      <div class="summary-header">
                        <i class="bi bi-info-circle"></i>
                        <span>Détails du plan sélectionné</span>
                      </div>
                      <div class="summary-grid">
                        <div class="summary-item">
                          <span class="label">Utilisateurs</span>
                          <span class="value">{{selectedPlanForForm.utilisateurs === -1 ? 'Illimité' : selectedPlanForForm.utilisateurs}}</span>
                        </div>
                        <div class="summary-item">
                          <span class="label">Stockage</span>
                          <span class="value">{{selectedPlanForForm.stockage}}</span>
                        </div>
                        <div class="summary-item highlight">
                          <span class="label">Prix mensuel</span>
                          <span class="value">{{selectedPlanForForm.prix}} DT</span>
                        </div>
                      </div>
                    </div>
                  }

                  <div class="form-section">
                    <label class="section-label">Période</label>

                    <div class="mb-3">
                      <label class="form-label">Date de début</label>
                      <input type="date" class="form-control" [(ngModel)]="newAbo.dateDebut">
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Durée</label>
                      <select class="form-select" [(ngModel)]="newAbo.dureeMois">
                        <option [value]="1">1 mois</option>
                        <option [value]="3">3 mois</option>
                        <option [value]="6">6 mois</option>
                        <option [value]="12">12 mois</option>
                        <option [value]="24">24 mois</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-section">
                    <label class="section-label">Options supplémentaires</label>

                    <div class="mb-3">
                      <label class="form-label">Mode de paiement</label>
                      <select class="form-select" [(ngModel)]="newAbo.modePaiement">
                        <option value="mensuel">Mensuel</option>
                        <option value="trimestriel">Trimestriel</option>
                        <option value="annuel">Annuel</option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Notes</label>
                      <textarea class="form-control" [(ngModel)]="newAbo.notes" rows="3" placeholder="Notes optionnelles..."></textarea>
                    </div>
                  </div>

                  @if (newAbo.societeId && newAbo.planId && selectedPlanForForm) {
                    <div class="summary-preview">
                      <div class="preview-title">
                        <i class="bi bi-receipt"></i>
                        <span>Récapitulatif</span>
                      </div>
                      <div class="preview-content">
                        <div class="preview-line">
                          <span>Société:</span>
                          <strong>{{getSelectedSocieteNom()}}</strong>
                        </div>
                        <div class="preview-line">
                          <span>Plan:</span>
                          <strong>{{selectedPlanForForm.nom}}</strong>
                        </div>
                        <div class="preview-line">
                          <span>Durée:</span>
                          <strong>{{newAbo.dureeMois}} mois</strong>
                        </div>
                        <div class="preview-line total">
                          <span>Total:</span>
                          <strong>{{selectedPlanForForm.prix * newAbo.dureeMois}} DT</strong>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div class="dialog-actions">
                  <button class="btn btn-outline-secondary" (click)="closeDialog()" class="cancel-btn">
                    Annuler
                  </button>
                  <button class="btn btn-primary" (click)="createAbonnement()" class="submit-btn" [disabled]="!isFormValid()">
                    <i class="bi bi-check me-2"></i>Créer l'abonnement
                  </button>
                </div>
              </div>
            </div>
          }

        <div class="tab-pane fade" id="societes">
          <div class="tab-content">
            <h3>Sociétés enregistrées</h3>
            <div class="abo-list">
              @for (s of societes; track s.id) {
                <div class="card abo-card border-0 shadow-sm">
                  <div class="card-body d-flex align-items-center gap-3">
                    <div class="abo-avatar">{{s.nom?.charAt(0) || 'S'}}</div>
                    <div class="abo-info flex-grow-1">
                    <strong>{{s.nom}}</strong>
                    <span class="text-muted">ID: {{s.id}} | {{s.adresse || 'Adresse non définie'}}</span>
                  </div>
                  <span class="badge rounded-pill" [class.bg-success]="s.actif" [class.bg-secondary]="!s.actif">
                    <i class="bi bi-{{s.actif ? 'check-circle' : 'x-circle'}} me-1"></i>
                    {{s.actif ? 'Active' : 'Inactive'}}
                  </span>
                </div>
              </div>
              }
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="factures">
          <div class="tab-content">
            <div class="factures-header">
              <h3>Historique des factures</h3>
              <button class="btn btn-primary" (click)="exportAllPDF()">
                <i class="bi bi-download me-2"></i>Exporter tout en PDF
              </button>
            </div>
            <div class="facture-list">
              @for (f of factures; track f.id) {
                <div class="card facture-card border-0 shadow-sm">
                  <div class="card-body d-flex align-items-center gap-3">
                    <i class="bi bi-receipt text-primary"></i>
                    <div class="flex-grow-1">
                      <strong>{{f.numero}}</strong>
                      <span class="text-muted">{{f.societeId}} - {{f.societeNom}}</span>
                    </div>
                  <span class="facture-montant">{{f.montant}} DT</span>
                  <span class="badge rounded-pill" [class.bg-success]="f.statut === 'Payée' || f.statut === 'Payé'" [class.bg-danger]="f.statut !== 'Payée' && f.statut !== 'Payé'">{{f.statut}}</span>
                  <button class="btn btn-sm btn-outline-primary download-btn" (click)="exportPDF(f)" title="Télécharger PDF">
                    <i class="bi bi-download"></i>
                  </button>
                </div>
              </div>
              }
              @if (factures.length === 0) {
                <div class="empty">Aucune facture</div>
              }
            </div>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .abo-container { padding: 24px; }

    .abo-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, #6a1b9a, #4a148c);
      border-radius: 12px;
      color: white;
      margin-bottom: 24px;
    }
    .header-icon {
      width: 52px; height: 52px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-icon mat-icon { font-size: 28px; }
    h1 { margin: 0; font-size: 24px; font-weight: 700; }
    p { margin: 4px 0 0; opacity: 0.8; }

    .abo-tabs { background: white; border-radius: 12px; }
    .tab-content { padding: 24px; }
    h3 { margin: 0 0 20px; font-size: 18px; font-weight: 600; }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .plan-card {
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      position: relative;
    }
    .plan-card.populaire { border: 2px solid #7b1fa2; }
    .popular-badge {
      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
      background: #7b1fa2; color: white; padding: 4px 16px;
      border-radius: 20px; font-size: 12px;
    }
    .plan-icon {
      width: 48px; height: 48px; font-size: 28px;
      background: #f3e5f5; color: #7b1fa2;
      border-radius: 12px; margin: 0 auto 16px;
    }
    .plan-card h4 { margin: 0 0 12px; font-size: 20px; }
    .price { margin-bottom: 16px; }
    .price .amount { font-size: 36px; font-weight: 700; color: #7b1fa2; }
    .price .currency { font-size: 16px; }
    .price .period { color: #888; }
    .limits { margin-bottom: 16px; padding: 12px 0; border-top: 1px solid #eee; }
    .limit { display: flex; align-items: center; justify-content: center; gap: 6px; color: #666; font-size: 13px; margin-bottom: 6px; }
    .limit mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .features { list-style: none; padding: 0; margin: 0; text-align: left; }
    .features li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #666; margin-bottom: 8px; }
    .features li mat-icon { font-size: 16px; width: 16px; height: 16px; color: #4caf50; }
    .plan-action { width: 100%; margin-top: 16px; border-color: #7b1fa2; color: #7b1fa2; }

    .abo-list, .facture-list { display: flex; flex-direction: column; gap: 12px; }
    .abo-card {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 20px; border-radius: 10px;
    }
    .abo-avatar {
      width: 44px; height: 44px;
      background: #7b1fa2; color: white;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 600;
    }
    .abo-info { flex: 1; display: flex; flex-direction: column; }
    .abo-info strong { font-size: 15px; }
    .abo-info .abo-id { font-size: 10px; color: #999; font-family: monospace; }
    .abo-info .abo-plan { font-size: 12px; color: #888; }
    .abo-info .abo-contact { font-size: 11px; color: #666; font-style: italic; }
    .abo-info .abo-admin { font-size: 11px; color: #1976d2; font-weight: 500; }
    .abo-details { display: flex; flex-direction: column; gap: 4px; }
    .abo-users, .abo-period { font-size: 11px; color: #888; display: flex; align-items: center; gap: 4px; }
    .abo-users mat-icon, .abo-period mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .abo-montant { font-size: 18px; font-weight: 700; color: #7b1fa2; }

    .abo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .abo-header h3 { margin: 0; }
    .abo-header button { background: #7b1fa2; }

    .abo-card button { margin-left: 8px; }
    .delete-btn { color: #c62828; }

    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .dialog-container {
      width: 560px;
      max-height: 90vh;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .dialog-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      background: linear-gradient(135deg, #d32f2f, #b71c1c);
      color: white;
    }

    .title-content {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      font-weight: 600;
    }

    .title-content mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .close-btn {
      color: white;
      opacity: 0.8;
    }

    .close-btn:hover {
      opacity: 1;
    }

    .dialog-scroll-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .form-section {
      margin-bottom: 24px;
    }

    .section-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #000;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }

    .plan-summary {
      background: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #000;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .summary-item {
      text-align: center;
    }

    .summary-item .label {
      display: block;
      font-size: 11px;
      color: #333;
    }

    .summary-item .value {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #000;
    }

    .summary-item.highlight .value {
      color: #000;
      font-size: 18px;
    }

    .summary-preview {
      background: #f5f5f5;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .preview-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #000;
      margin-bottom: 12px;
    }

    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .preview-line {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }

    .preview-line span {
      color: #333;
    }

    .preview-line.total {
      border-top: 1px solid #ddd;
      padding-top: 8px;
      margin-top: 4px;
      font-size: 15px;
    }

    .preview-line.total span,
    .preview-line.total strong {
      color: #000;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #eee;
      background: #fafafa;
    }

    .cancel-btn {
      border-radius: 8px;
    }

    .submit-btn {
      background: #d32f2f;
      border-radius: 8px;
    }

    .submit-btn:disabled {
      background: #ccc;
    }

    .full-width { width: 100%; margin-bottom: 8px; }

    .chip-active { background: #e8f5e9; color: #2e7d32; }
    .chip-inactive { background: #ffebee; color: #c62828; }

    .facture-card {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 20px; border-radius: 10px;
    }
    .facture-card mat-icon { color: #7b1fa2; font-size: 24px; }
    .facture-card div { flex: 1; display: flex; flex-direction: column; }
    .facture-card strong { font-size: 15px; }
    .facture-card span { font-size: 12px; color: #888; }
    .facture-montant { font-size: 18px; font-weight: 700; }

    .factures-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .factures-header h3 { margin: 0; }
    .factures-header button { background: #7b1fa2; }

    .download-btn { color: #7b1fa2; }

    .empty { text-align: center; color: #888; padding: 40px; }

    @media (max-width: 900px) {
      .plans-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SuperAdminAbonnementsComponent implements OnInit {
  private api = inject(ApiService);

  plans = [
    { id: 'starter', nom: 'Starter', prix: 99, periode: 'mois', utilisateurs: 5, stockage: '5Go', features: ['Gestion des tâches', '1 projet', 'Support par email', '5 utilisateurs'], actif: true },
    { id: 'pro', nom: 'Professionnel', prix: 299, periode: 'mois', utilisateurs: 20, stockage: '50Go', features: ['Gestion complète', 'Projets illimités', 'Support prioritaire', '20 utilisateurs', 'Chat interne', 'Rapports avancés'], actif: true, populaire: true },
    { id: 'enterprise', nom: 'Enterprise', prix: 599, periode: 'mois', utilisateurs: -1, stockage: 'Illimité', features: ['Toutes les fonctionnalités', 'Support 24/7', 'Utilisateurs illimités', 'API access', 'Formation incluse', 'Manager dédié'], actif: true }
  ];

  societes: any[] = [];
  abonnements: any[] = [];
  abonnementsFull: any[] = [];
  factures: any[] = [];
  showAddDialog = false;
  newAbo: any = { societeId: '', planId: '', dateDebut: '', notes: '', dureeMois: 12, modePaiement: 'mensuel' };
  selectedPlanForForm: any = null;
  selectedSocieteForForm: any = null;
  filterSocieteId = '';
  filterModePaiement = '';
  filterPlan = '';

  closeDialog() {
    this.showAddDialog = false;
    this.resetForm();
  }

  resetForm() {
    this.newAbo = { societeId: '', planId: '', dateDebut: '', notes: '', dureeMois: 12, modePaiement: 'mensuel' };
    this.selectedPlanForForm = null;
    this.selectedSocieteForForm = null;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getSocietes().subscribe({
      next: (data) => { 
        this.societes = data || [];
        this.loadAllAbonnements();
        this.loadFactures();
      },
      error: () => { 
        this.societes = [];
        this.loadAllAbonnements();
        this.loadFactures();
      }
    });
  }

  loadAllAbonnements() {
    this.api.getAbonnements().subscribe({
      next: (abos) => {
        const abosList = abos || [];
        const societesMap = new Map((this.societes || []).map((s: any) => [s.id, s.nom]));
        
        let allAbonnements: any[] = [];
        
        abosList.filter((abo: any) => abo.actif).forEach((abo: any) => {
          const societeNom = abo.societeNom || societesMap.get(abo.societeId) || 'Société';
          const coordonnees = societeNom !== 'Société' ? `${societeNom}` : '';
          const adminInfo = abo.adminNom ? `${abo.adminNom} (${abo.adminEmail || 'Sans email'})` : 'Admin';
          
          allAbonnements.push({
            id: abo.id || 'ABO-' + abo.societeId,
            societeId: abo.societeId,
            societeNom: societeNom,
            societeIdDisplay: abo.societeId,
            plan: abo.typeAbonnement || abo.type,
            planNom: abo.typeAbonnement || abo.type,
            nbUsers: abo.nbUsers,
            coordonnees: coordonnees.trim(),
            adminPar: adminInfo,
            montant: abo.prix || abo.Prix,
            modePaiement: 'Mensuel',
            statut: abo.actif ? 'Actif' : 'Inactif',
            prix: abo.prix || abo.Prix,
            dateDebut: abo.dateDebut ? new Date(abo.dateDebut).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
            dateFin: abo.dateFin ? new Date(abo.dateFin).toLocaleDateString('fr-FR') : ''
          });
        });
        
        this.abonnementsFull = allAbonnements;
        this.applyFilters();
      }
    });
  }

  loadFactures() {
    this.api.getSocietes().subscribe({
      next: (societes) => {
        const societesMap = new Map((societes || []).map((s: any) => [s.id, s.nom]));
        
        this.api.getPaiements().subscribe({
          next: (paiements) => {
            this.factures = (paiements || []).map((p: any) => ({
              id: p.id,
              numero: p.id,
              societeId: p.societeId,
              societeNom: p.societeNom || societesMap.get(p.societeId) || 'Société',
              description: p.description,
              montant: p.montant,
              date: p.date ? new Date(p.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
              statut: p.statut || 'Payé',
              type: p.type
            }));
          },
          error: () => {
            const storage = this.api.getRawStorage();
            const localPaiements = storage.paiements || [];
            this.factures = localPaiements.map((p: any) => ({
              id: p.id || 'PAY-' + Date.now(),
              numero: p.id || 'PAY-' + Date.now(),
              societeId: p.societeId,
              societeNom: p.societeNom || societesMap.get(p.societeId) || 'Société',
              description: p.description,
              montant: p.montant,
              date: p.date ? new Date(p.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
              statut: p.statut || 'Payé',
              type: p.type
            }));
          }
        });
      },
      error: () => {
        this.loadFacturesFromStorage();
      }
    });
  }

  loadFacturesFromStorage() {
    const storage = this.api.getRawStorage();
    const localPaiements = storage.paiements || [];
    const societesMap = new Map((storage.societes || []).map((s: any) => [s.id, s.nom]));
    this.factures = localPaiements.map((p: any) => ({
      id: p.id || 'PAY-' + Date.now(),
      numero: p.id || 'PAY-' + Date.now(),
      societeId: p.societeId,
      societeNom: p.societeNom || societesMap.get(p.societeId) || 'Société',
      description: p.description,
      montant: p.montant,
      date: p.date ? new Date(p.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
      statut: p.statut || 'Payé',
      type: p.type
    }));
  }

  applyFilters() {
    let filtered = [...this.abonnementsFull];
    
    if (this.filterSocieteId) {
      filtered = filtered.filter((a: any) => a.societeId === this.filterSocieteId);
    }
    if (this.filterModePaiement) {
      filtered = filtered.filter((a: any) => a.modePaiement === this.filterModePaiement);
    }
    if (this.filterPlan) {
      filtered = filtered.filter((a: any) => a.plan === this.filterPlan);
    }
    
    this.abonnements = filtered;
  }
  
  private getStorage(): any {
    const data = localStorage.getItem('app_data');
    return data ? JSON.parse(data) : {};
  }

  getLocalStorageData(): any {
    const data = localStorage.getItem('app_data');
    return data ? JSON.parse(data) : {};
  }

  getPlanIcon(id: string): string {
    const icons: { [key: string]: string } = { 'basic': 'star_outline', 'pro': 'star_half', 'enterprise': 'stars' };
    return icons[id] || 'star';
  }

  editPlan(plan: any) {
    const prix = prompt(`Modifier le prix pour ${plan.nom}:`, plan.prix.toString());
    if (prix && !isNaN(Number(prix))) {
      plan.prix = Number(prix);
      alert('Plan modifié');
    }
  }

  deletePlan(plan: any) {
    if (confirm(`Supprimer le plan ${plan.nom}?`)) {
      this.plans = this.plans.filter(p => p.id !== plan.id);
      alert('Plan supprimé');
    }
  }

  addPlan() {
    const nom = prompt('Nom du nouveau plan:');
    if (nom) {
      const prix = Number(prompt('Prix:', '299'));
      const utilisateurs = Number(prompt('Nombre utilisateurs:', '20'));
      const stockage = prompt('Stockage:', '25Go') || '25Go';
      this.plans.push({
        id: 'custom_' + Date.now(),
        nom: nom,
        prix: prix,
        periode: 'mois',
        utilisateurs: utilisateurs,
        stockage: stockage,
        features: ['Gestion de base'],
        actif: true
      });
      alert('Plan créé');
    }
  }

  onPlanChange(planId: string) {
    this.selectedPlanForForm = this.plans.find(p => p.id === planId);
  }

  onSocieteChange(societeId: string) {
    this.selectedSocieteForForm = this.societes.find(s => s.id === societeId);
  }

  getSelectedSocieteNom(): string {
    if (this.selectedSocieteForForm) return this.selectedSocieteForForm.nom;
    const s = this.societes.find(x => x.id === this.newAbo.societeId);
    return s ? s.nom : '';
  }

  isFormValid(): boolean {
    return !!(this.newAbo.societeId && this.newAbo.planId);
  }

  calculateDateFin(dateDebut: string): string {
    if (!dateDebut) return '';
    const date = new Date(dateDebut);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }

  saveToLocalStorage() {
    const data = localStorage.getItem('app_data') || '{}';
    const parsed = JSON.parse(data);
    parsed.abonnements = this.abonnements;
    localStorage.setItem('app_data', JSON.stringify(parsed));
  }

  createAbonnement() {
    if (!this.isFormValid()) {
      alert('Veuillez compléter tous les champs obligatoires');
      return;
    }
    
    const societeNom = this.getSelectedSocieteNom();
    const plan = this.selectedPlanForForm || this.plans.find(p => p.id === this.newAbo.planId);
    const planNom = plan ? plan.nom : 'Plan';
    const montant = (plan ? plan.prix : 0) * (this.newAbo.dureeMois || 12);
    
    const newAboData = {
      societeId: this.newAbo.societeId,
      societeNom: societeNom,
      type: this.newAbo.planId,
      nbUsers: this.newAbo.nbUsers || 10,
      prix: montant,
      dateDebut: this.newAbo.dateDebut,
      dateFin: this.calculateDateFin(this.newAbo.dateDebut),
      actif: true
    };
    
    this.api.createAbonnement(newAboData).subscribe({
      next: (res: any) => {
        this.abonnements.push({
          id: res.id || res,
          societeId: this.newAbo.societeId,
          societeNom: societeNom,
          planId: this.newAbo.planId,
          planNom: planNom,
          montant: montant,
          dateDebut: this.newAbo.dateDebut,
          dateFin: this.calculateDateFin(this.newAbo.dateDebut),
          notes: this.newAbo.notes || '',
          modePaiement: this.newAbo.modePaiement || 'mensuel',
          dureeMois: this.newAbo.dureeMois || 12,
          statut: 'Actif'
        });
        
        this.api.sendNotification({
          type: 'app_ABONNEMENT',
          societeId: this.newAbo.societeId,
          societeNom: societeNom,
          description: `Nouvelle abonnement ${planNom}`,
          montant: montant
        }).subscribe();
        
        alert('Abonnement créé: ' + societeNom + ' - ' + planNom);
      },
      error: () => {
        this.abonnements.push({
          id: Date.now().toString(),
          societeId: this.newAbo.societeId,
          societeNom: societeNom,
          planId: this.newAbo.planId,
          planNom: planNom,
          montant: montant,
          dateDebut: this.newAbo.dateDebut,
          dateFin: this.calculateDateFin(this.newAbo.dateDebut),
          notes: this.newAbo.notes || '',
          modePaiement: this.newAbo.modePaiement || 'mensuel',
          dureeMois: this.newAbo.dureeMois || 12,
          statut: 'Actif'
        });
        this.saveToLocalStorage();
        alert('Abonnement créé (hors ligne)');
      }
    });
    
    this.showAddDialog = false;
    this.newAbo = { societeId: '', planId: '', dateDebut: '', notes: '', dureeMois: 12, modePaiement: 'mensuel' };
    this.selectedPlanForForm = null;
    this.selectedSocieteForForm = null;
  }

  exportPDF(facture: any) {
    const content = `
FACTURE ${facture.numero}
========================
Société: ${facture.societeNom}
Date: ${facture.date}
Montant: ${facture.montant} DT
Statut: ${facture.statut}

========================
Nouveau - Gestion d'Entreprise
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${facture.numero}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  sendRenewalAlert(abo: any) {
    this.api.sendNotification({
      utilisateurId: abo.adminId || abo.societeId,
      type: 'renewal_alert',
      description: `⚠️ Alerte: Votre abonnement arrive à expiration. Veuillez renouvelle votre plan.`,
      societeId: abo.societeId,
      societeNom: abo.societeNom,
      montant: 0
    }).subscribe({
      next: () => {
        alert(`Alerte de renouvellement envoyée à ${abo.societeNom}`);
      },
      error: () => {
        const storage = this.api.getRawStorage();
        if (!storage.conversations) storage.conversations = {};
        
        const adminKey = abo.adminId || abo.societeId;
        if (!storage.conversations[adminKey]) {
          storage.conversations[adminKey] = [];
        }
        
        storage.conversations[adminKey].push({
          id: Date.now().toString(),
          text: `⚠️ Alerte: Votre abonnement arrive à expiration. Veuillez renouvelle votre plan.`,
          from: 'SUPER_ADMIN',
          fromName: 'Super Admin',
          fromRole: 'Super Administrateur',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString()
        });
        
        localStorage.setItem('app_data', JSON.stringify(storage));
        alert(`Alerte envoyée à ${abo.societeNom}`);
      }
    });
  }

  editAbonnement(abo: any) {
    const newPlan = prompt(`Modifier le plan pour ${abo.societeNom}:\n1: Basic (199 DT)\n2: Pro (499 DT)\n3: Enterprise (999 DT)`);
    if (newPlan) {
      const plans: any = { '1': { nom: 'Basic', prix: 199 }, '2': { nom: 'Pro', prix: 499 }, '3': { nom: 'Enterprise', prix: 999 } };
      if (plans[newPlan]) {
        abo.planNom = plans[newPlan].nom;
        abo.montant = plans[newPlan].prix;
        alert('Abonnement modifié');
      }
    }
  }

  deleteAbonnement(abo: any) {
    if (confirm(`Supprimer l'abonnement de ${abo.societeNom}?`)) {
      this.abonnements = this.abonnements.filter(a => a.id !== abo.id);
      alert('Abonnement supprimé');
    }
  }

  openAddDialog() {
    this.resetForm();
    if (this.societes.length === 0) {
      this.loadData();
      setTimeout(() => {
        this.showAddDialog = true;
      }, 500);
    } else {
      this.showAddDialog = true;
    }
  }

  exportAllPDF() {
    let content = 'HISTORIQUE DES FACTURES\n========================\n\n';
    
    this.factures.forEach(f => {
      content += `Facture: ${f.numero}\n`;
      content += `Société: ${f.societeNom}\n`;
      content += `Montant: ${f.montant} DT\n`;
      content += `Statut: ${f.statut}\n`;
      content += '------------------------\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factures-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
