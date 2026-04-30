import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dev-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatSnackBarModule],
  templateUrl: './dev-taches.component.html',
  styleUrls: ['./dev-taches.component.scss']
})
export class DevTachesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private timerInterval: any;

  viewMode = 'kanban';

  columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  connectedLists = ['todo', 'inprogress', 'done'];

taches: any[] = [
    { id: 1, titre: 'Implémenter auth JWT', description: 'Créer le middleware d\'authentification JWT avec refresh token', priorite: 'High', statut: 'inprogress', projet: 'API REST', deadline: 'Aujourd\'hui', tempsEstime: 4, piecesJointes: [], commentaires: [{id: 1, auteur: 'Chef', texte: 'Penser à inclure le refresh token', heure: 'Hier'}] },
    { id: 2, titre: 'Tests unitaires', description: 'Écrire les tests pour le module auth', priorite: 'Medium', statut: 'todo', projet: 'API REST', deadline: 'Demain', tempsEstime: 2, piecesJointes: [], commentaires: [] },
    { id: 3, titre: 'Page profil utilisateur', description: 'Design et implémentation du profil', priorite: 'Low', statut: 'todo', projet: 'App Mobile', deadline: '25/04', tempsEstime: 3, piecesJointes: ['mockup.png'], commentaires: [] },
    { id: 4, titre: 'Correction bug login', description: 'Debug de la validation mot de passe', priorite: 'High', statut: 'done', projet: 'App Mobile', deadline: 'Terminé', tempsEstime: 2, piecesJointes: [], commentaires: [{id: 1, auteur: 'QA', texte: 'Bug confirmé', heure: 'Mardi'}] }
  ];

  displayedColumns = ['titre', 'projet', 'priorite', 'statut', 'deadline', 'actions'];

  activeTask: any = null;
  isTimerRunning = false;
  timerSeconds = 0;
  viewingTache: any = null;
  gitLink = '';
  techNotes = '';
  tempsTravaille = 0;
  newComment = '';
  
  societeId = '';
  societeNom = '';
  compactMode = false;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPreferences();
    this.loadData();
  }

  loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    this.compactMode = prefs.dev?.compactKanban || false;
  }
  
  loadData() {
    const currentUser = this.api.getCurrentUser();
    const userId = currentUser?.id || currentUser?.Id || '';
    if (!userId) return;

    // 1. Charger les membres de la société pour le mapping des noms
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (membres: any) => {
        const users = membres?.items || membres || [];
        const userMap = new Map<string, string>();
        users.forEach((u: any) => {
          const id = u.id || u.Id;
          const nom = u.nom || u.Nom || u.userName || u.UserName || 'Utilisateur';
          if (id) userMap.set(id, nom);
        });

        // 2. Charger les projets pour le mapping des noms de projets
        this.api.getProjets().subscribe({
          next: (projets: any) => {
            const projList = projets?.items || projets || [];
            const projMap = new Map<string, string>();
            projList.forEach((p: any) => {
              const id = p.id || p.Id;
              const nom = p.nom || p.Nom || 'Projet';
              if (id) projMap.set(id, nom);
            });

            // 3. Charger les tâches assignées à l'utilisateur
            this.api.getTachesParUtilisateur(userId).subscribe({
              next: (tasks: any[]) => {
                this.taches = (tasks || []).map((t: any) => {
                  const rawStatus = (t.statut || t.Statut || t.status || '').toLowerCase().trim().replace(/ /g, '');
                  let normalizedStatus = 'todo';
                  if (['done', 'terminé', 'terminée', 'valide', 'validé'].includes(rawStatus)) normalizedStatus = 'done';
                  else if (['inprogress', 'encours', 'en cours', 'développement'].includes(rawStatus)) normalizedStatus = 'inprogress';

                  return {
                    ...t,
                    id: t.id || t.Id,
                    titre: t.titre || t.Titre || 'Sans titre',
                    description: t.description || t.Description || '',
                    priorite: t.priorite || t.Priorite || 'Medium',
                    statut: normalizedStatus,
                    projet: projMap.get(t.projetId || t.ProjetId) || t.projetNom || t.ProjetNom || 'Interne',
                    deadline: t.dateLimite ? new Date(t.dateLimite).toLocaleDateString('fr-FR') : (t.deadline || 'N/A'),
                    tempsEstime: t.tempsEstime || t.TempsEstime || 0,
                    assigneeNom: userMap.get(t.assigneeId || t.AssigneeId) || 'Non assigné'
                  };
                });
              }
            });
          }
        });
      }
    });
  }


  getColumnTasks(status: string): any[] {
    return this.taches.filter(t => t.statut === status);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.statut = event.container.id;
    }
  }

  startTask(tache: any) {
    this.activeTask = tache;
    this.startTimer();
    this.snackBar.open('Tâche démarrée', 'Fermer', { duration: 3000 });
  }

  pauseTask(tache: any) {
    this.stopTimer();
    this.snackBar.open('Tâche en pause', 'Fermer', { duration: 3000 });
  }

  doneTask(tache: any) {
    tache.statut = 'done';
    this.activeTask = null;
    this.stopTimer();

    // Trigger notification for Test/QA team
    this.api.createNotification(
      this.societeId,
      'qa',
      'Tâche Prête pour Test (QA)',
      `La tâche "${tache.titre}" a été complétée par le développeur et attend votre validation.`
    );

    this.snackBar.open('Tâche terminée et envoyée en QA!', 'Fermer', { duration: 3000 });
  }

  viewTache(tache: any) {
    this.viewingTache = tache;
    this.gitLink = '';
    this.techNotes = tache.techNotes || '';
    this.tempsTravaille = tache.tempsTravaille || 0;
    this.newComment = '';
  }

  addComment() {
    if (this.newComment && this.viewingTache) {
      this.viewingTache.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }

  saveChanges() {
    if (this.viewingTache) {
      this.viewingTache.gitLink = this.gitLink;
      this.viewingTache.techNotes = this.techNotes;
      this.viewingTache.tempsTravaille = this.tempsTravaille;
    }
    this.viewingTache = null;
    this.snackBar.open('Modifications enregistrées', 'Fermer', { duration: 3000 });
  }

  startTimer() {
    this.isTimerRunning = true;
    this.timerInterval = setInterval(() => { this.timerSeconds++; }, 1000);
  }

  stopTimer() {
    this.isTimerRunning = false;
    if (this.timerInterval) { clearInterval(this.timerInterval); }
  }

  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}

