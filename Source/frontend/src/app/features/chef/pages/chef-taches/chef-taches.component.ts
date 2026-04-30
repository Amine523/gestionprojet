import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatSnackBarModule],
  templateUrl: './chef-taches.component.html',
  styleUrls: ['./chef-taches.component.scss']
})
export class ChefTachesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private notificationService = inject(NotificationService);

  societeId = '';
  societeNom = 'Votre société';
  selectedProjet: number | null = null;

  columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  connectedLists = ['todo', 'inprogress', 'done'];

  taches: any[] = [];
  membres: any[] = [];
  projets: any[] = [];

  showTacheForm = false;
  editingTache: any = null;
  viewingTache: any = null;
  formData: any = { titre: '', description: '', priorite: 'Medium', assigneeId: '', dateEcheance: '', projetId: '' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    // Load projets for this societe first, then filter tasks by matching projetId
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = (projets || [])
          .map((p: any) => ({ id: p.id || p.Id, nom: p.nom || p.Nom || p.titre || p.Titre }));

        // Load members FIRST to have them available for task mapping
        this.api.getEmployesBySociete(this.societeId).subscribe({
          next: (res: any) => {
            const list = Array.isArray(res) ? res : (res?.items || []);
            this.membres = list
              .filter((e: any) => {
                const typeId = (e.typeUtilisateurId || e.TypeUtilisateurId || e.typeUtilisateur?.id || e.TypeUtilisateur?.Id || '').toString().toUpperCase();
                const poste = (e.poste || e.Poste || '').toString().toUpperCase();
                return typeId === 'T005' || typeId === 'T006' ||
                  typeId.includes('DEV') || typeId.includes('TEST') || typeId.includes('QA') ||
                  poste.includes('DEV') || poste.includes('TEST') || poste.includes('QA');
              })
              .map((e: any) => ({ id: e.id || e.Id, nom: (e.nom || e.Nom || '') + ' ' + (e.prenom || e.Prenom || '') }));

            // Now load tasks
            const projetIds = new Set(this.projets.map((p: any) => String(p.id)));
            this.api.getTaches().subscribe({
              next: (taches) => {
                const allTaches = (taches || [])
                  .filter((t: any) => {
                    const pId = t.projetId || t.ProjetId;
                    return projetIds.has(String(pId)) || projetIds.size === 0;
                  })
                  .map((t: any) => {
                    const rawStatus = (t.statut || t.Statut || t.status || t.Status || '').toLowerCase().trim();
                    let normalizedStatus = 'todo';
                    if (rawStatus === 'done' || rawStatus === 'terminé' || rawStatus === 'terminee' || rawStatus === 'terminée') normalizedStatus = 'done';
                    else if (rawStatus === 'in progress' || rawStatus === 'en cours' || rawStatus === 'inprogress') normalizedStatus = 'inprogress';
                    return {
                      ...t,
                      id: t.id || t.Id,
                      titre: t.titre || t.Titre,
                      description: t.description || t.Description,
                      statut: normalizedStatus,
                      priorite: t.priorite || t.Priorite || 'Medium',
                      dateLimite: t.dateLimite || t.DateLimite || t.dateFin || t.DateFin,
                      projetId: t.projetId || t.ProjetId,
                      assignees: [] // will be filled below
                    };
                  });

                this.taches = allTaches;

                // Now enrich each task with its assignees from TacheAssignation
                this.api.get<any>('tacheassignees/Liste').subscribe({
                  next: (res: any) => {
                    const assignations = Array.isArray(res) ? res : (res?.items || []);
                    const assignationMap = new Map<string, string[]>();
                    assignations.forEach((a: any) => {
                      const tid = a.tacheId || a.TacheId || '';
                      const uid = a.utilisateurId || a.UtilisateurId || '';
                      if (tid && uid) {
                        if (!assignationMap.has(tid)) assignationMap.set(tid, []);
                        assignationMap.get(tid)!.push(uid);
                      }
                    });

                    this.taches = this.taches.map((t: any) => {
                      const userIds = assignationMap.get(t.id) || [];
                      const assignees = userIds.map((uid: string) => {
                        const member = this.membres.find((m: any) => String(m.id) === String(uid));
                        return member ? { id: member.id, nom: member.nom } : { id: uid, nom: 'Inconnu' };
                      });
                      return { ...t, assignees };
                    });
                  },
                  error: () => { /* keep assignees empty if endpoint fails */ }
                });
              },
              error: () => { }
            });

          },
          error: () => { }
        });
      },
      error: () => { }
    });
  }

  getColumnTasks(columnId: string): any[] {
    return this.taches.filter(t => {
      const s = (t.statut || t.status || '').toLowerCase().trim().replace(/ /g, '');
      switch (columnId) {
        case 'todo': return s === 'todo' || s === 'todo' || s === 'todo';
        case 'inprogress': return s === 'inprogress' || s === 'encours';
        case 'done': return s === 'done' || s === 'termin\u00e9' || s === 'terminee';
        default: return s === columnId;
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.statut = event.container.id;
      task.status = event.container.id;
      this.api.saveTache(task).subscribe();
    }
  }

  viewTache(t: any) { this.viewingTache = t; }
  editTache(t: any) {
    this.editingTache = t;
    this.formData = {
      titre: t.titre || t.nom,
      description: t.description,
      priorite: t.priorite || 'Medium',
      assigneeId: t.assignees && t.assignees.length > 0 ? t.assignees[0].id : '',
      dateEcheance: (t.dateLimite || t.dateEcheance) ? new Date(t.dateLimite || t.dateEcheance).toISOString().split('T')[0] : '',
      projetId: t.projetId
    };
  }
  deleteTache(t: any) {
    if (confirm('Supprimer cette tâche?')) {
      this.api.saveTache({ ...t, Actif: false, Id: t.id }).subscribe({
        next: () => {
          this.taches = this.taches.filter((x: any) => x.id !== t.id);
          this.snackBar.open('Tâche supprimée', 'Fermer', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
    }
  }

  openAddTache() {
    this.formData = { titre: '', description: '', priorite: 'Medium', assigneeId: '', dateEcheance: '', projetId: '' };
    this.showTacheForm = true;
  }

  closeForm() {
    this.showTacheForm = false;
    this.editingTache = null;
    this.viewingTache = null;
  }

  saveTache() {
    if (!this.formData.titre) {
      this.snackBar.open('Veuillez entrer un titre', 'Fermer', { duration: 3000 });
      return;
    }
    if (!this.formData.projetId) {
      this.snackBar.open('Veuillez sélectionner un projet', 'Fermer', { duration: 3000 });
      return;
    }

    // Mapping frontend data to backend Tache entity
    // Normalize statut from internal kanban ids to backend expected values
    let statutValue = 'To Do';
    if (this.editingTache) {
      const rawS = (this.editingTache.statut || this.editingTache.status || '').toLowerCase();
      if (rawS === 'done' || rawS === 'terminé' || rawS === 'terminée') statutValue = 'Done';
      else if (rawS === 'inprogress' || rawS === 'in progress' || rawS === 'en cours') statutValue = 'In Progress';
      else statutValue = 'To Do';
    }

    const taskData: any = {
      titre: this.formData.titre,
      description: this.formData.description || '',
      priorite: this.formData.priorite || 'Medium',
      statut: statutValue,
      dateFin: (this.formData.dateEcheance && !isNaN(new Date(this.formData.dateEcheance).getTime())) ? new Date(this.formData.dateEcheance).toISOString() : null,
      projetId: this.formData.projetId,
      societeId: this.societeId,
      // Send null when no assignee selected — empty string causes backend issues
      utilisateurId: this.formData.assigneeId ? this.formData.assigneeId : null,
      devComment: '',
      testComment: '',
      actif: true
    };

    if (this.editingTache) {
      taskData.id = this.editingTache.id;
    }

    this.api.saveTache(taskData).subscribe({
      next: () => {
        const assigneeId = taskData.utilisateurId;
        const assignee = assigneeId ? this.membres.find((m: any) => String(m.id) === String(assigneeId)) : null;

        // After save, also persist the assignation if an assignee was selected (for editing where we know the id)
        if (assigneeId && this.editingTache?.id) {
          this.api.assignerTache(this.editingTache.id, assigneeId).subscribe({
            next: () => {
              this.notificationService.notifyUser(
                assigneeId,
                'Nouvelle Tâche Assignée',
                `Le Chef de Projet vous a assigné la tâche: ${taskData.titre}`,
                'info'
              );
            },
            error: (e: any) => console.warn('Assignation:', e?.error || e)
          });
        }

        if (this.editingTache) {
          const idx = this.taches.findIndex((t: any) => t.id === this.editingTache.id);
          if (idx !== -1) {
            const rawStatus = (taskData.statut || 'To Do').toLowerCase();
            let normalizedStatus = 'todo';
            if (rawStatus === 'done' || rawStatus === 'terminé' || rawStatus === 'terminée') normalizedStatus = 'done';
            else if (rawStatus === 'in progress' || rawStatus === 'en cours' || rawStatus === 'inprogress') normalizedStatus = 'inprogress';
            this.taches[idx] = {
              ...this.taches[idx], ...taskData,
              statut: normalizedStatus,
              assignees: assignee ? [{ id: assignee.id, nom: assignee.nom }] : this.taches[idx].assignees
            };
          }
        } else {
          const newTask = {
            ...taskData,
            id: 'temp-' + Date.now(),
            statut: 'todo',
            titre: taskData.titre,
            dateLimite: taskData.dateFin,
            assignees: assignee ? [{ id: assignee.id, nom: assignee.nom }] : []
          };
          this.taches = [...this.taches, newTask];
        }

        this.snackBar.open('Tâche enregistrée avec succès', 'Fermer', { duration: 3000 });
        this.closeForm();
        // Reload to get server-assigned ID, then assign if needed
        const pendingAssigneeId = taskData.utilisateurId;
        const isNew = !this.editingTache;
        const tacheTitre = taskData.titre;

        setTimeout(() => {
          this.loadData();

          // For NEW tasks: after reload, find the just-created task by titre and assign
          if (isNew && pendingAssigneeId) {
            setTimeout(() => {
              const newT = this.taches.find((t: any) => (t.titre || t.Titre) === tacheTitre);
              if (newT?.id && !String(newT.id).startsWith('temp-')) {
                this.api.assignerTache(newT.id, pendingAssigneeId).subscribe({
                  next: () => {
                    this.notificationService.notifyUser(
                      pendingAssigneeId,
                      'Nouvelle Tâche Assignée',
                      `Le Chef de Projet vous a assigné la tâche: ${tacheTitre}`,
                      'info'
                    );
                    // Reload again to show assignee name
                    this.loadData();
                  },
                  error: (e: any) => console.warn('Assignation nouvelle tâche:', e?.error || e)
                });
              }
            }, 800);
          }
        }, 600);
      },
      error: (err) => {
        console.error('Error saving task:', err);
        this.snackBar.open('Erreur lors de l\'enregistrement de la tâche', 'Fermer', { duration: 3000 });
      }
    });
  }
}

