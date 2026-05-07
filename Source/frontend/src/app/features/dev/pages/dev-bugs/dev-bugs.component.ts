import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dev-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './dev-bugs.component.html',
  styleUrls: ['./dev-bugs.component.scss']
})
export class DevBugsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  filterProjet = '';
  filterPriorite = '';

stats = { ouverts: 0, enCours: 0, corriges: 0, total: 0 };

  bugs: any[] = [];

  displayedColumns = ['titre', 'priorite', 'statut', 'projet', 'actions'];
  viewingBug: any = null;
  newComment = '';
  
  societeId = '';
  societeNom = '';

  get filteredBugs() {
    return this.bugs.filter(b => {
      const matchProjet = !this.filterProjet || b.projet === this.filterProjet;
      const matchPriorite = !this.filterPriorite || b.priorite === this.filterPriorite;
      return matchProjet && matchPriorite;
    });
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    const currentUser = this.api.getCurrentUser();
    this.api.getTaches().subscribe({
      next: (taches) => {
        let societeTaches = (taches || []).filter((t: any) => t.societeId === this.societeId && t.type === 'bug');
        this.bugs = societeTaches.filter((t: any) => t.assignee === currentUser?.nom || t.assignee === currentUser?.id);
        if (this.bugs.length === 0) {
          this.initDefaultBugs();
        }
        this.calculateStats();
      },
      error: () => { this.initDefaultBugs(); this.calculateStats(); }
    });
  }
  
  initDefaultBugs() {
    this.bugs = [];
  }
  
  calculateStats() {
    this.stats.ouverts = this.bugs.filter(b => b.statut === 'Ouvert').length;
    this.stats.enCours = this.bugs.filter(b => b.statut === 'En cours').length;
    this.stats.corriges = this.bugs.filter(b => b.statut === 'Corrigé').length;
    this.stats.total = this.bugs.length;
  }

  viewDetails(bug: any) {
    this.viewingBug = bug;
    this.newComment = '';
  }

  addComment() {
    if (this.newComment && this.viewingBug) {
      this.viewingBug.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }

  corriger(bug: any) {
    bug.statut = 'Corrigé';
    this.stats.corriges++;
    this.stats.ouverts--;
    this.snackBar.open('Bug marqué comme corrigé', 'Fermer', { duration: 3000 });
  }
}

