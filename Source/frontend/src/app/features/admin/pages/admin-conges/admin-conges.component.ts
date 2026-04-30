import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

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
  selector: 'app-admin-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './admin-conges.component.html',
  styleUrls: ['./admin-conges.component.scss']
})
export class AdminCongesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private notificationService = inject(NotificationService);

  societeId = '';
  societeNom = '';
  currentUserId = '';
  
  congesSignal = signal<Conge[]>([]);
  statsSignal = signal({ totalEmployes: 0, congesValidesCeMois: 0, demandesCongesEnAttente: 0 });
  activeTab = 'pending';
  employesMap: { [id: string]: string } = {};

  enAttenteCount = computed(() => this.congesSignal().filter(c => c.status === 'En attente').length);

  filteredConges = computed(() => {
    const list = this.congesSignal();
    if (this.activeTab === 'pending') return list.filter(c => c.status === 'En attente');
    if (this.activeTab === 'approved') return list.filter(c => c.status === 'Validée');
    return list;
  });

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.currentUserId = user?.id || '';
    this.loadData();
  }

  loadData() {
    this.loadStats();
    this.loadConges();
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

        this.api.getDemandesCongeBySociete(this.societeId).subscribe({
          next: (data) => {
            const list = data.map((d: any) => {
              const uId = d.utilisateurId || d.UtilisateurId;
              const uNom = d.utilisateurNom || d.UtilisateurNom || this.employesMap[uId] || 'Utilisateur ' + uId;
              
              let jours = d.jours || d.Jours || 0;
              if (jours === 0 && d.dateDebut && d.dateFin) {
                const start = new Date(d.dateDebut);
                const end = new Date(d.dateFin);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                jours = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              }

              return {
                id: d.id || d.Id,
                utilisateurId: uId,
                utilisateurNom: uNom,
                typeNom: d.typeNom || d.TypeNom || 'Congé',
                dateDebut: d.dateDebut || d.DateDebut,
                dateFin: d.dateFin || d.DateFin,
                nombreJours: jours,
                motif: d.motif || d.Motif || '',
                status: this.normalizeStatus(d.status || d.Status || 'En attente')
              };
            });
            this.congesSignal.set(list);
          },
          error: () => {
            this.snackBar.open('Erreur de chargement des demandes', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  private normalizeStatus(status: string): string {
    if (!status) return 'En attente';
    const s = status.toLowerCase().replace('_', ' ');
    if (s === 'en attente') return 'En attente';
    if (s === 'validée' || s === 'valide' || s === 'approuvé' || s === 'validé') return 'Validée';
    if (s === 'refusée' || s === 'refuse') return 'Refusée';
    return status;
  }

  validerConge(conge: Conge, approuve: boolean) {
    const status = approuve ? 'Validée' : 'Refusée';
    const typeNotif = approuve ? 'success' : 'error';

    this.api.validerDemandeCongeReal(conge.id, this.currentUserId, approuve).subscribe({
      next: (res) => {
        this.congesSignal.update(list => list.map(c => c.id === conge.id ? { ...c, status } : c));
        
        this.notificationService.notifyUser(
          conge.utilisateurId, 
          `Demande de congé ${status}`, 
          `Votre demande pour la période du ${new Date(conge.dateDebut).toLocaleDateString()} au ${new Date(conge.dateFin).toLocaleDateString()} a été ${status.toLowerCase()}.`,
          typeNotif
        );

        this.snackBar.open(res.message || `Demande ${status.toLowerCase()} avec succès`, 'Fermer', { duration: 3000 });
        this.loadStats();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la validation', 'Fermer', { duration: 3000 });
      }
    });
  }

  voirDetail(conge: Conge) {
    this.snackBar.open(`Détails: #${conge.id.substring(0,6)} - Motif: ${conge.motif || 'Aucun'}`, 'Fermer', { duration: 5000 });
  }
}
