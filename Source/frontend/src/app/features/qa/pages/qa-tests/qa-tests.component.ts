import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './qa-tests.component.html',
  styleUrls: ['./qa-tests.component.scss']
})
export class QaTestsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);

  societeId = '';
  societeNom = '';
  filterProjet = '';
  filterPriorite = '';
  filterStatut = '';

  tests: any[] = [];

  displayedColumns = ['nom', 'type', 'projet', 'priorite', 'statut', 'actions'];
  viewingTest: any = null;
  newComment = '';

  get filteredTests() {
    return this.tests.filter(t => {
      const matchProjet = !this.filterProjet || t.projet === this.filterProjet;
      const matchPriorite = !this.filterPriorite || t.priorite === this.filterPriorite;
      const matchStatut = !this.filterStatut || t.statut === this.filterStatut;
      return matchProjet && matchPriorite && matchStatut;
    });
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadTests();
  }

  loadTests() {
    const currentUser = this.api.getCurrentUser();
    const userId = currentUser?.id || currentUser?.Id || '';
    if (!userId) return;

    this.api.getTachesParUtilisateur(userId).subscribe({
      next: (tasks: any[]) => {
        this.tests = (tasks || []).map((t: any) => {
          const rawStatus = (t.statut || t.Statut || t.status || '').toLowerCase().trim().replace(/ /g, '');
          let normalizedStatus = 'Pending';
          if (['done', 'terminé', 'terminée', 'valide', 'validé', 'pass'].includes(rawStatus)) normalizedStatus = 'Pass';
          else if (['fail', 'echoué', 'échec'].includes(rawStatus)) normalizedStatus = 'Fail';

          return {
            id: t.id || t.Id,
            nom: t.titre || t.Titre || 'Sans titre',
            type: 'Tâche',
            projet: t.projetNom || t.ProjetNom || 'Projet',
            priorite: t.priorite || t.Priorite || 'Medium',
            statut: normalizedStatus,
            description: t.description || t.Description || '',
            commentaires: []
          };
        });
      }
    });
  }

  viewDetails(test: any) {
    this.viewingTest = test;
    this.newComment = '';
  }

  passTest(test: any) {
    test.statut = 'Pass';
    this.snackBar.open('Test marqué comme PASS', 'Fermer', { duration: 2000 });
  }

  failTest(test: any) {
    test.statut = 'Fail';
    this.snackBar.open('Test marqué comme FAIL', 'Fermer', { duration: 2000 });
  }

  addComment() {
    if (this.newComment && this.viewingTest) {
      this.viewingTest.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
       heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }
}

