import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Plan {
  id: string;
  nom: string;
  prix: number;
  description: string;
  utilisateurs: string;
  features: string[];
  popular?: boolean;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  montant: number;
  statut: string;
  type: string;
}

@Component({
  selector: 'app-admin-paiements',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="billing-container">
      <!-- Header -->
      <header class="billing-header">
        <div class="header-info">
          <span class="badge">Billing & Subscription</span>
          <h1>Gestion des <span class="text-gradient">Finances</span></h1>
          <p>Gérez vos abonnements, méthodes de paiement et historique de transactions pour {{societeNom}}.</p>
        </div>
        <div class="header-card">
          <div class="plan-status">
            <div class="status-icon" [class.active]="currentAbonnement">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="status-details">
              <span class="label">Statut Actuel</span>
              <span class="value">{{currentAbonnement ? currentAbonnement.typeAbonnement : 'Aucun Abonnement'}}</span>
            </div>
          </div>
        </div>
      </header>

      @if (!currentAbonnement) {
        <!-- Pricing Table -->
        <section class="pricing-section">
          <div class="section-title">
            <h2>Choisissez votre Plan</h2>
            <p>Des solutions adaptées à la taille de votre entreprise.</p>
          </div>

          <div class="pricing-grid">
            @for (plan of plans; track plan.id) {
              <div class="pricing-card" [class.popular]="plan.popular">
                @if (plan.popular) { <span class="popular-tag">Recommandé</span> }
                <div class="card-header">
                  <h3>{{plan.nom}}</h3>
                  <div class="price">
                    <span class="currency">DT</span>
                    <span class="amount">{{plan.prix}}</span>
                    <span class="period">/mois</span>
                  </div>
                  <p class="description">{{plan.description}}</p>
                </div>
                <ul class="features">
                  @for (feat of plan.features; track feat) {
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                      {{feat}}
                    </li>
                  }
                </ul>
                <button class="btn btn-primary" (click)="selectPlan(plan)">
                  Sélectionner
                </button>
              </div>
            }
          </div>
        </section>
      } @else {
        <!-- Billing Dashboard -->
        <div class="billing-dashboard">
          <div class="main-content">
            <!-- Active Subscription -->
            <div class="card sub-card">
              <div class="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Abonnement Actif
              </div>
              <div class="sub-details">
                <div class="detail-item">
                  <span class="label">Plan</span>
                  <span class="value">{{currentAbonnement.typeAbonnement}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Date de début</span>
                  <span class="value">{{currentAbonnement.dateDebut | date:'mediumDate'}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Prochain Renouvellement</span>
                  <span class="value">{{currentAbonnement.dateFin | date:'mediumDate'}}</span>
                </div>
              </div>
              <div class="sub-actions">
                <button class="btn btn-outline" (click)="currentAbonnement = null">Changer de Plan</button>
                <button class="btn btn-danger-outline">Résilier</button>
              </div>
            </div>

            <!-- Transaction History -->
            <div class="card transaction-card">
              <div class="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Historique des Transactions
              </div>
              <div class="table-container">
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
                    @for (t of transactions; track t.id) {
                      <tr>
                        <td>{{t.date | date:'shortDate'}}</td>
                        <td>{{t.description}}</td>
                        <td class="amount">{{t.montant}} DT</td>
                        <td><span class="status-pill success">Payé</span></td>
                      </tr>
                    }
                    @if (transactions.length === 0) {
                      <tr>
                        <td colspan="4" class="empty">Aucune transaction enregistrée.</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="sidebar">
            <!-- Payment Methods -->
            <div class="card methods-card">
              <div class="card-title">Méthodes de Paiement</div>
              <div class="method-item">
                <div class="method-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                </div>
                <div class="method-info">
                  <span class="name">Visa ending in 4242</span>
                  <span class="expiry">Expires 12/26</span>
                </div>
              </div>
              <button class="btn btn-text">+ Ajouter une méthode</button>
            </div>

            <!-- Security Assurance -->
            <div class="card security-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <h4>Paiement Sécurisé</h4>
              <p>Vos données bancaires sont cryptées selon les normes PCI-DSS v4.0.</p>
            </div>
          </div>
        </div>
      }

      <!-- Checkout Modal -->
      @if (showCheckout) {
        <div class="modal-overlay" (click)="showCheckout = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Checkout Sécurisé</h3>
              <button (click)="showCheckout = false" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="order-summary">
                <span>Total à payer:</span>
                <span class="total">{{selectedPlan?.prix}} DT / mois</span>
              </div>
              
              <form class="checkout-form" (ngSubmit)="processCheckout()">
                <div class="form-group">
                  <label>Titulaire de la carte</label>
                  <input type="text" placeholder="Nom complet" required>
                </div>
                <div class="form-group">
                  <label>Numéro de carte</label>
                  <div class="card-input-wrapper">
                    <input type="text" placeholder="0000 0000 0000 0000" required>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Expiration</label>
                    <input type="text" placeholder="MM/YY" required>
                  </div>
                  <div class="form-group">
                    <label>CVC</label>
                    <input type="password" placeholder="•••" required>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
                  @if (loading) {
                    <span class="spinner"></span> Traitement...
                  } @else {
                    Payer maintenant
                  }
                </button>
              </form>
              <p class="security-text">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Cryptage SSL 256 bits
              </p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .billing-container {
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 12px;
      
      padding: 2rem;
      background: var(--bg);
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }

    /* Header */
    .billing-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 3rem;
    }

    .header-info h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text);
      margin: 0.5rem 0;
    }

    .text-gradient {
      background: linear-gradient(135deg, var(--primary), #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .badge {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .header-card {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: var(--radius);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border);
    }

    .plan-status {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-icon {
      width: 40px;
      height: 40px;
      background: #f1f5f9;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }

    .status-icon.active {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .status-details .label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .status-details .value {
      font-weight: 700;
      color: var(--text);
    }

    /* Pricing */
    .pricing-section {
      margin-top: 2rem;
    }

    .section-title {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-title h2 {
      font-size: 2rem;
      font-weight: 700;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .pricing-card {
      background: var(--card-bg);
      padding: 2.5rem;
      border-radius: 20px;
      border: 1px solid var(--border);
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .pricing-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .pricing-card.popular {
      border: 2px solid var(--primary);
    }

    .popular-tag {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--primary);
      color: white;
      font-size: 0.7rem;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 700;
    }

    .card-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .price {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 1rem;
    }

    .price .amount {
      font-size: 3rem;
      font-weight: 800;
      color: var(--text);
    }

    .price .currency, .price .period {
      color: var(--text-muted);
      font-weight: 600;
    }

    .features {
      list-style: none;
      padding: 0;
      margin: 2rem 0;
    }

    .features li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .features li svg {
      width: 16px;
      height: 16px;
      color: #10b981;
    }

    /* Billing Dashboard */
    .billing-dashboard {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .card-title {
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .card-title svg {
      width: 20px;
      height: 20px;
      color: var(--primary);
    }

    .sub-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .detail-item .label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .detail-item .value {
      font-weight: 600;
      color: var(--text);
    }

    .sub-actions {
      display: flex;
      gap: 1rem;
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
    }

    /* Transactions Table */
    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--text-muted);
      padding: 1rem;
      border-bottom: 1px solid var(--border);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--border);
      font-size: 0.9rem;
    }

    .amount {
      font-weight: 700;
      color: var(--text);
    }

    .status-pill {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .status-pill.success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    /* Buttons */
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-hover);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }

    .btn-danger-outline {
      background: transparent;
      border: 1px solid #fee2e2;
      color: #ef4444;
    }

    .btn-text {
      background: transparent;
      color: var(--primary);
      padding: 0;
      font-size: 0.85rem;
    }

    /* Sidebar Items */
    .method-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 10px;
      margin-bottom: 1rem;
    }

    .method-icon {
      color: var(--text-muted);
    }

    .method-info {
      display: flex;
      flex-direction: column;
    }

    .method-info .name {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .method-info .expiry {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .security-card {
      text-align: center;
      background: linear-gradient(to bottom right, #ffffff, #f0fdf4);
    }

    .security-card svg {
      width: 32px;
      height: 32px;
      margin-bottom: 1rem;
    }

    .security-card h4 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .security-card p {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      width: 100%;
      max-width: 450px;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .close-btn {
      background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);
    }

    .order-summary {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      font-weight: 700;
    }

    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted); }
    .form-group input { 
      width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.9rem;
      outline: none; transition: border-color 0.2s;
    }
    .form-group input:focus { border-color: var(--primary); }
    
    .card-input-wrapper { position: relative; }
    .card-input-wrapper svg { position: absolute; right: 12px; top: 12px; width: 20px; color: var(--text-muted); }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    .security-text {
      text-align: center; font-size: 0.7rem; color: var(--text-muted); margin-top: 1.5rem;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }

    .spinner {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
      border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AdminPaiementsComponent implements OnInit {
  private api: ApiService = inject(ApiService);
  private snack = inject(MatSnackBar);

  societeNom: string = '';
  societeId: string = '';
  currentAbonnement: any = null;
  transactions: Transaction[] = [];
  loading = false;
  showCheckout = false;
  selectedPlan: Plan | null = null;

  plans: Plan[] = [
    {
      id: 'starter',
      nom: 'Starter',
      prix: 99,
      description: 'Idéal pour les petites équipes en démarrage.',
      utilisateurs: 'Jusqu\'à 10 users',
      features: ['Gestion de Projets basique', 'RH Essentials', '5 Go de Stockage', 'Support par Email']
    },
    {
      id: 'professional',
      nom: 'Professional',
      prix: 299,
      description: 'Pour les entreprises en pleine croissance.',
      utilisateurs: 'Jusqu\'à 50 users',
      features: ['Tout dans Starter', 'Analyses IA avancées', 'Gestion RH complète', '50 Go de Stockage', 'Support Prioritaire'],
      popular: true
    },
    {
      id: 'enterprise',
      nom: 'Enterprise',
      prix: 899,
      description: 'Puissance maximale pour grandes structures.',
      utilisateurs: 'Illimité',
      features: ['Tout dans Pro', 'Custom Branding', 'API Access', 'Stockage Illimité', 'Account Manager dédié']
    }
  ];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.loadSocieteInfo();
    this.loadAbonnement();
    this.loadTransactions();
  }

  loadSocieteInfo() {
    if (!this.societeId) return;
    this.api.get(`api/societe/obtenir/id/${this.societeId}`).subscribe((res: any) => {
      this.societeNom = res?.nom || 'Votre Société';
    });
  }

  loadAbonnement() {
    this.api.get(`api/abonnements`).subscribe((res: any) => {
      // Filtrer pour la société actuelle
      const mine = res.find((a: any) => a.societeId === this.societeId && a.actif);
      this.currentAbonnement = mine;
    });
  }

  loadTransactions() {
    this.api.get(`api/paiements`).subscribe((res: any) => {
      this.transactions = (res || [])
        .filter((t: any) => t.societeId === this.societeId)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  selectPlan(plan: Plan) {
    this.selectedPlan = plan;
    this.showCheckout = true;
  }

  processCheckout() {
    if (!this.selectedPlan) return;
    this.loading = true;

    // Simuler un délai de traitement bancaire
    setTimeout(() => {
      const payloadPaiement = {
        Id: 'PAY' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        SocieteId: this.societeId,
        SocieteNom: this.societeNom,
        Description: `Abonnement Plan ${this.selectedPlan?.nom}`,
        Montant: this.selectedPlan?.prix,
        Date: new Date().toISOString(),
        Statut: 'Success',
        Type: 'Carte Bancaire'
      };

      const payloadAbonnement = {
        Id: 'SUB' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        SocieteId: this.societeId,
        TypeAbonnement: this.selectedPlan?.nom,
        DateDebut: new Date().toISOString(),
        DateFin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        Actif: true
      };

      // 1. Enregistrer le paiement
      this.api.post('api/paiements', payloadPaiement).subscribe(() => {
        // 2. Créer l'abonnement
        this.api.post('api/abonnements', payloadAbonnement).subscribe(() => {
          this.loading = false;
          this.showCheckout = false;
          this.snack.open('Paiement réussi ! Votre abonnement est actif.', 'OK', { duration: 5000 });
          this.loadAbonnement();
          this.loadTransactions();
        });
      });
    }, 2000);
  }
}
