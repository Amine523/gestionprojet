import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-dev-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './dev-conges.component.html',
  styleUrls: ['./dev-conges.component.scss']
})
export class DevCongesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  solde = { soldeTotal: 30, soldeUtilise: 0, soldeRestant: 30, congesEnAttente: 0, congesValides: 0 };
  conges: any[] = [];
  nouvelleDemande = { typePointageId: 'NORMAL', dateDebut: null, dateFin: null, motif: '', periode: 'Matin', heures: 2 };
  loading = false;
  justificatifFile: File | null = null;
  lastDemandeId: string | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const uid = this.api.getCurrentUserId();
    this.api.getSoldeConge(uid).subscribe(res => {
      this.solde = res;
    });
    
    // Get all requests for history
    this.api.getDemandesCongeByUtilisateur(uid).subscribe(data => {
      if (data) {
        this.conges = data.map((d: any) => {
            const dDebut = new Date(d.dateDebut || d.DateDebut);
            const dFin = new Date(d.dateFin || d.DateFin);
            let nj = d.jours || d.Jours || 0;
            if (!nj && !isNaN(dDebut.getTime()) && !isNaN(dFin.getTime())) {
              const diffTime = Math.abs(dFin.getTime() - dDebut.getTime());
              nj = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
    }

    this.loading = true;
    const uid = this.api.getCurrentUserId();
    const sid = this.api.getCurrentSocieteId();
    
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

    this.api.createDemandeCongeReal(dto).subscribe({
      next: (res: any) => {
        const demandeId = res?.id;
        this.lastDemandeId = demandeId;

        // If sick leave and a file is selected, upload it right after
        if (this.nouvelleDemande.typePointageId === 'MALADIE' && this.justificatifFile && demandeId) {
          this.api.uploadJustificatif(demandeId, this.justificatifFile).subscribe({
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

