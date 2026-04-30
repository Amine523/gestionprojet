import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './qa-bugs.component.html',
  styleUrls: ['./qa-bugs.component.scss']
})
export class QaBugsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);

  societeId = '';
  societeNom = '';
  filterProjet = '';
  filterStatut = '';

  stats = { ouverts: 0, enCours: 0, corriges: 0 };
  bugs: any[] = [];
  projets: any[] = [];

  showCreateForm = false;
  viewingBug: any = null;
  newComment = '';
  formData: any = { titre: '', description: '', projetId: '', priorite: 'Medium', steps: '' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadProjets();
    this.loadBugs();
  }

  loadProjets() {
    this.api.getProjetsBySociete(this.societeId).subscribe(res => {
      this.projets = res || [];
    });
  }

  loadBugs() {
    this.api.getTaches().subscribe(all => {
      // Filtrer les tâches qui sont des bugs ou qui appartiennent à la société de l'utilisateur
      // Pour cet exemple, on considère que toutes les tâches avec le statut "Bug" ou créées par QA sont des bugs
      const projectIds = new Set(this.projets.map(p => p.id || p.Id));
      this.bugs = (all || []).filter((t: any) => projectIds.has(t.projetId || t.ProjetId))
        .map((t: any) => ({
          id: t.id || t.Id,
          titre: t.titre || t.Titre,
          description: t.description || t.Description,
          projet: this.projets.find(p => (p.id || p.Id) === (t.projetId || t.ProjetId))?.nom || 'Inconnu',
          projetId: t.projetId || t.ProjetId,
          priorite: t.priorite || t.Priorite || 'Medium',
          statut: t.statut || t.Statut || 'Open',
          assignee: '',
          commentaires: t.testComment ? [{ id: 1, auteur: 'Système', texte: t.testComment, heure: 'Auto' }] : []
        }));
      this.updateStats();
    });
  }

  updateStats() {
    this.stats.ouverts = this.bugs.filter(b => b.statut === 'Open' || b.statut === 'Todo').length;
    this.stats.enCours = this.bugs.filter(b => b.statut === 'In_progress' || b.statut === 'InProgress').length;
    this.stats.corriges = this.bugs.filter(b => b.statut === 'Fixed' || b.statut === 'Done').length;
  }

  get filteredBugs() {
    return this.bugs.filter(b => {
      const matchProjet = !this.filterProjet || b.projetId === this.filterProjet;
      const matchStatut = !this.filterStatut || b.statut === this.filterStatut;
      return matchProjet && matchStatut;
    });
  }

  affecter(bug: any) {
    this.snackBar.open('Demande d\'affectation envoyée au Chef de Projet', 'OK', { duration: 2000 });
  }

  corriger(bug: any) {
    bug.statut = 'Fixed';
    this.api.saveTache({ ...bug, Id: bug.id, Statut: 'Fixed' }).subscribe(() => {
      this.snackBar.open('Bug marqué corrigé dans la base de données', 'OK', { duration: 2000 });
      this.loadBugs();
    });
  }

  details(bug: any) {
    this.viewingBug = bug;
    this.formData = {
      titre: bug.titre,
      description: bug.description,
      projetId: bug.projetId,
      priorite: bug.priorite,
      steps: ''
    };
    this.newComment = '';
  }

  addComment() {
    if (this.newComment && this.viewingBug) {
      this.viewingBug.commentaires.push({
        id: Date.now(),
        auteur: 'QA',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      // Optionnel: Sauvegarder dans le champ TestComment de la tâche
      this.api.saveTache({ 
        Id: this.viewingBug.id, 
        TestComment: this.newComment,
        Titre: this.viewingBug.titre,
        Statut: this.viewingBug.statut 
      }).subscribe();
      this.newComment = '';
    }
  }

  closeForm() {
    this.showCreateForm = false;
    this.viewingBug = null;
    this.formData = { titre: '', description: '', projetId: '', priorite: 'Medium', steps: '' };
  }

  saveBug() {
    if (this.formData.titre && this.formData.description && this.formData.projetId) {
      const bugData = {
        Id: this.viewingBug ? this.viewingBug.id : '',
        Titre: this.formData.titre,
        Description: this.formData.description,
        ProjetId: this.formData.projetId,
        Priorite: this.formData.priorite,
        Statut: this.viewingBug ? this.viewingBug.statut : 'Open',
        TestComment: this.formData.steps ? 'Étapes: ' + this.formData.steps : ''
      };

      this.api.saveTache(bugData).subscribe({
        next: () => {
          this.snackBar.open('Bug synchronisé avec le backend', 'OK', { duration: 2000 });
          this.loadBugs();
          this.closeForm();
        },
        error: () => this.snackBar.open('Erreur de synchronisation', 'Fermer', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Veuillez remplir les champs obligatoires', 'Fermer', { duration: 3000 });
    }
  }
}

