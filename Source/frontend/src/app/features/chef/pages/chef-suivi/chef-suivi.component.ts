import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-suivi',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './chef-suivi.component.html',
  styleUrls: ['./chef-suivi.component.scss']
})
export class ChefSuiviComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = 'Votre société';
  activeTab = 'tableau';
  
  selectedProjet = '';
  projets: any[] = [];

  avancement = 0;
  tempsEstime = 0;
  tempsReel = 0;
  tauxRetard = 0;

  stats = { todo: 0, inProgress: 0, done: 0 };

  taches: any[] = [];
  displayedColumns = ['tache', 'responsable', 'statut', 'temps', 'progression', 'alerte'];

  alertes: any[] = [];
  feedbacks: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    const user = this.api.getCurrentUser();
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = (projets || [])
          .filter((p: any) => p.utilisateurId === user?.id)
          .map((p: any) => ({ id: p.id, nom: p.nom }));
        if (this.projets.length > 0 && !this.selectedProjet) {
          this.selectedProjet = this.projets[0].nom;
        }
        this.updateData();
      },
      error: () => {}
    });
    
    this.api.getTaches().subscribe({
      next: (taches) => {
        const societeTaches = (taches || []).filter((t: any) => (t.societeId || t.SocieteId) === this.societeId);
        this.taches = societeTaches.map((t: any, idx: number) => {
          // Utiliser les vrais assignés si disponibles
          let responsable = 'Non assigné';
          const assignees = t.assignees || t.Assignees || [];
          if (assignees.length > 0) {
            responsable = assignees[0].nom || assignees[0].Nom;
          } else {
            responsable = t.utilisateurNom || t.UtilisateurNom || 'Non assigné';
          }
          
          const status = (t.status || t.Status || t.statut || t.Statut || 'To Do').toLowerCase();
          let progression = t.progression || t.Progression || 0;
          if (progression === 0) {
            if (status === 'done' || status === 'terminé' || status === 'terminée') progression = 100;
            else if (status === 'in progress' || status === 'en cours') progression = 50;
          }

          return {
            id: t.id || t.Id || idx + 1,
            titre: t.nom || t.Nom || t.titre || t.Titre || 'Tâche sans nom',
            responsable: responsable,
            statut: t.status || t.Status || t.statut || t.Statut || 'To Do',
            temps: t.tempsEstime || t.TempsEstime || 0,
            progression: progression,
            retard: t.estEnRetard || t.EstEnRetard || false
          };
        });
        this.stats.done = this.taches.filter(t => {
          const s = t.statut.toLowerCase();
          return s === 'done' || s === 'terminé';
        }).length;
        this.stats.inProgress = this.taches.filter(t => {
          const s = t.statut.toLowerCase();
          return s === 'in progress' || s === 'en cours';
        }).length;
        this.stats.todo = this.taches.filter(t => {
          const s = t.statut.toLowerCase();
          return s === 'to do' || s === 'en attente';
        }).length;
        if (this.taches.length > 0) {
          this.avancement = Math.round(this.stats.done / this.taches.length * 100);
        }
      },
      error: () => {}
    });
  }

  updateData() {
    if (this.selectedProjet) {
      const projet = this.projets.find(p => p.nom === this.selectedProjet);
      this.tempsEstime = projet ? (projet.taches?.length || 10) * 8 : 80;
      this.tempsReel = Math.floor(this.tempsEstime * (1 + Math.random() * 0.3));
      this.tauxRetard = Math.round((this.tempsReel - this.tempsEstime) / this.tempsEstime * 100);
      
      this.feedbacks = [
        { id: 1, projet: this.selectedProjet, type: 'Commentaire', message: 'Livrable reçu, merci de vérifier le design final.', date: 'Aujourd\'hui' },
        { id: 2, projet: this.selectedProjet, type: 'Validation', message: 'L\'étape 1 est validée par notre équipe.', date: 'Hier' }
      ];
    }
    this.snackBar.open('Données mises à jour pour: ' + this.selectedProjet, 'Fermer', { duration: 3000 });
  }
}

