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
  templateUrl: './admin-paiements.component.html',
  styleUrls: ['./admin-paiements.component.scss']
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
