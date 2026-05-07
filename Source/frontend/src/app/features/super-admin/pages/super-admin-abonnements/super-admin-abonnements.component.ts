import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-super-admin-abonnements',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './super-admin-abonnements.component.html',
  styleUrls: ['./super-admin-abonnements.component.scss']
})
export class SuperAdminAbonnementsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  activeTab = 'plans';
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
  filterPlan = '';

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
        const societesMap = new Map((this.societes || []).map((s: any) => [s.id || s.Id, s.nom || s.Nom]));
        
        this.abonnementsFull = abosList.map((abo: any) => ({
          id: abo.id || abo.Id,
          societeId: abo.societeId || abo.SocieteId,
          societeNom: societesMap.get(abo.societeId || abo.SocieteId) || 'Organisation Inconnue',
          planNom: abo.typeAbonnement || abo.TypeAbonnement || 'Standard',
          montant: abo.prix || abo.Prix || 0,
          statut: (abo.actif === true || abo.Actif === true) ? 'Actif' : 'Inactif',
          dateDebut: (abo.dateDebut || abo.DateDebut) ? new Date(abo.dateDebut || abo.DateDebut).toLocaleDateString('fr-FR') : '-',
          dateFin: (abo.dateFin || abo.DateFin) ? new Date(abo.dateFin || abo.DateFin).toLocaleDateString('fr-FR') : '-'
        }));
        
        this.applyFilters();
      }
    });
  }

  loadFactures() {
    this.api.getPaiements().subscribe({
      next: (paiements) => {
        const societesMap = new Map((this.societes || []).map((s: any) => [s.id || s.Id, s.nom || s.Nom]));
        this.factures = (paiements || []).map((p: any) => ({
          id: p.id || p.Id,
          numero: 'INV-' + (p.id || p.Id || '').toString().slice(-6).toUpperCase(),
          societeNom: societesMap.get(p.societeId || p.SocieteId) || 'Organisation Inconnue',
          montant: p.montant || p.Montant || 0,
          date: (p.date || p.Date) ? new Date(p.date || p.Date).toLocaleDateString('fr-FR') : '-',
          statut: p.statut || p.Statut || 'Payé'
        }));
      }
    });
  }

  applyFilters() {
    this.abonnements = this.abonnementsFull.filter(abo => {
      const matchesSociete = !this.filterSocieteId || abo.societeNom.toLowerCase().includes(this.filterSocieteId.toLowerCase());
      const matchesPlan = !this.filterPlan || abo.planNom.toLowerCase() === this.filterPlan.toLowerCase();
      return matchesSociete && matchesPlan;
    });
  }

  getPlanIcon(id: string): string {
    if (id === 'starter') return 'send';
    if (id === 'pro') return 'lightning';
    return 'gem';
  }

  openAddDialog() {
    this.newAbo = { societeId: '', planId: '', dateDebut: new Date().toISOString().split('T')[0], notes: '', dureeMois: 12, modePaiement: 'mensuel' };
    this.showAddDialog = true;
  }

  closeDialog() { this.showAddDialog = false; }

  onPlanChange() {
    this.selectedPlanForForm = this.plans.find(p => p.id === this.newAbo.planId);
  }

  onSocieteChange() {
    this.selectedSocieteForForm = this.societes.find(s => s.id === this.newAbo.societeId);
  }

  createAbonnement() {
    if (!this.newAbo.societeId || !this.newAbo.planId) {
      this.snackBar.open('Veuillez sélectionner une société et un plan', 'Fermer', { duration: 3000 });
      return;
    }

    const plan = this.plans.find(p => p.id === this.newAbo.planId);
    
    // Calcul de la date de fin
    const startDate = new Date(this.newAbo.dateDebut);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + parseInt(this.newAbo.dureeMois.toString()));

    const payload = {
      societeId: this.newAbo.societeId,
      typeAbonnement: plan?.nom,
      prix: plan?.prix ? (plan.prix * parseInt(this.newAbo.dureeMois.toString())) : 0,
      dateDebut: startDate.toISOString(),
      dateFin: endDate.toISOString(),
      actif: true
    };

    this.api.createAbonnement(payload).subscribe({
      next: () => {
        this.snackBar.open('Abonnement activé avec succès', 'Fermer', { duration: 3000 });
        this.showAddDialog = false;
        this.loadAllAbonnements();
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'abonnement:', err);
        this.snackBar.open('Erreur lors de l\'activation', 'Fermer', { duration: 3000 });
      }
    });
  }

  sendRenewalAlert(abo: any) {
    this.snackBar.open('Alerte de renouvellement envoyée à ' + abo.societeNom, 'Fermer', { duration: 3000 });
  }

  exportPDF(facture: any) {
    this.snackBar.open('Téléchargement de la facture ' + facture.numero, 'Fermer', { duration: 3000 });
  }

  configurePlan(plan: any) {
    this.snackBar.open(`Configuration du plan: ${plan.nom}`, 'Fermer', { duration: 3000 });
  }

  deletePlan(plan: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le plan ${plan.nom} ?`)) {
      this.snackBar.open(`Plan ${plan.nom} supprimé`, 'Fermer', { duration: 3000 });
    }
  }
}
