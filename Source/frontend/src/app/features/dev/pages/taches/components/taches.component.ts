import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TacheService } from '../service/tache.service';
import { Tache, Column } from '../model/tache.model';
import { ValidationErrorComponent } from '@shared/components';

@Component({
  selector: 'app-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule, MatSnackBarModule, ValidationErrorComponent],
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.scss']
})
export class TachesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tacheService = inject(TacheService);
  private snackBar = inject(MatSnackBar);
  
  tacheForm!: FormGroup;
  private timerInterval: any;

  viewMode = 'kanban';

  columns: Column[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  connectedLists = ['todo', 'inprogress', 'done'];

  taches: Tache[] = [];

  activeTask: Tache | null = null;
  isTimerRunning = false;
  timerSeconds = 0;
  viewingTache: Tache | null = null;
  tempsTravaille = 0;

  societeId = '';
  societeNom = '';
  compactMode = false;

  ngOnInit() {
    this.initForm();
    const user = this.tacheService.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPreferences();
    this.loadData();
  }

  initForm() {
    this.tacheForm = this.fb.group({
      gitLink: ['', [Validators.pattern('https?://.+')] ],
      techNotes: ['', [Validators.required, Validators.minLength(10)]],
      newComment: ['']
    });
  }

  loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    this.compactMode = prefs.dev?.compactKanban || false;
  }

  loadData() {
    const userId = this.tacheService.getCurrentUserId();
    if (!userId) return;

    // 1. Charger les membres de la société pour le mapping des noms
    this.tacheService.getEmployesBySociete(this.societeId).subscribe({
      next: (membres: any) => {
        const users = membres?.value || membres?.items || (Array.isArray(membres) ? membres : []);
        const userMap = new Map<string, string>();
        users.forEach((u: any) => {
          const id = u.id || u.Id;
          const nom = u.nom || u.Nom || u.userName || u.UserName || 'Utilisateur';
          if (id) userMap.set(id, nom);
        });

        // 2. Charger les projets pour le mapping des noms de projets
        this.tacheService.getProjets().subscribe({
          next: (projets: any) => {
            const projList = projets?.value || projets?.items || (Array.isArray(projets) ? projets : []);
            const projMap = new Map<string, string>();
            projList.forEach((p: any) => {
              const id = p.id || p.Id;
              const nom = p.nom || p.Nom || 'Projet';
              if (id) projMap.set(id, nom);
            });

            // 3. Charger les tâches assignées à l'utilisateur
            this.tacheService.getTachesParUtilisateur(userId).subscribe({
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
                    deadline: t.dateLimite || t.DateLimite ? new Date(t.dateLimite || t.DateLimite).toLocaleDateString('fr-FR') : 'N/A',
                    tempsEstime: t.tempsEstime || t.TempsEstime || 0,
                    assigneeNom: userMap.get(t.utilisateurId || t.UtilisateurId) || 'Moi'
                  };
                });
              }
            });
          }
        });
      }
    });
  }

  getColumnTasks(status: string): Tache[] {
    return this.taches.filter(t => t.statut === status);
  }

  drop(event: CdkDragDrop<Tache[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.statut = event.container.id;
      // Persist status change to backend
      if (task.id) {
        this.tacheService.saveTache({
          id: task.id,
          titre: task.titre,
          description: task.description,
          statut: task.statut,
          priorite: task.priorite,
          projetId: task.projetId,
          utilisateurId: task.utilisateurId,
          dateLimite: task.dateLimite || null
        }).subscribe();
      }
    }
  }

  startTask(tache: Tache) {
    this.activeTask = tache;
    this.startTimer();
    this.snackBar.open('Tâche démarrée', 'Fermer', { duration: 3000 });
  }

  pauseTask(tache: Tache) {
    this.stopTimer();
    this.snackBar.open('Tâche en pause', 'Fermer', { duration: 3000 });
  }

  doneTask(tache: Tache) {
    tache.statut = 'done';
    this.activeTask = null;
    this.stopTimer();

    // Persist Done status to backend
    if (tache.id) {
      this.tacheService.saveTache({
        id: tache.id,
        titre: tache.titre,
        description: tache.description,
        statut: 'done',
        priorite: tache.priorite,
        projetId: tache.projetId,
        utilisateurId: tache.utilisateurId,
        dateLimite: tache.dateLimite || null
      }).subscribe();
    }

    // Trigger notification for Test/QA team
    this.tacheService.createNotification(
      this.societeId,
      'qa',
      'Tâche Prête pour Test (QA)',
      `La tâche "${tache.titre}" a été complétée par le développeur et attend votre validation.`
    ).subscribe();

    this.snackBar.open('Tâche terminée et envoyée en QA!', 'Fermer', { duration: 3000 });
  }

  viewTache(tache: Tache) {
    this.viewingTache = tache;
    this.tacheForm.patchValue({
      gitLink: tache.gitLink || '',
      techNotes: tache.techNotes || '',
      newComment: ''
    });
    this.tempsTravaille = tache.tempsTravaille || 0;
  }

  addComment() {
    const comment = this.tacheForm.get('newComment')?.value;
    if (comment && this.viewingTache) {
      this.viewingTache.commentaires = this.viewingTache.commentaires || [];
      this.viewingTache.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: comment,
        heure: 'À l\'instant'
      });
      this.tacheForm.get('newComment')?.setValue('');
    }
  }

  saveChanges() {
    if (this.tacheForm.invalid) {
      this.tacheForm.markAllAsTouched();
      return;
    }

    if (this.viewingTache) {
      const t = this.viewingTache;
      const formVal = this.tacheForm.value;
      // Build clean payload — use raw date fields only, NOT display strings like 'N/A'
      const payload = {
        id: t.id,
        titre: t.titre,
        description: t.description,
        statut: t.statut,
        priorite: t.priorite,
        projetId: t.projetId || null,
        utilisateurId: t.utilisateurId || null,
        dateLimite: t.dateLimite || null,   // raw ISO date from backend, NOT t.deadline
        tempsEstime: t.tempsEstime || 0,
        tempsReel: this.tempsTravaille,
        devComment: formVal.gitLink ? `Git: ${formVal.gitLink}\n${formVal.techNotes || ''}` : (formVal.techNotes || ''),
        actif: true
      };
      this.tacheService.saveTache(payload).subscribe({
        next: () => {
          this.loadData();
          this.viewingTache = null;
          this.snackBar.open('Tâche mise à jour sur le serveur', 'Fermer', { duration: 3000 });
        },
        error: (err: any) => {
          const msg = err?.error || err?.message || 'Erreur lors de la mise à jour';
          this.snackBar.open(`Erreur: ${msg}`, 'Fermer', { duration: 5000 });
        }
      });
    }
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
