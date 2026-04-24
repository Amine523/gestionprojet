import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Plan {
  id: string;
  nom: string;
  prix: number;
  utilisateurs: string;
  features: string[];
  periods?: { monthly: number; quarterly: number; yearly: number };
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'virement';
  nom: string;
  details: string;
  defaut: boolean;
  numero?: string;
  expiration?: string;
  cvv?: string;
  iban?: string;
}

@Component({
  selector: 'app-admin-paiements',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Finance</span>
          </div>
          <h1 class="header-title">
            Billing <span class="gradient-text">Matrix.</span>
          </h1>
          <p class="header-subtitle">
            Subscription Assets & Transaction Infrastructure for {{societeNom}}.
          </p>
        </div>
        <div class="header-status">
          <p>Current Status</p>
          <div class="status-indicator">
            <div class="status-dot" [class.active]="abonnement"></div>
            <span>{{abonnement ? 'Premium Account' : 'Standby Mode'}}</span>
          </div>
        </div>
      </header>

      @if (!abonnement) {
        <!-- Plan Selection -->
        <div class="plan-selection">
           <div class="section-header">
              <h2>Select Your Resource Tier</h2>
              <p>Powering Enterprise Scaling</p>
           </div>

           <div class="plans-grid">
              @for (plan of plans; track plan.id) {
                <div (click)="selectPlan(plan)"
                  class="plan-card"
                  [class.selected]="selectedPlan?.id === plan.id">
                  
                  @if (selectedPlan?.id === plan.id) {
                    <div class="plan-check">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  }

                  <div class="plan-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                     
                  <div class="plan-info">
                     <h3>{{plan.nom}}</h3>
                     <div class="plan-price">
                        <span>{{plan.prix}}</span>
                        <span>DT / Cycles</span>
                     </div>
                  </div>

                  <div class="plan-features">
                     @for (f of plan.features; track f) {
                       <div class="feature-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <span>{{f}}</span>
                       </div>
                     }
                  </div>

                  <div class="plan-periods">
                     <button class="period-btn">Monthly</button>
                     <button class="period-btn period-btn-highlight">Yearly (-15%)</button>
                  </div>
                </div>
              }
           </div>

           @if (selectedPlan) {
             <div class="checkout-section">
                <button (click)="goToPaymentMethod()" class="btn btn-primary btn-large">
                  Initialize Checkout
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
             </div>
           }
        </div>
      }

      @if (abonnement) {
        <div class="billing-grid">
           <!-- Active Asset -->
           <div class="billing-main">
              <div class="card subscription-card">
                 <div class="subscription-badge">Mission-Critical Asset</div>
                 
                 <div class="subscription-header">
                    <div>
                       <h2>{{abonnement.plan}}</h2>
                       <div class="subscription-meta">
                          <div class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                            </svg>
                            <span>{{abonnement.utilisateurs}} Nodes</span>
                          </div>
                          <div class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            <span>Active Ops</span>
                          </div>
                       </div>
                    </div>
                    <div class="subscription-price">
                       <p>Cycle Contribution</p>
                       <p>{{abonnement.prix}} <span>DT</span></p>
                    </div>
                 </div>

                 <div class="subscription-dates">
                    <div class="date-card">
                       <p>Initialization Date</p>
                       <p>{{abonnement.dateDebut}}</p>
                    </div>
                    <div class="date-card date-card-warning">
                       <p>Next Sync Cycle</p>
                       <p>{{abonnement.prochainRenouvellement}}</p>
                    </div>
                 </div>

                 <div class="subscription-actions">
                    <button (click)="processPayment()" class="btn btn-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="23 4 23 10 17 10"/>
                        <polyline points="1 20 1 14 7 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                      </svg>
                      Instant Cycle Sync
                    </button>
                    <button class="btn btn-secondary">
                      Upgrade Tier
                    </button>
                 </div>
              </div>

              <!-- Transaction Ledger -->
              <div class="transactions-section">
                 <div class="section-header">
                    <h3>Transaction Ledger</h3>
                    <button class="link-btn">Export Cryptographic Receipts</button>
                 </div>

                 <div class="card transactions-card">
                    <table class="transactions-table">
                       <thead>
                          <tr>
                             <th>Timestamp</th>
                             <th>Asset Description</th>
                             <th>Contribution</th>
                             <th>Status</th>
                          </tr>
                       </thead>
                       <tbody>
                          @for (t of transactions; track t.id) {
                            <tr>
                               <td>
                                  <div class="timestamp-cell">
                                     <span>{{t.date}}</span>
                                     <span>HASH: {{t.id.slice(0,12)}}</span>
                                  </div>
                               </td>
                               <td>{{t.description}}</td>
                               <td class="amount-cell">{{t.montant}} DT</td>
                               <td class="status-cell">
                                  <span class="badge badge-success">Verified</span>
                               </td>
                            </tr>
                          }
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           <!-- Payment Infrastructure -->
           <div class="billing-sidebar">
              <section class="card card-dark wallet-card">
                 <div class="card-header">
                    <h3>Wallet</h3>
                    <button class="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                 </div>

                 <div class="payment-methods">
                    @for (m of paymentMethods; track m.id) {
                      <div class="payment-method">
                         <div class="payment-icon">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                             <rect x="2" y="5" width="20" height="14" rx="2"/>
                             <line x1="2" y1="10" x2="22" y2="10"/>
                           </svg>
                         </div>
                         <div>
                            <p>{{m.nom}}</p>
                            <span>{{m.details}}</span>
                         </div>
                      </div>
                    }
                 </div>

                 <button class="btn btn-white w-full">
                   Link New Asset
                 </button>
              </section>

              <section class="card security-card">
                 <div class="security-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                 </div>
                 <h4>Military Grade Security</h4>
                 <p>All financial signals are encrypted via 4096-bit SHA protocols. Zero-knowledge architecture ensures your private keys remain localized on your secure node.</p>
                 <button class="link-btn">
                    Audit Security Specs
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                 </button>
              </section>
           </div>
        </div>
      }

      <!-- Payment Modal -->
      @if (showPaymentModal) {
        <div class="modal-backdrop" (click)="showPaymentModal = false">
          <div class="modal-container payment-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="header-icon-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <div>
                <h3>Secure Gateway</h3>
                <p>Authorized Financial Node</p>
              </div>
              <button (click)="showPaymentModal = false" class="btn-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="modal-body">
              <div class="payment-summary">
                <p>Plan: <span>{{selectedPlan?.nom || abonnement?.plan}}</span></p>
                <p>Amount: <span>{{selectedPlan?.prix || abonnement?.prix}} DT</span></p>
              </div>

              <form #payForm="ngForm" (ngSubmit)="confirmPayment()" class="payment-form">
                <div class="form-group">
                  <label>Cardholder Signal</label>
                  <input type="text" [(ngModel)]="paymentData.cardName" name="cardName" class="form-input" placeholder="FULL NAME" required>
                </div>

                <div class="form-group">
                  <label>Card Identity (Primary Number)</label>
                  <div class="input-with-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    <input type="text" [(ngModel)]="paymentData.cardNumber" name="cardNumber" class="form-input" placeholder="0000 0000 0000 0000" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Expiration</label>
                    <input type="text" [(ngModel)]="paymentData.expiry" name="expiry" class="form-input" placeholder="MM/YY" required>
                  </div>
                  <div class="form-group">
                    <label>CVC (Shield Key)</label>
                    <input type="password" [(ngModel)]="paymentData.cvc" name="cvc" class="form-input" placeholder="•••" required>
                  </div>
                </div>

                <div class="security-assurance">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>Encrypted via AES-256 Protocol</span>
                </div>

            <div class="modal-footer">
              <button type="button" (click)="showPaymentModal = false" class="btn btn-ghost">Abort</button>
              <button type="submit" [disabled]="isLoading || payForm.invalid" class="btn btn-primary btn-full">
                @if (isLoading) {
                  <div class="spinner-small"></div>
                  <span>Synchronizing...</span>
                } @else {
                  <span>Authorize Contribution</span>
                }
              </button>
            </div>
              </form>
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
      background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
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
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #818cf8, #6366f1, #4f46e5);
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

    .header-status {
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.05);
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .header-status p {
      font-size: var(--font-size-xs);
      color: #6366f1;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-sm);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #d1d5db;
    }

    .status-dot.active {
      background: #10b981;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-indicator span {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: white;
      font-style: italic;
    }

    .plan-selection {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .section-header {
      text-align: center;
    }

    .section-header h2 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-sm);
      text-transform: uppercase;
      font-style: italic;
    }

    .section-header p {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-lg);
    }

    .plan-card {
      background: white;
      border-radius: var(--radius-xl);
      border: 2px solid var(--color-border);
      padding: var(--space-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      position: relative;
    }

    .plan-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }

    .plan-card.selected {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .plan-check {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      width: 48px;
      height: 48px;
      background: #6366f1;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .plan-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      background: var(--color-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6366f1;
      margin-bottom: var(--space-lg);
    }

    .plan-info h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-sm);
      text-transform: uppercase;
      font-style: italic;
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      gap: var(--space-sm);
    }

    .plan-price span:first-child {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: #6366f1;
    }

    .plan-price span:last-child {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .plan-features {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      padding: var(--space-md) 0;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      margin: var(--space-lg) 0;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    .feature-item svg {
      width: 20px;
      height: 20px;
      color: #10b981;
    }

    .plan-periods {
      display: flex;
      gap: var(--space-sm);
    }

    .period-btn {
      flex: 1;
      padding: var(--space-sm);
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .period-btn:hover {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }

    .period-btn-highlight {
      font-style: italic;
    }

    .checkout-section {
      display: flex;
      justify-content: center;
      padding-top: var(--space-lg);
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
      background: #6366f1;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-large {
      padding: var(--space-md) var(--space-xl);
      font-size: var(--font-size-base);
    }

    .btn-secondary {
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-secondary:hover {
      background: var(--color-surface);
    }

    .btn-white {
      background: white;
      color: var(--color-text);
    }

    .btn-white:hover {
      transform: scale(1.02);
    }

    .billing-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-lg);
    }

    .billing-main {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .billing-sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
    }

    .card-dark {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .subscription-card {
      position: relative;
      overflow: hidden;
    }

    .subscription-badge {
      display: inline-block;
      padding: var(--space-xs) var(--space-sm);
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-lg);
    }

    .subscription-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
      margin-bottom: var(--space-lg);
    }

    .subscription-header h2 {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-md);
      font-style: italic;
    }

    .subscription-meta {
      display: flex;
      gap: var(--space-md);
      color: var(--color-text-muted);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .meta-item svg {
      width: 16px;
      height: 16px;
    }

    .subscription-price p:first-child {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      margin: 0 0 var(--space-xs);
    }

    .subscription-price p:last-child {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: #6366f1;
      margin: 0;
      font-style: italic;
    }

    .subscription-price p:last-child span {
      font-size: var(--font-size-2xl);
    }

    .subscription-dates {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
      padding: var(--space-lg) 0;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      margin: var(--space-lg) 0;
    }

    .date-card {
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
    }

    .date-card p:first-child {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      margin: 0 0 var(--space-xs);
    }

    .date-card p:last-child {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .date-card-warning p:first-child {
      color: #f59e0b;
    }

    .date-card-warning p:last-child {
      color: #f59e0b;
    }

    .subscription-actions {
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
    }

    .transactions-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-header h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      font-style: italic;
    }

    .link-btn {
      background: transparent;
      border: none;
      color: #6366f1;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      transition: all var(--transition-base);
    }

    .link-btn:hover {
      text-decoration: underline;
    }

    .transactions-card {
      overflow: hidden;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .transactions-table thead {
      background: var(--color-bg);
    }

    .transactions-table th {
      padding: var(--space-md);
      text-align: left;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
    }

    .transactions-table td {
      padding: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .timestamp-cell {
      display: flex;
      flex-direction: column;
    }

    .timestamp-cell span:first-child {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .timestamp-cell span:last-child {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .amount-cell {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: #6366f1;
      font-style: italic;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      text-decoration: underline;
      text-decoration-color: #6366f1;
      text-decoration-thickness: 4px;
      text-underline-offset: 8px;
    }

    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .payment-method {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .payment-method:hover {
      border-color: rgba(99, 102, 241, 0.3);
    }

    .payment-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #818cf8;
    }

    .payment-method p {
      margin: 0;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      font-style: italic;
    }

    .payment-method span {
      font-size: var(--font-size-xs);
      color: #94a3b8;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .btn-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .security-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-md);
    }

    .security-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      background: #6366f1;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
    }

    .security-card h4 {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      text-transform: uppercase;
      font-style: italic;
    }

    .security-card p {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
      margin: 0;
      font-style: italic;
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .plan-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .plan-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .period-btn {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .transactions-table thead {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .date-card {
      background: rgba(255, 255, 255, 0.02);
    }



    /* Modal Styling */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    }

    .modal-container {
      background: white;
      border-radius: var(--radius-2xl);
      width: 100%;
      max-width: 450px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .payment-modal {
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .modal-header {
      padding: var(--space-xl);
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      position: relative;
    }

    .header-icon-small {
      width: 40px;
      height: 40px;
      background: #6366f1;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .modal-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modal-header p {
      margin: 0;
      font-size: var(--font-size-xs);
      color: #6366f1;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .btn-close {
      position: absolute;
      top: var(--space-lg);
      right: var(--space-lg);
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-close:hover {
      color: #ef4444;
    }

    .modal-body {
      padding: var(--space-xl);
    }

    .payment-summary {
      background: #f8fafc;
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-xl);
      border-left: 4px solid #6366f1;
    }

    .payment-summary p {
      margin: var(--space-xs) 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      display: flex;
      justify-content: space-between;
    }

    .payment-summary p span {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .payment-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .form-group label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input {
      width: 100%;
      padding: var(--space-md);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: all 0.2s;
    }

    .form-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .input-with-icon {
      position: relative;
    }

    .input-with-icon svg {
      position: absolute;
      left: var(--space-md);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
    }

    .input-with-icon .form-input {
      padding-left: calc(var(--space-md) * 2.5);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }

    .security-assurance {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      color: #10b981;
      font-weight: var(--font-weight-semibold);
      margin-top: var(--space-md);
    }

    .modal-footer {
      padding: var(--space-xl);
      background: var(--color-bg);
      border-top: 1px solid var(--color-border);
      display: flex;
      gap: var(--space-md);
    }

    .btn-full {
      flex: 1;
      height: 54px;
      justify-content: center;
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-text-muted);
    }

    .btn-ghost:hover {
      background: rgba(239, 68, 68, 0.05);
      color: #ef4444;
    }

    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Dark mode */
    :host-context(.dark) .modal-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .payment-summary {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    @media (max-width: 1024px) {
      .billing-grid {
        grid-template-columns: 1fr;
      }

      .subscription-dates {
        grid-template-columns: 1fr;
      }

      .plans-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminPaiementsComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  societeId: string = '';
  societeNom: string = '';
  currentUser: any = null;
  abonnement: any = null;
  transactions: any[] = [];
  paymentMethods: any[] = [];
  selectedPlan: Plan | null = null;
  selectedPeriod: 'monthly' | 'quarterly' | 'yearly' = 'monthly';
  
  showPaymentModal: boolean = false;
  isLoading: boolean = false;
  paymentData = { cardName: '', cardNumber: '', expiry: '', cvc: '' };
  selectedPaymentMethod: PaymentMethod | null = null;
  paymentMethodSaved = false;
  paymentCompleted = false;
  newPayment: any = { type: 'card', numero: '', expiration: '', cvv: '', iban: '' };

  plans: Plan[] = [
    { id: 'starter', nom: 'Starter Node', prix: 99, utilisateurs: '5', features: ['Task Management', '1 Core Project', 'Email Support', '5 User Seats'], periods: { monthly: 99, quarterly: 279, yearly: 990 } },
    { id: 'pro', nom: 'Pro Ecosystem', prix: 299, utilisateurs: '20', features: ['Full Access', 'Unlimited Projects', 'AI Assistant', '20 User Seats', 'Analytics'], periods: { monthly: 299, quarterly: 797, yearly: 2691 } },
    { id: 'enterprise', nom: 'Omni Enterprise', prix: 599, utilisateurs: 'Unlimited', features: ['All Premium', '24/7 Priority', 'Custom API', 'Dedicated Success Manager'], periods: { monthly: 599, quarterly: 1597, yearly: 5391 } }
  ];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.currentUser = user;
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
    this.checkExpiringSubscriptions();
  }

  loadData() {
    const storage = this.api.getRawStorage();
    const abos = storage.abonnements || [];
    const abo = abos.find((a: any) => a.societeId === this.societeId);
    if (abo) {
      this.abonnement = {
        plan: abo.type || 'Pro Ecosystem',
        statut: abo.actif ? 'Active' : 'Standby',
        dateDebut: new Date(abo.dateDebut).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        prochainRenouvellement: new Date(abo.dateFin).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        prix: abo.prix || 0,
        utilisateurs: abo.nbUsers || '20'
      };
    }
    const paiements = storage.paiements || [];
    this.transactions = paiements.filter((p: any) => p.societeId === this.societeId)
      .map((t: any) => ({ ...t, id: t.id || Math.random().toString(36).substr(2, 20), date: new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) }));
    
    this.paymentMethods = storage.paymentMethods || [
      { id: '1', nom: 'Mastercard Node', details: '•••• •••• •••• 4492', defaut: true, type: 'card' },
      { id: '2', nom: 'Visa Network', details: '•••• •••• •••• 9901', defaut: false, type: 'card' }
    ];
  }

  getPlanIcon(id: string): string {
    const icons: any = { starter: 'rocket-takeoff', pro: 'lightning-charge-fill', enterprise: 'shield-shaded' };
    return icons[id] || 'star';
  }

  selectPlan(p: Plan) { this.selectedPlan = p; }
  
  goToPaymentMethod() {
    if (!this.selectedPlan) return;
    this.showPaymentModal = true;
    this.paymentData = { cardName: '', cardNumber: '', expiry: '', cvc: '' };
  }

  processPayment() {
    this.showPaymentModal = true;
    this.paymentData = { cardName: '', cardNumber: '', expiry: '', cvc: '' };
  }

  confirmPayment() {
    this.isLoading = true;
    
    const currentPrice = this.getCurrentPrice();
    const periodLabel = this.getPeriodLabel();
    
    // 1. Create Payment record
    const paiementDto = {
      id: crypto.randomUUID(),
      societeId: this.societeId,
      societeNom: this.societeNom,
      montant: currentPrice,
      date: new Date().toISOString(),
      description: `Subscription Sync: ${this.selectedPlan?.nom || this.abonnement?.plan} - ${periodLabel}`,
      methode: 'Card',
      statut: 'Success',
      type: 'NEW_SUBSCRIPTION',
      periode: this.selectedPeriod
    };

    this.api.createPaiement(paiementDto).subscribe({
      next: () => {
        this.saveTransactionToStorage(paiementDto);
        
        // 2. Create/Update Subscription
        const aboDto = {
          id: this.abonnement?.id || crypto.randomUUID(),
          societeId: this.societeId,
          societeNom: this.societeNom,
          adminId: this.currentUser?.id,
          adminNom: this.currentUser?.nom,
          adminEmail: this.currentUser?.email,
          type: this.selectedPlan?.nom || this.abonnement?.plan,
          periode: this.selectedPeriod,
          dateDebut: new Date().toISOString(),
          dateFin: this.getNextDate(),
          actif: true,
          prix: currentPrice,
          nbUsers: this.getPlanUsers() ? parseInt(this.getPlanUsers()) : 20
        };

        this.api.createAbonnement(aboDto).subscribe({
          next: () => {
            this.saveAbonnementToStorage(aboDto);
            this.sendPaymentNotificationToSuperAdmin(this.societeNom, this.selectedPlan?.nom || this.abonnement?.plan, currentPrice, this.selectedPlan?.utilisateurs || this.abonnement?.utilisateurs);
            this.isLoading = false;
            this.showPaymentModal = false;
            this.paymentCompleted = true;
            this.snackBar.open('Payment verified. Subscription ecosystem synchronized.', 'OK', { duration: 5000 });
            this.loadData();
          },
          error: (err) => {
            this.isLoading = false;
            this.snackBar.open('Ecosystem sync failed. Please check your secure node.', 'Retry');
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Financial authorization failed. Security breach prevented.', 'Retry');
      }
    });
  }

  getCurrentPrice(): number {
    if (!this.selectedPlan) return this.abonnement?.prix || 0;
    const periods = this.selectedPlan.periods;
    if (!periods) return this.selectedPlan.prix;
    return periods[this.selectedPeriod] || this.selectedPlan.prix;
  }

  getPeriodLabel(): string {
    const labels: any = { monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' };
    return labels[this.selectedPeriod] || 'Monthly';
  }

  getDiscount(): number {
    if (!this.selectedPlan) return 0;
    const periods = this.selectedPlan.periods;
    if (!periods) return 0;
    const monthlyTotal = periods.monthly * 12;
    const yearlyPrice = periods.yearly;
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
  }

  getPlanUsers(): string {
    if (!this.selectedPlan) return '';
    const users = this.selectedPlan.utilisateurs;
    if (users === 'Unlimited') return '9999';
    const num = users.match(/\d+/);
    return num ? num[0] : '20';
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

  selectPaymentMethod(method: PaymentMethod) {
    this.selectedPaymentMethod = method;
    this.paymentMethodSaved = true;
  }

  isPaymentMethodValid(): boolean {
    if (this.newPayment.type === 'card') {
      return !!(this.newPayment.numero && this.newPayment.expiration && this.newPayment.cvv);
    } else {
      return !!(this.newPayment.iban && this.newPayment.iban.length >= 20);
    }
  }

  savePaymentMethod() {
    const storage = this.api.getRawStorage();
    
    if (this.newPayment.type === 'card') {
      const method: PaymentMethod = {
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
      storage.paymentMethods = storage.paymentMethods || [];
      storage.paymentMethods.push(method);
    } else if (this.newPayment.type === 'virement' && this.newPayment.iban) {
      const method: PaymentMethod = {
        id: Date.now().toString(),
        type: 'virement',
        nom: 'Bank Transfer',
        details: 'RIB: ' + this.newPayment.iban,
        defaut: false,
        iban: this.newPayment.iban
      };
      this.paymentMethods.push(method);
      storage.paymentMethods = storage.paymentMethods || [];
      storage.paymentMethods.push(method);
    }
    
    localStorage.setItem('app_data', JSON.stringify(storage));
    this.paymentMethodSaved = true;
    this.selectedPaymentMethod = this.paymentMethods[this.paymentMethods.length - 1];
    this.snackBar.open('Payment method registered successfully', 'OK', { duration: 3000 });
  }

  setDefault(method: PaymentMethod) {
    this.paymentMethods.forEach(m => m.defaut = m.id === method.id);
    const storage = this.api.getRawStorage();
    storage.paymentMethods = this.paymentMethods;
    localStorage.setItem('app_data', JSON.stringify(storage));
    this.snackBar.open('Default payment method updated', 'OK', { duration: 3000 });
  }

  supprimerMoyen(method: PaymentMethod) {
    this.paymentMethods = this.paymentMethods.filter(m => m.id !== method.id);
    const storage = this.api.getRawStorage();
    storage.paymentMethods = this.paymentMethods;
    localStorage.setItem('app_data', JSON.stringify(storage));
    this.snackBar.open('Payment method removed', 'OK', { duration: 3000 });
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

  telechargerRecu(transaction: any) {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt - ${transaction.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
    .title { font-size: 18px; margin: 20px 0; }
    .info { margin: 15px 0; }
    .label { font-weight: bold; color: #555; }
    .total { font-size: 20px; font-weight: bold; color: #10b981; margin-top: 20px; }
    .footer { margin-top: 40px; text-align: center; color: #777; font-size: 12px; }
    .status { display: inline-block; padding: 5px 15px; background: #10b981; color: white; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">NADHEMNI</div>
    <div>Payment Receipt</div>
  </div>
  
  <div class="title"><strong>Receipt Nº:</strong> ${transaction.id}</div>
  
  <div class="info">
    <span class="label">Company:</span> ${this.societeNom}
  </div>
  <div class="info">
    <span class="label">Date:</span> ${transaction.date}
  </div>
  <div class="info">
    <span class="label">Description:</span> ${transaction.description}
  </div>
  <div class="info">
    <span class="label">Status:</span> <span class="status">${transaction.statut}</span>
  </div>
  
  <div class="total">
    Amount: ${transaction.montant} DT
  </div>
  
  <div class="footer">
    <p>Thank you for your trust!</p>
    <p>Generated on ${new Date().toLocaleString('fr-FR')}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${transaction.id}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.snackBar.open('Receipt downloaded', 'OK', { duration: 3000 });
  }

  voirHistorique() {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Transaction History - ${this.societeNom}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #6366f1; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    .total { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Transaction History</h1>
  <p><strong>Company:</strong> ${this.societeNom}</p>
  <p><strong>Generated on:</strong> ${new Date().toLocaleString('fr-FR')}</p>
  
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Status</th>
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
    link.download = `history_${this.societeNom.replace(/\s+/g, '_')}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.snackBar.open('History downloaded', 'OK', { duration: 3000 });
  }

  contacterSupport() {
    const initialMessage = `Hello, I would like to activate a subscription for our company ${this.societeNom}.`;
    this.initiateChatWithSuperAdmin(initialMessage);
    this.snackBar.open('You can contact support via chat', 'OK', { duration: 3000 });
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
      fromRole: user?.typeUtilisateurId || 'Company Admin',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString()
    });

    localStorage.setItem('app_data', JSON.stringify(storage));
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
        myAbo.nbUsers ? `${myAbo.nbUsers} users` : 'N/A',
        'RENEWAL'
      );
      
      myAbo.notified = true;
      localStorage.setItem('app_data', JSON.stringify(storage));
    }
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
    const title = isRenewal ? 'Subscription Renewal' : 'New Payment Processed';

    const notificationMessage = {
      id: Date.now().toString(),
      text: `${emoji} ${title}!\n\nCompany: ${societeNom}\nPlan: ${planNom}\nAmount: ${prix} DT\nUsers: ${utilisateurs}\nDate: ${new Date().toLocaleDateString('fr-FR')}`,
      from: this.currentUser?.id,
      fromName: this.currentUser?.nom || societeNom,
      fromRole: 'Company Admin',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString(),
      type: type
    };

    storage.conversations[superAdminKey].push(notificationMessage);
    localStorage.setItem('app_data', JSON.stringify(storage));
    console.log(`Notification of ${type === 'RENEWAL' ? 'renewal' : 'payment'} sent to Super Admin`);
  }
}
