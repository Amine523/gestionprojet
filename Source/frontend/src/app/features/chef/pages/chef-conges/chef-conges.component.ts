import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

interface Conge {
  id: string;
  utilisateurId: string;
  utilisateurNom: string;
  typeNom: string;
  dateDebut: string;
  dateFin: string;
  nombreJours: number;
  motif: string;
  status: string;
}

@Component({
  selector: 'app-chef-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './chef-conges.component.html',
  styleUrls: ['./chef-conges.component.scss']
})
export class ChefCongesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  societeId = '';
  societeNom = '';
  currentUserId = '';

  congesSignal = signal<Conge[]>([]);
  statsSignal = signal({ totalEquipe: 0, congesValides: 0, demandesCongesEnAttente: 0 });
  activeTab = 'all';
  employesMap: { [id: string]: string } = {};

  showRequestForm = signal(false);
  loading = signal(false);
  mesCongesSignal = signal<Conge[]>([]);
  nouvelleDemande = { typePointageId: 'NORMAL', dateDebut: '', dateFin: '', motif: '' };

  stats = computed(() => this.statsSignal());
  enAttenteCount = computed(() => this.congesSignal().filter(c => c.status === 'En attente').length);

  filteredConges = computed(() => {
    if (this.activeTab === 'mine') return this.mesCongesSignal();
    const list = this.congesSignal();
    if (this.activeTab === 'pending') return list.filter(c => c.status === 'En attente');
    if (this.activeTab === 'approved') return list.filter(c => c.status === 'Validée');
    return list;
  });

  ngOnInit() {
    this.societeId = this.api.getCurrentSocieteId();
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.currentUserId = this.api.getCurrentUserId();
    this.loadData();
  }

  loadData() {
    this.loadStats();
    this.loadConges();
    this.loadMesConges();
  }

  loadMesConges() {
    this.api.getDemandesCongeByUtilisateur(this.currentUserId).subscribe(data => {
      const list = data.map((d: any) => {
        const dDebut = new Date(d.dateDebut || d.DateDebut);
        const dFin = new Date(d.dateFin || d.DateFin);
        let nj = 0;
        if (!isNaN(dDebut.getTime()) && !isNaN(dFin.getTime())) {
          const diffTime = Math.abs(dFin.getTime() - dDebut.getTime());
          nj = d.jours || d.Jours || Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return {
          id: d.id || d.Id,
          utilisateurId: d.utilisateurId || d.UtilisateurId,
          utilisateurNom: 'Moi',
          typeNom: d.typeNom || d.TypeNom || 'Congé',
          dateDebut: d.dateDebut || d.DateDebut,
          dateFin: d.dateFin || d.DateFin,
          nombreJours: nj,
          motif: d.motif || d.Motif || '',
          status: this.formatStatus(d.status || d.Status || 'En attente')
        };
      });
      this.mesCongesSignal.set(list);
    });
  }

  private formatStatus(status: string): string {
    if (!status) return 'En attente';
    const s = status.toLowerCase().replace('_', ' ');
    if (s === 'en attente' || s === 'pending') return 'En attente';
    if (s === 'validée' || s === 'validee' || s === 'validated' || s === 'approved') return 'Validée';
    if (s === 'refusée' || s === 'refusee' || s === 'rejected') return 'Refusée';
    return status;
  }

  soumettreDemande() {
    if (!this.nouvelleDemande.dateDebut || !this.nouvelleDemande.dateFin) {
      this.snackBar.open('Veuillez remplir les dates', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    const dto = {
      ...this.nouvelleDemande,
      utilisateurId: this.currentUserId,
      societeId: this.societeId,
      status: 'En attente'
    };

    this.api.createDemandeCongeReal(dto).subscribe({
      next: () => {
        this.snackBar.open('Demande envoyée avec succès', 'Fermer', { duration: 3000 });
        this.showRequestForm.set(false);
        this.loading.set(false);
        this.nouvelleDemande = { typePointageId: 'NORMAL', dateDebut: '', dateFin: '', motif: '' };
        this.loadMesConges();
        this.activeTab = 'mine';
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi de la demande', 'Fermer', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  loadStats() {
    this.api.getRHStats(this.societeId).subscribe(res => {
      this.statsSignal.set(res);
    });
  }

  loadConges() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.employesMap = {};
        employes.forEach((e: any) => {
          this.employesMap[e.id || e.Id] = e.nom || e.Nom;
        });

        this.api.getDemandesEnAttenteReal(this.societeId).subscribe({
          next: (data) => {
            const list = data.map((d: any) => {
              const uId = d.utilisateurId || d.UtilisateurId;
              const uNom = d.utilisateurNom || d.UtilisateurNom || this.employesMap[uId] || 'Utilisateur ' + uId;
              const dDebut = new Date(d.dateDebut || d.DateDebut);
              const dFin = new Date(d.dateFin || d.DateFin);
              let nj = 0;
              if (!isNaN(dDebut.getTime()) && !isNaN(dFin.getTime())) {
                const diffTime = Math.abs(dFin.getTime() - dDebut.getTime());
                nj = d.jours || d.Jours || Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              }
              return {
                id: d.id || d.Id,
                utilisateurId: uId,
                utilisateurNom: uNom,
                typeNom: d.typeNom || d.TypeNom || 'Congé',
                dateDebut: d.dateDebut || d.DateDebut,
                dateFin: d.dateFin || d.DateFin,
                nombreJours: nj,
                motif: d.motif || d.Motif || '',
                status: d.status || d.Status || 'En attente'
              };
            });
            this.congesSignal.set(list);
          },
          error: () => {
            this.snackBar.open('Erreur de chargement des demandes', 'Fermer', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.snackBar.open('Erreur de chargement des employés', 'Fermer', { duration: 3000 });
      }
    });
  }

  validerConge(conge: Conge, approuve: boolean) {
    const status = approuve ? 'Validée' : 'Refusée';
    this.api.validerDemandeCongeReal(conge.id, this.currentUserId, approuve).subscribe({
      next: (res) => {
        this.congesSignal.update(list => list.map(c => c.id === conge.id ? { ...c, status } : c));
        this.snackBar.open(res.message, 'Fermer', { duration: 3000 });
        this.loadStats();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la validation', 'Fermer', { duration: 3000 });
      }
    });
  }
}
