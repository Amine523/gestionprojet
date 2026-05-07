import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BugService } from '../service/bug.service';
import { Bug, BugStats } from '../model/bug.model';

@Component({
  selector: 'app-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.scss']
})
export class BugsComponent implements OnInit {
  private bugService = inject(BugService);
  private snackBar = inject(MatSnackBar);

  filterProjet = '';
  filterPriorite = '';

  stats: BugStats = { ouverts: 0, enCours: 0, corriges: 0, total: 0 };

  bugs: Bug[] = [];

  displayedColumns = ['titre', 'priorite', 'statut', 'projet', 'actions'];
  viewingBug: Bug | null = null;
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
    const user = this.bugService.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    const currentUser = this.bugService.getCurrentUser();
    this.bugService.getTaches().subscribe({
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

  viewDetails(bug: Bug) {
    this.viewingBug = bug;
    this.newComment = '';
  }

  addComment() {
    if (this.newComment && this.viewingBug) {
      this.viewingBug.commentaires = this.viewingBug.commentaires || [];
      this.viewingBug.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }

  corriger(bug: Bug) {
    bug.statut = 'Corrigé';
    this.stats.corriges++;
    this.stats.ouverts--;
    this.snackBar.open('Bug marqué comme corrigé', 'Fermer', { duration: 3000 });
  }
}
