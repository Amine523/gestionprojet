import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-rh-conges',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './rh-conges.component.html',
  styleUrls: ['./rh-conges.component.scss']
})
export class RhCongesComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);
  private notificationService = inject(NotificationService);
  
  societeId: string = '';
  societeNom: string = '';
  currentUserId: string = '';
  
  congesSignal = signal<Conge[]>([]);
  statsSignal = signal({ totalEmployes: 0, congesValidesCeMois: 0, demandesCongesEnAttente: 0 });
  employesMap: { [id: string]: string } = {};

  enAttenteCount = computed(() => this.congesSignal().filter(c => c.status === 'En attente').length);

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = this.api.getCurrentSocieteId();
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
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
          this.employesMap[e.id || e.Id] = (e.prenom || e.Prenom || '') + ' ' + (e.nom || e.Nom || '');
        });

        this.api.getDemandesEnAttenteReal(this.societeId).subscribe({
          next: (data) => {
            const list = data.map((d: any) => {
              const uId = d.utilisateurId || d.UtilisateurId;
              const uNom = d.utilisateurNom || d.UtilisateurNom || this.employesMap[uId] || 'Utilisateur ' + uId;
              return {
                id: d.id || d.Id,
                utilisateurId: uId,
                utilisateurNom: uNom,
                typeNom: d.typeNom || d.TypeNom || 'Congé',
                dateDebut: d.dateDebut || d.DateDebut,
                dateFin: d.dateFin || d.DateFin,
                nombreJours: d.jours || d.Jours || 0,
                motif: d.motif || d.Motif || '',
                status: this.formatStatus(d.status || d.Status || 'En attente')
              };
            });
            this.congesSignal.set(list);
          },
          error: () => this.congesSignal.set([])
        });
      },
      error: () => this.congesSignal.set([])
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

  validerConge(conge: Conge, approuve: boolean) {
    const status = approuve ? 'Validée' : 'Refusée';
    const typeNotif = approuve ? 'success' : 'error';
    
    this.api.validerDemandeCongeReal(conge.id, this.currentUserId, approuve).subscribe({
      next: (res) => {
        this.congesSignal.update(list => list.map(c => c.id === conge.id ? { ...c, status } : c));
        
        // Notifier le collaborateur
        this.notificationService.notifyUser(
          conge.utilisateurId, 
          `Demande de congé ${status}`, 
          `Votre demande pour la période du ${new Date(conge.dateDebut).toLocaleDateString()} au ${new Date(conge.dateFin).toLocaleDateString()} a été ${status.toLowerCase()}.`,
          typeNotif
        ).subscribe();

        // Notifier le Chef de Projet (Liaison Cross-Actor)
        // Pour simplifier, on envoie une notification à la société si c'est une validation importante
        if (approuve) {
           this.notificationService.notifySociete(
             this.societeId,
             `Absence validée: ${conge.utilisateurNom}`,
             `${conge.utilisateurNom} sera absent du ${new Date(conge.dateDebut).toLocaleDateString()} au ${new Date(conge.dateFin).toLocaleDateString()}.`,
             'info'
           ).subscribe();
        }

        this.snackBar.open(res.message, 'Fermer', { duration: 3000 });
        this.loadStats();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la validation', 'Fermer', { duration: 3000 });
      }
    });
  }

  voirDetail(conge: Conge) {
    this.snackBar.open(`Détails de la demande #${conge.id} - ${conge.utilisateurNom}`, 'Fermer', { duration: 5000 });
  }
}
