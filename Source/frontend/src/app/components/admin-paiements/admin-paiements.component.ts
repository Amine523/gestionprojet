import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Plan {
  id: string;
  nom: string;
  prix: number;
  utilisateurs: string;
  features: string[];
  periods?: { monthly: number; quarterly: number; yearly: number };
}

@Component({
  selector: 'app-admin-paiements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-credit-card" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Paiements & Abonnements</h1>
          <p class="mb-0" style="opacity: 0.8;">Gérez vos paiements et abonnements - {{societeNom}}</p>
        </div>
      </div>

      @if (!abonnement) {
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <h2 class="fw-bold">Choisissez votre abonnement</h2>
              <p class="text-muted">Sélectionnez le plan qui correspond à vos besoins</p>
            </div>

            <div class="row g-4">
              @for (plan of plans; track plan.id) {
                <div class="col-md-4">
                  <div class="card h-100 border-2" [class.border-primary]="selectedPlan?.id === plan.id" [class.border-0]="selectedPlan?.id !== plan.id" style="cursor: pointer;" (click)="selectPlan(plan)">
                    <div class="card-body">
                      <div class="text-center mb-3">
                        <i class="bi bi-{{getPlanIcon(plan.id)}}" style="font-size: 32px; color: #667eea;"></i>
                        <h5 class="fw-bold mt-2">{{plan.nom}}</h5>
                      </div>
                      <div class="text-center mb-3">
                        <span class="fw-bold" style="font-size: 32px;">{{plan.prix}}</span>
                        <span class="text-muted">DT/mois</span>
                      </div>
                      <div class="mb-3">
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="period_{{plan.id}}" [(ngModel)]="selectedPeriod" (change)="updatePrice()" value="monthly" id="monthly_{{plan.id}}">
                          <label class="form-check-label" for="monthly_{{plan.id}}">Mensuel</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="period_{{plan.id}}" [(ngModel)]="selectedPeriod" (change)="updatePrice()" value="quarterly" id="quarterly_{{plan.id}}">
                          <label class="form-check-label" for="quarterly_{{plan.id}}">Trimestriel</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="period_{{plan.id}}" [(ngModel)]="selectedPeriod" (change)="updatePrice()" value="yearly" id="yearly_{{plan.id}}">
                          <label class="form-check-label" for="yearly_{{plan.id}}">Annuel (-{{getDiscount()}}%)</label>
                        </div>
                      </div>
                      <div class="text-center mb-3">
                        <i class="bi bi-people me-2"></i>
                        <span>{{plan.utilisateurs}}</span>
                      </div>
                      <ul class="list-unstyled mb-3">
                        @for (feature of plan.features; track feature) {
                          <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>{{feature}}</li>
                        }
                      </ul>
                      @if (selectedPlan?.id === plan.id) {
                        <div class="text-center">
                          <span class="badge bg-primary"><i class="bi bi-check me-1"></i>Sélectionné</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            @if (selectedPlan) {
              <div class="text-center mt-4">
                <button class="btn btn-primary btn-lg" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="goToPaymentMethod()">
                  <i class="bi bi-arrow-right me-2"></i>Continuer vers le paiement
                </button>
              </div>
            }
          </div>
        </div>
      }

      @if (selectedPlan && !paymentCompleted) {
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <div class="mb-4">
              <h2 class="fw-bold">Méthode de paiement</h2>
              <p class="text-muted">Ajoutez un moyen de paiement pour finaliser votre abonnement</p>
            </div>

            <div class="payment-form">
              <div class="mb-3">
                <label class="form-label">Type de paiement</label>
                <select class="form-select" [(ngModel)]="newPayment.type">
                  <option value="card">Carte bancaire</option>
                  <option value="virement">Virement bancaire</option>
                </select>
              </div>

              @if (newPayment.type === 'card') {
                <div class="mb-3">
                  <label class="form-label">Numéro de carte</label>
                  <input type="text" class="form-control" [(ngModel)]="newPayment.numero" placeholder="1234 5678 9012 3456">
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Expiration</label>
                    <input type="text" class="form-control" [(ngModel)]="newPayment.expiration" placeholder="MM/YY">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">CVV</label>
                    <input type="text" class="form-control" [(ngModel)]="newPayment.cvv" placeholder="123">
                  </div>
                </div>
              } @else if (newPayment.type === 'virement') {
                <div class="mb-3">
                  <label class="form-label">IBAN</label>
                  <input type="text" class="form-control" [(ngModel)]="newPayment.iban" placeholder="TN59 1234 5678 9012 3456 7890">
                </div>
              }

              @if (paymentMethods.length > 0) {
                <div class="saved-methods-section mt-4">
                  <h5 class="fw-bold mb-3">Moyens de paiement enregistrés</h5>
                  @for (method of paymentMethods; track method.id) {
                    <div class="card mb-2" [class.border-primary]="selectedPaymentMethod?.id === method.id" style="cursor: pointer;" (click)="selectPaymentMethod(method)">
                      <div class="card-body d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-3">
                          <i class="bi bi-{{method.type === 'card' ? 'credit-card' : 'bank'}}" style="font-size: 24px; color: #667eea;"></i>
                          <div>
                            <div class="fw-bold">{{method.nom}}</div>
                            <div class="text-muted small">{{method.details}}</div>
                          </div>
                        </div>
                        @if (selectedPaymentMethod?.id === method.id) {
                          <i class="bi bi-check-circle-fill text-success" style="font-size: 24px;"></i>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              <button class="btn btn-primary w-100 mt-3" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="savePaymentMethod()" [disabled]="!isPaymentMethodValid()">
                <i class="bi bi-save me-2"></i>Enregistrer le moyen de paiement
              </button>
            </div>
          </div>

          @if (paymentMethodSaved) {
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body p-4">
                <h4 class="fw-bold mb-4">Récapitulatif de la commande</h4>
                <div class="row mb-3">
                  <div class="col-6 text-muted">Plan sélectionné:</div>
                  <div class="col-6 text-end fw-bold">{{selectedPlan.nom}}</div>
                </div>
                <div class="row mb-3">
                  <div class="col-6 text-muted">Période:</div>
                  <div class="col-6 text-end">{{getPeriodLabel()}}</div>
                </div>
                <div class="row mb-3">
                  <div class="col-6 text-muted">Prix:</div>
                  <div class="col-6 text-end fw-bold text-primary">{{getCurrentPrice()}} DT</div>
                </div>
                <div class="row mb-3">
                  <div class="col-6 text-muted">Utilisateurs:</div>
                  <div class="col-6 text-end">{{selectedPlan.utilisateurs}}</div>
                </div>
                <div class="row mb-3">
                  <div class="col-6 text-muted">Moyen de paiement:</div>
                  <div class="col-6 text-end">
                    @if (selectedPaymentMethod) {
                      {{selectedPaymentMethod.type === 'card' ? 'Carte ****' + selectedPaymentMethod.nom?.slice(-4) : 'Virement bancaire'}}
                    } @else {
                      {{newPayment.type === 'card' ? 'Carte bancaire' : 'Virement bancaire'}}
                    }
                  </div>
                </div>
                <hr class="my-4">
                <div class="row mb-4">
                  <div class="col-6 fw-bold fs-5">Total à payer:</div>
                  <div class="col-6 text-end fw-bold fs-4 text-primary">{{getCurrentPrice()}} DT</div>
                </div>
                <button class="btn btn-primary btn-lg w-100" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="processPayment()" [disabled]="!canProcessPayment()">
                  <i class="bi bi-credit-card me-2"></i>Payer maintenant
                </button>
              </div>
            </div>
          }
        </div>
      }

      @if (abonnement) {
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="d-flex align-items-center gap-3">
                <i class="bi bi-star-fill text-warning" style="font-size: 32px;"></i>
                <div>
                  <h3 class="fw-bold mb-0">Mon Abonnement</h3>
                  <span class="text-muted">{{abonnement.plan}}</span>
                </div>
              </div>
              <span class="badge rounded-pill" [class.bg-success]="abonnement.statut === 'Actif'" [class.bg-warning]="abonnement.statut !== 'Actif'">{{abonnement.statut}}</span>
            </div>
            
            <div class="row mb-4">
              <div class="col-md-6 mb-3">
                <div class="text-muted small">Date début:</div>
                <div class="fw-bold">{{abonnement.dateDebut}}</div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="text-muted small">Prochain renouvellement:</div>
                <div class="fw-bold">{{abonnement.prochainRenouvellement}}</div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="text-muted small">Prix mensuel:</div>
                <div class="fw-bold text-primary">{{abonnement.prix}} DT</div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="text-muted small">Utilisateurs inclus:</div>
                <div class="fw-bold">{{abonnement.utilisateurs}}</div>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="processPayment()">
                <i class="bi bi-arrow-clockwise me-2"></i>Renouveler
              </button>
              <button class="btn btn-outline-secondary" (click)="voirHistorique()">
                <i class="bi bi-clock-history me-2"></i>Historique
              </button>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-4">Historique des transactions</h4>
            
            @if (transactions.length > 0) {
              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (t of transactions; track t.id) {
                      <tr>
                        <td>{{t.date}}</td>
                        <td>{{t.description}}</td>
                        <td class="fw-bold text-primary">{{t.montant}} DT</td>
                        <td>
                          <span class="badge rounded-pill" [class.bg-success]="t.statut === 'Succès'" [class.bg-warning]="t.statut !== 'Succès'">{{t.statut}}</span>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary" (click)="telechargerRecu(t)">
                            <i class="bi bi-download"></i>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="text-center py-5 text-muted">
                <i class="bi bi-receipt" style="font-size: 48px;"></i>
                <p class="mt-3">Aucune transaction</p>
              </div>
            }
          </div>
        </div>
      }

      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">Moyens de paiement</h4>
            <button class="btn btn-primary" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="ajouterMoyen()">
              <i class="bi bi-plus-lg me-2"></i>Ajouter
            </button>
          </div>
          
          @if (paymentMethods.length > 0) {
            <div class="list-group">
              @for (method of paymentMethods; track method.id) {
                <div class="list-group-item d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-3">
                    <i class="bi bi-{{method.type === 'card' ? 'credit-card' : 'bank'}}" style="font-size: 24px; color: #667eea;"></i>
                    <div>
                      <div class="fw-bold">{{method.nom}}</div>
                      <div class="text-muted small">{{method.details}}</div>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    @if (method.defaut) {
                      <span class="badge bg-info">Par défaut</span>
                    }
                    <button class="btn btn-sm btn-outline-warning" (click)="setDefault(method)" title="Définir par défaut">
                      <i class="bi bi-star"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="supprimerMoyen(method)" title="Supprimer">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-5 text-muted">
              <i class="bi bi-credit-card" style="font-size: 48px;"></i>
              <p class="mt-3">Aucun moyen de paiement enregistré</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .paiements-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #1a1a2e; }
    .page-header p { margin: 0; color: #666; }

    .plans-card, .payment-card, .summary-card { margin-bottom: 24px; }
    .card-header { padding: 20px 24px; border-bottom: 1px solid #eee; }
    .card-header h2 { margin: 0 0 8px; font-size: 18px; font-weight: 600; }
    .card-header p { margin: 0; color: #666; font-size: 14px; }

    .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 24px; }
    .plan-card { border: 2px solid #e0e0e0; border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s; position: relative; }
    .plan-card:hover { border-color: #1976d2; transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .plan-card.selected { border-color: #1976d2; background: linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.02)); }
    
    .plan-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .plan-icon { color: #1976d2; font-size: 32px; }
    .plan-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
    
    .plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 12px; }
    .plan-price .price { font-size: 36px; font-weight: 700; color: #1976d2; }
    .plan-price .currency { font-size: 16px; color: #666; }
    .plan-price .period { font-size: 14px; color: #999; }
    
    .plan-users { display: flex; align-items: center; gap: 8px; color: #666; margin-bottom: 16px; }
    
    .plan-features { list-style: none; padding: 0; margin: 0; }
    .plan-features li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; margin-bottom: 8px; }
    .plan-features mat-icon { color: #4caf50; font-size: 18px; width: 18px; height: 18px; }
    
    .selected-badge { position: absolute; top: 12px; right: 12px; background: #1976d2; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: flex; align-items: center; gap: 4px; }
    
    .plan-actions { padding: 20px 24px; border-top: 1px solid #eee; }
    .continue-btn { background: #1976d2; color: white; }
    .continue-btn mat-icon { margin-left: 8px; }

    .payment-form { padding: 24px; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 16px; }
    .form-row mat-form-field { flex: 1; }
    .save-method-btn { background: #4caf50; color: white; margin-top: 16px; }

    .summary-content { padding: 24px; }
    .summary-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .summary-row .label { color: #666; }
    .summary-row .value { font-weight: 500; }
    .summary-row .value.price { color: #1976d2; font-size: 18px; }
    
    .total-row { display: flex; justify-content: space-between; padding: 20px 0; margin-top: 12px; border-top: 2px solid #eee; }
    .total-label { font-size: 16px; font-weight: 600; }
    .total-price { font-size: 24px; font-weight: 700; color: #1976d2; }
    
    .pay-btn { width: 100%; background: linear-gradient(135deg, #1976d2, #1565c0); color: white; padding: 16px; font-size: 16px; margin-top: 20px; }
    .pay-btn mat-icon { margin-right: 8px; }

    .abonnement-card { margin-bottom: 24px; }
    .abonnement-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee; }
    .abonnement-info { display: flex; align-items: center; gap: 16px; }
    .premium-icon { font-size: 48px; width: 48px; height: 48px; color: #ffd700; }
    .abonnement-info h2 { margin: 0; font-size: 18px; }
    .plan-name { color: #1976d2; font-weight: 600; }
    .statut-actif { background: #e8f5e9; color: #2e7d32; }
    .statut-expire { background: #ffebee; color: #c62828; }
    
    .abonnement-details { padding: 20px; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .detail-label { color: #666; }
    .detail-value { font-weight: 500; }
    .detail-value.prix { font-size: 18px; color: #1976d2; }
    
    .abonnement-actions { padding: 20px; display: flex; gap: 12px; }
    .renew-btn { background: #1976d2; color: white; }

    .transactions-section { margin-bottom: 24px; }
    .transactions-table { width: 100%; }
    .transactions-table .montant { font-weight: 600; color: #1976d2; }

    .methods-card { margin-bottom: 24px; }
    .methods-card .card-header { display: flex; justify-content: space-between; align-items: center; }
    .add-btn { background: #1976d2; color: white; }
    .methods-list { padding: 16px; }
    .method-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 8px; background: #f9f9f9; }
    .method-icon { color: #1976d2; }
    .method-info { flex: 1; display: flex; flex-direction: column; }
    .method-name { font-weight: 500; }
    .method-details { font-size: 12px; color: #666; }
    .default-chip { background: #e3f2fd; color: #1976d2; }

    .empty-card, .empty-list, .empty-table { text-align: center; padding: 48px; }
    .empty-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .empty-list mat-icon, .empty-table mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .contact-btn { background: #1976d2; color: white; }
  `]
})
export class AdminPaiementsComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  societeId: string = '';
  societeNom: string = '';
  currentUser: any = null;

  abonnement: any = null;
  transactions: any[] = [];
  paymentMethods: any[] = [];
  displayedColumns = ['date', 'description', 'montant', 'statut', 'actions'];

  selectedPlan: Plan | null = null;
  selectedPeriod: string = 'monthly';
  selectedPaymentMethod: any = null;
  paymentMethodSaved = false;
  paymentCompleted = false;

  newPayment: any = { type: 'card', numero: '', expiration: '', cvv: '', iban: '' };

  plans: Plan[] = [
    { id: 'starter', nom: 'Starter', prix: 99, utilisateurs: '5 utilisateurs', features: ['Gestion des tâches', '1 projet', 'Support par email', '5 utilisateurs'], periods: { monthly: 99, quarterly: 279, yearly: 990 } },
    { id: 'pro', nom: 'Professionnel', prix: 299, utilisateurs: '20 utilisateurs', features: ['Gestion complète', 'Projets illimités', 'Support prioritaire', '20 utilisateurs', 'Chat interne', 'Rapports avancés'], periods: { monthly: 299, quarterly: 797, yearly: 2691 } },
    { id: 'enterprise', nom: 'Enterprise', prix: 599, utilisateurs: 'Utilisateurs illimités', features: ['Toutes les fonctionnalités', 'Support 24/7', 'Utilisateurs illimités', 'API access', 'Formation incluse', 'Manager dédié'], periods: { monthly: 599, quarterly: 1597, yearly: 5391 } }
  ];

  getCurrentPrice(): number {
    if (!this.selectedPlan) return 0;
    const periods = (this.selectedPlan as any).periods;
    if (!periods) return this.selectedPlan.prix;
    return periods[this.selectedPeriod] || this.selectedPlan.prix;
  }

  getPeriodLabel(): string {
    const labels: any = { monthly: 'Mensuel', quarterly: 'Trimestriel', yearly: 'Annuel' };
    return labels[this.selectedPeriod] || 'Mensuel';
  }

  getDiscount(): number {
    if (!this.selectedPlan) return 0;
    const periods = (this.selectedPlan as any).periods;
    if (!periods) return 0;
    const monthlyTotal = periods.monthly * 12;
    const yearlyPrice = periods.yearly;
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
  }

  getPlanUsers(): string {
    if (!this.selectedPlan) return '';
    const users = this.selectedPlan.utilisateurs;
    if (users === 'Utilisateurs illimités') return '9999';
    const num = users.match(/\d+/);
    return num ? num[0] : '10';
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.currentUser = user;
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || '';
    this.loadData();
    this.checkExpiringSubscriptions();
  }

  checkExpiringSubscriptions() {
    const storage = this.api.getRawStorage();
    const abos = storage.abonnements || [];
    const today = new Date();
    const warningDays = 7;

    const myAbo = abos.find((a: any) => a.societeId === this.societeId);
    if (!myAbo || !myAbo.dateFin) return;

    const endDate = new Date(myAbo.dateFin);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= warningDays && daysUntilExpiry > 0 && !myAbo.notified) {
      this.sendPaymentNotificationToSuperAdmin(
        this.societeNom,
        myAbo.type || 'Plan',
        myAbo.prix || 0,
        myAbo.nbUsers ? `${myAbo.nbUsers} utilisateurs` : 'N/A',
        'RENEWAL'
      );
      
      myAbo.notified = true;
      localStorage.setItem('app_data', JSON.stringify(storage));
    }
  }

  loadData() {
    const storage = this.api.getRawStorage();
    
    const abos = storage.abonnements || [];
    const abo = abos.find((a: any) => a.societeId === this.societeId);
    if (abo) {
      this.abonnement = {
        plan: abo.type || 'Professionnel',
        statut: abo.actif ? 'Actif' : 'Expire',
        dateDebut: abo.dateDebut || new Date().toLocaleDateString('fr-FR'),
        prochainRenouvellement: abo.dateFin || '',
        prix: abo.prix || 0,
        utilisateurs: abo.nbUsers ? `${abo.nbUsers} utilisateurs` : ''
      };
    }

    const paiements = storage.paiements || [];
    this.transactions = paiements.filter((p: any) => p.societeId === this.societeId);
    
    this.paymentMethods = storage.paymentMethods || [];
  }

  getPlanIcon(planId: string): string {
    const icons: any = { 'starter': 'star_outline', 'pro': 'star_half', 'enterprise': 'stars' };
    return icons[planId] || 'star';
  }

  selectPlan(plan: Plan) {
    this.selectedPlan = plan;
    this.paymentMethodSaved = false;
    this.paymentCompleted = false;
  }

  updatePrice() {
    // Price updates automatically via getCurrentPrice()
  }

  goToPaymentMethod() {
    if (!this.selectedPlan) {
      alert('Veuillez sélectionner un abonnement');
      return;
    }
    this.newPayment = { type: 'card', numero: '', expiration: '', cvv: '', iban: '' };
    alert('Sélectionnez un moyen de paiement puis cliquez sur "Enregistrer"');
  }

  isPaymentMethodValid(): boolean {
    console.log('Validating payment method:', this.newPayment);
    if (this.newPayment.type === 'card') {
      const valid = !!(this.newPayment.numero && this.newPayment.expiration && this.newPayment.cvv);
      console.log('Card valid:', valid);
      return valid;
    } else {
      const valid = !!(this.newPayment.iban && this.newPayment.iban.length >= 20);
      console.log('Virement valid:', valid);
      return valid;
    }
  }

  savePaymentMethod() {
    console.log('Saving payment method:', this.newPayment);
    const storage = this.api.getRawStorage();
    console.log('Current storage:', storage);
    
    if (this.newPayment.type === 'card') {
      const method = {
        id: Date.now().toString(),
        type: 'card',
        nom: 'Visa ****' + this.newPayment.numero.slice(-4),
        details: 'Expire ' + this.newPayment.expiration,
        defaut: true,
        numero: this.newPayment.numero,
        expiration: this.newPayment.expiration,
        cvv: this.newPayment.cvv
      };
      this.paymentMethods.push(method);
      storage.paymentMethods.push(method);
    } else if (this.newPayment.type === 'virement' && this.newPayment.iban) {
      const method = {
        id: Date.now().toString(),
        type: 'virement',
        nom: 'Virement bancaire',
        details: 'RIB: ' + this.newPayment.iban,
        defaut: false,
        iban: this.newPayment.iban
      };
      this.paymentMethods.push(method);
      storage.paymentMethods.push(method);
    }
    
    localStorage.setItem('app_data', JSON.stringify(storage));
    this.paymentMethodSaved = true;
    this.selectedPaymentMethod = this.paymentMethods[this.paymentMethods.length - 1];
    alert('Moyen de paiement enregistré');
  }

  canProcessPayment(): boolean {
    if (!this.selectedPlan) return false;
    return (this.selectedPaymentMethod != null) || (this.newPayment.type === 'card' && this.newPayment.numero && this.newPayment.expiration && this.newPayment.cvv) || (this.newPayment.type === 'virement' && this.newPayment.iban);
  }

  selectPaymentMethod(method: any) {
    this.selectedPaymentMethod = method;
    this.paymentMethodSaved = true;
  }

  processPayment() {
    if (!this.selectedPlan) {
      alert('Veuillez sélectionner un abonnement');
      return;
    }

    const currentPrice = this.getCurrentPrice();
    const periodLabel = this.getPeriodLabel();

    const newTransaction = {
      societeId: this.societeId,
      societeNom: this.societeNom,
      description: `Abonnement ${this.selectedPlan.nom} - ${periodLabel} - ${new Date().toLocaleDateString('fr-FR')}`,
      montant: currentPrice,
      date: new Date().toISOString(),
      statut: 'Payé',
      type: 'NEW_SUBSCRIPTION',
      periode: this.selectedPeriod
    };

    this.saveTransactionToStorage(newTransaction);
    this.transactions.unshift({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      description: `Abonnement ${this.selectedPlan.nom} (${periodLabel})`,
      montant: currentPrice,
      statut: 'Payé'
    });

    const newAbonnement = {
      societeId: this.societeId,
      societeNom: this.societeNom,
      adminId: this.currentUser?.id,
      adminNom: this.currentUser?.nom,
      adminEmail: this.currentUser?.email,
      type: this.selectedPlan.nom,
      periode: this.selectedPeriod,
      nbUsers: this.getPlanUsers() ? parseInt(this.getPlanUsers()) : 10,
      prix: currentPrice,
      dateDebut: new Date().toISOString(),
      dateFin: this.getNextMonthDate(),
      actif: true
    };

    this.saveAbonnementToStorage(newAbonnement);

    this.api.createPaiement(newTransaction).subscribe({
      next: () => console.log('Paiement enregistré en base'),
      error: (err) => console.log('Paiement local seulement', err)
    });

    this.api.createAbonnement(newAbonnement).subscribe({
      next: () => {
        console.log('Abonnement enregistré en base');
        if (this.selectedPlan) {
          this.sendPaymentNotificationToSuperAdmin(this.societeNom, this.selectedPlan.nom, this.selectedPlan.prix, this.selectedPlan.utilisateurs);
        }
      },
      error: (err) => console.log('Abonnement local seulement', err)
    });
    
    this.abonnement = {
      plan: this.selectedPlan.nom,
      statut: 'Actif',
      dateDebut: new Date().toLocaleDateString('fr-FR'),
      prochainRenouvellement: this.getNextMonthDate(),
      prix: this.selectedPlan.prix,
      utilisateurs: this.selectedPlan.utilisateurs
    };
    this.paymentCompleted = true;
    alert('Paiement réussi! Abonnement activé.');
  }

  saveTransactionToStorage(transaction: any) {
    const storage = this.api.getRawStorage();
    if (!storage.paiements) storage.paiements = [];
    storage.paiements.push(transaction);
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  saveAbonnementToStorage(abo: any) {
    const storage = this.api.getRawStorage();
    if (!storage.abonnements) storage.abonnements = [];
    const existingIndex = storage.abonnements.findIndex((a: any) => a.societeId === this.societeId);
    if (existingIndex >= 0) {
      storage.abonnements[existingIndex] = abo;
    } else {
      storage.abonnements.push(abo);
    }
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  getNextDate(): string {
    const date = new Date();
    switch (this.selectedPeriod) {
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString();
  }

  getNextMonthDate(): string {
    return this.getNextDate();
  }

  sendPaymentNotificationToSuperAdmin(societeNom: string, planNom: string, prix: number, utilisateurs: any, type: string = 'NEW') {
    const storage = this.api.getRawStorage();
    if (!storage.conversations) storage.conversations = {};
    
    const superAdminKey = 'SUPER_ADMIN';
    if (!storage.conversations[superAdminKey]) {
      storage.conversations[superAdminKey] = [];
    }

    const isRenewal = type === 'RENEWAL';
    const emoji = isRenewal ? '🔄' : '📢';
    const title = isRenewal ? 'Renouvellement d\'abonnement' : 'Nouveau paiement effectué';

    const notificationMessage = {
      id: Date.now().toString(),
      text: `${emoji} ${title}!\n\nSociété: ${societeNom}\nPlan: ${planNom}\nMontant: ${prix} DT\nUtilisateurs: ${utilisateurs}\nDate: ${new Date().toLocaleDateString('fr-FR')}`,
      from: this.currentUser?.id,
      fromName: this.currentUser?.nom || societeNom,
      fromRole: 'Admin Société',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString(),
      type: type
    };

    storage.conversations[superAdminKey].push(notificationMessage);
    localStorage.setItem('app_data', JSON.stringify(storage));
    console.log(`Notification de ${type === 'RENEWAL' ? 'renouvellement' : 'paiement'} envoyée au Super Admin`);
  }

  telechargerRecu(transaction: any) {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Reçu de paiement - ${transaction.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #1976d2; }
    .title { font-size: 18px; margin: 20px 0; }
    .info { margin: 15px 0; }
    .label { font-weight: bold; color: #555; }
    .total { font-size: 20px; font-weight: bold; color: #2e7d32; margin-top: 20px; }
    .footer { margin-top: 40px; text-align: center; color: #777; font-size: 12px; }
    .status { display: inline-block; padding: 5px 15px; background: #4caf50; color: white; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">NADHEMNI</div>
    <div>Reçu de paiement</div>
  </div>
  
  <div class="title"><strong>Reçu Nº:</strong> ${transaction.id}</div>
  
  <div class="info">
    <span class="label">Société:</span> ${this.societeNom}
  </div>
  <div class="info">
    <span class="label">Date:</span> ${transaction.date}
  </div>
  <div class="info">
    <span class="label">Description:</span> ${transaction.description}
  </div>
  <div class="info">
    <span class="label">Statut:</span> <span class="status">${transaction.statut}</span>
  </div>
  
  <div class="total">
    Montant: ${transaction.montant} DT
  </div>
  
  <div class="footer">
    <p>Merci de votre confiance!</p>
    <p>Généré le ${new Date().toLocaleString('fr-FR')}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recu_${transaction.id}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
    alert('Reçu téléchargé');
  }

  voirHistorique() {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Historique des transactions - ${this.societeNom}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #1976d2; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    .total { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Historique des transactions</h1>
  <p><strong>Société:</strong> ${this.societeNom}</p>
  <p><strong>Généré le:</strong> ${new Date().toLocaleString('fr-FR')}</p>
  
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Montant</th>
        <th>Statut</th>
      </tr>
    </thead>
    <tbody>
      ${this.transactions.map(t => `
      <tr>
        <td>${t.date}</td>
        <td>${t.description}</td>
        <td>${t.montant} DT</td>
        <td>${t.statut}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>
  
  <p style="margin-top: 20px;"><strong>Total:</strong> ${this.transactions.reduce((sum, t) => sum + (parseFloat(t.montant) || 0), 0)} DT</p>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historique_${this.societeNom.replace(/\s+/g, '_')}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
    alert('Historique téléchargé');
  }

  contacterSupport() {
    const initialMessage = `Bonjour, je souhaiterais激活 un abonnement pour notre société ${this.societeNom}.`;
    this.initiateChatWithSuperAdmin(initialMessage);
    
    alert('Vous pouvez contacter le support via le chat');
  }

  initiateChatWithSuperAdmin(message: string) {
    const storage = this.api.getRawStorage();
    if (!storage.conversations) storage.conversations = {};

    const key = this.societeId || 'SUPER';
    if (!storage.conversations[key]) storage.conversations[key] = [];

    const user = this.api.getCurrentUser();
    storage.conversations[key].push({
      id: Date.now().toString(),
      text: message,
      from: user?.id || this.societeId,
      fromName: user?.nom || this.societeNom,
      fromRole: user?.typeUtilisateurId || 'Admin Société',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString()
    });

    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  ajouterMoyen() {
    if (!this.selectedPlan) {
      alert('Veuillez d\'abord sélectionner un abonnement');
      return;
    }
    this.paymentMethodSaved = false;
    this.newPayment = { type: 'card', numero: '', expiration: '', cvv: '', iban: '' };
    const element = document.querySelector('.payment-flow');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }

  setDefault(method: any) {
    this.paymentMethods.forEach(m => m.defaut = m.id === method.id);
    const storage = this.api.getRawStorage();
    storage.paymentMethods = this.paymentMethods;
    localStorage.setItem('app_data', JSON.stringify(storage));
    alert('Moyen de paiement par défaut mis à jour');
  }

  supprimerMoyen(method: any) {
    this.paymentMethods = this.paymentMethods.filter(m => m.id !== method.id);
    const storage = this.api.getRawStorage();
    storage.paymentMethods = this.paymentMethods;
    localStorage.setItem('app_data', JSON.stringify(storage));
    alert('Moyen de paiement supprimé');
  }
}
