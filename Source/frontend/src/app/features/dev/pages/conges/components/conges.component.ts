import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CongeService } from '../service/conge.service';
import { SoldeConge, Conge, NouvelleDemande } from '../model/conge.model';

@Component({
  selector: 'app-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, MatIconModule],
  templateUrl: './conges.component.html',
  styleUrls: ['./conges.component.scss']
})
export class CongesComponent implements OnInit {
  private congeService = inject(CongeService);
  private snackBar = inject(MatSnackBar);

  solde: SoldeConge = { soldeTotal: 30, soldeUtilise: 0, soldeRestant: 30, congesEnAttente: 0, congesValides: 0 };
  conges: Conge[] = [];
  nouvelleDemande: NouvelleDemande = { typePointageId: 'NORMAL', dateDebut: null, dateFin: null, motif: '', periode: 'Matin', heures: 2 };
  loading = false;
  justificatifFile: File | null = null;
  lastDemandeId: string | null = null;

  // Pagination
  page = 1;
  pageSize = 5;

  get totalPages(): number {
    return Math.ceil(this.conges.length / this.pageSize) || 1;
  }

  get paginatedConges() {
    const start = (this.page - 1) * this.pageSize;
    return this.conges.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const uid = this.congeService.getCurrentUserId();
    this.congeService.getSoldeConge(uid).subscribe(res => {
      this.solde = res;
    });

    // Get all requests for history
    this.congeService.getDemandesCongeByUtilisateur(uid).subscribe(data => {
      if (data) {
        this.conges = data.map((d: any) => {
          const dDebut = new Date(d.dateDebut || d.DateDebut);
          const dFin = new Date(d.dateFin || d.DateFin);
          let nj = 0;
          if (!isNaN(dDebut.getTime()) && !isNaN(dFin.getTime())) {
            const diffTime = Math.abs(dFin.getTime() - dDebut.getTime());
            nj = d.jours || d.Jours || Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          return {
            ...d,
            id: d.id || d.Id,
            nombreJours: nj,
            dateDebut: d.dateDebut || d.DateDebut,
            dateFin: d.dateFin || d.DateFin,
            typeNom: d.typeNom || d.TypeNom || 'Congé',
            status: this.formatStatus(d.status || d.Status || 'En attente')
          };
        })
          .sort((a: any, b: any) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime());
      } else {
        this.conges = [];
      }
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
    if (this.nouvelleDemande.typePointageId === 'HALFDAY' || this.nouvelleDemande.typePointageId === 'AUTORISATION') {
      if (!this.nouvelleDemande.dateDebut) {
        this.snackBar.open('Veuillez remplir la date', 'Fermer', { duration: 3000 });
        return;
      }
      this.nouvelleDemande.dateFin = this.nouvelleDemande.dateDebut; // Same date for single day
    } else {
      if (!this.nouvelleDemande.dateDebut || !this.nouvelleDemande.dateFin) {
        this.snackBar.open('Veuillez remplir les dates', 'Fermer', { duration: 3000 });
        return;
      }
      if (new Date(this.nouvelleDemande.dateFin) < new Date(this.nouvelleDemande.dateDebut)) {
        this.snackBar.open('La date de fin doit être postérieure à la date de début', 'Fermer', { duration: 3000 });
        return;
      }
    }

    // Balance check
    const type = this.nouvelleDemande.typePointageId;
    let daysRequested = 1;
    if (type !== 'HALFDAY' && type !== 'AUTORISATION') {
      const dDebut = new Date(this.nouvelleDemande.dateDebut as any);
      const dFin = new Date(this.nouvelleDemande.dateFin as any);
      const diffTime = Math.abs(dFin.getTime() - dDebut.getTime());
      daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else if (type === 'HALFDAY') {
      daysRequested = 0.5;
    } else if (type === 'AUTORISATION') {
      daysRequested = 0;
    }

    if (type !== 'MALADIE' && type !== 'EXCEP' && type !== 'AUTORISATION') {
      if (this.solde.soldeRestant < daysRequested) {
        this.snackBar.open(`Solde insuffisant. Vous demandez ${daysRequested} jours, mais il ne vous reste que ${this.solde.soldeRestant} jours.`, 'Fermer', { duration: 5000 });
        return;
      }
    }

    this.loading = true;
    const uid = this.congeService.getCurrentUserId();
    const sid = this.congeService.getCurrentSocieteId();

    let finalMotif = this.nouvelleDemande.motif;
    if (this.nouvelleDemande.typePointageId === 'HALFDAY') {
      finalMotif = `[Demi-journée : ${this.nouvelleDemande.periode}] ` + finalMotif;
    } else if (this.nouvelleDemande.typePointageId === 'AUTORISATION') {
      finalMotif = `[Autorisation : ${this.nouvelleDemande.heures}h] ` + finalMotif;
    }

    const dto = {
      utilisateurId: uid,
      societeId: sid,
      typePointageId: this.nouvelleDemande.typePointageId,
      dateDebut: this.nouvelleDemande.dateDebut,
      dateFin: this.nouvelleDemande.dateFin,
      status: 'En attente',
      motif: finalMotif
    };

    this.congeService.createDemandeCongeReal(dto).subscribe({
      next: (res: any) => {
        const demandeId = res?.id;
        this.lastDemandeId = demandeId;

        // If sick leave and a file is selected, upload it right after
        if (this.nouvelleDemande.typePointageId === 'MALADIE' && this.justificatifFile && demandeId) {
          this.congeService.uploadJustificatif(demandeId, this.justificatifFile).subscribe({
            next: () => {
              this.snackBar.open('Demande envoyée avec justificatif ✓', 'Fermer', { duration: 4000 });
            },
            error: () => {
              this.snackBar.open('Demande envoyée, échec upload justificatif', 'Fermer', { duration: 4000 });
            }
          });
        } else {
          this.snackBar.open('Votre demande a été envoyée au service RH 📎', 'Fermer', { duration: 4000 });
        }

        this.nouvelleDemande = { typePointageId: 'NORMAL', dateDebut: null, dateFin: null, motif: '', periode: 'Matin', heures: 2 };
        this.justificatifFile = null;
        this.loadData();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi de la demande', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.justificatifFile = input.files[0];
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.justificatifFile = file;
  }
}
