import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TachesService } from '../service/taches.service';
import { AuthService } from '../service/auth.service';
import { Tache, Sprint, FiltreTache } from '../model/taches.model';

@Component({
  selector: 'app-chef-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule, MatSnackBarModule],
  templateUrl: './chef-taches.component.html',
  styleUrls: ['./chef-taches.component.scss']
})
export class ChefTachesComponent implements OnInit {
  private tachesService = inject(TachesService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  currentUser = this.authService.currentUser();
  searchQuery = signal('');
  selectedSprint = signal<string | null>(null);
  viewMode = signal<'kanban' | 'list'>('kanban');

  // Kanban columns
  columns = signal([
    { id: 'backlog', title: 'Backlog', color: '#6b7280' },
    { id: 'todo', title: 'À Faire', color: '#3b82f6' },
    { id: 'inprogress', title: 'En Cours', color: '#f59e0b' },
    { id: 'review', title: 'En Révision', color: '#8b5cf6' },
    { id: 'done', title: 'Terminé', color: '#10b981' }
  ]);

  // Computed properties
  allTaches = computed(() => {
    const allTaches = this.tachesService.taches$() || [];
    const userId = this.currentUser()?.id;
    
    return allTaches.filter(tache => {
      // Filtrer les tâches du chef de projet
      return tache.chefProjetId === userId || tache.assigneA === userId;
    });
  });

  filteredTaches = computed(() => {
    const taches = this.allTaches();
    if (!this.searchQuery()) return taches;
    
    return taches.filter(tache => 
      tache.titre.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      tache.description.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  sprints = computed(() => {
    return this.tachesService.sprints$() || [];
  });

  currentSprint = computed(() => {
    const sprints = this.sprints();
    const selected = this.selectedSprint();
    return sprints.find(s => s.id === selected) || null;
  });

  stats = computed(() => {
    const taches = this.allTaches();
    return {
      total: taches.length,
      backlog: taches.filter(t => t.statut === 'backlog').length,
      todo: taches.filter(t => t.statut === 'todo').length,
      inprogress: taches.filter(t => t.statut === 'inprogress').length,
      review: taches.filter(t => t.statut === 'review').length,
      done: taches.filter(t => t.statut === 'done').length
    };
  });

  // Form groups
  tacheForm!: FormGroup;
  sprintForm!: FormGroup;
  showTacheModal = signal(false);
  showSprintModal = signal(false);
  selectedTache = signal<Tache | null>(null);
  selectedSprintData = signal<Sprint | null>(null);

  ngOnInit() {
    this.initializeForms();
    this.loadData();
  }

  initializeForms() {
    this.tacheForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      priorite: ['moyenne', Validators.required],
      assigneA: ['', Validators.required],
      projetId: ['', Validators.required],
      storyPoints: [1, [Validators.min(1), Validators.max(13)]],
      dateEcheance: [''],
      etiquettes: [[]]
    });

    this.sprintForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      projetId: ['', Validators.required],
      objectifs: ['']
    });
  }

  loadData() {
    this.tachesService.getTaches().subscribe();
    this.tachesService.getSprints().subscribe();
  }

  // Drag and Drop handlers
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.item.data, event.previousIndex, event.currentIndex);
      this.updateTacheStatus(event.item.data[0], event.container.id as any);
    } else {
      transferArrayItem(
        event.item.data,
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateTacheStatus(event.item.data[0], event.container.id as any);
    }
  }

  updateTacheStatus(tacheId: string, newStatut: string) {
    this.tachesService.updateTacheStatus(tacheId, newStatut).subscribe({
      next: () => {
        this.snackBar.open('Statut de la tâche mis à jour', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  openTacheModal(tache?: Tache) {
    this.selectedTache.set(tache || null);
    if (tache) {
      this.tacheForm.patchValue({
        titre: tache.titre,
        description: tache.description,
        priorite: tache.priorite,
        assigneA: tache.assigneA,
        projetId: tache.projetId,
        storyPoints: tache.storyPoints,
        dateEcheance: tache.dateEcheance,
        etiquettes: tache.etiquettes || []
      });
    } else {
      this.tacheForm.reset();
    }
    this.showTacheModal.set(true);
  }

  closeTacheModal() {
    this.showTacheModal.set(false);
    this.selectedTache.set(null);
  }

  openSprintModal(sprint?: Sprint) {
    this.selectedSprintData.set(sprint || null);
    if (sprint) {
      this.sprintForm.patchValue({
        nom: sprint.nom,
        description: sprint.description,
        dateDebut: sprint.dateDebut,
        dateFin: sprint.dateFin,
        projetId: sprint.projetId,
        objectifs: sprint.objectifs
      });
    } else {
      this.sprintForm.reset();
    }
    this.showSprintModal.set(true);
  }

  closeSprintModal() {
    this.showSprintModal.set(false);
    this.selectedSprintData.set(null);
  }

  submitTache() {
    if (this.tacheForm.valid) {
      const formData = this.tacheForm.value;
      
      if (this.selectedTache()) {
        this.tachesService.updateTache(this.selectedTache()!.id, formData).subscribe({
          next: () => {
            this.closeTacheModal();
            this.snackBar.open('Tâche mise à jour', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        this.tachesService.createTache(formData).subscribe({
          next: () => {
            this.closeTacheModal();
            this.snackBar.open('Tâche créée', 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  }

  submitSprint() {
    if (this.sprintForm.valid) {
      const formData = this.sprintForm.value;
      
      if (this.selectedSprintData()) {
        this.tachesService.updateSprint(this.selectedSprintData()!.id, formData).subscribe({
          next: () => {
            this.closeSprintModal();
            this.snackBar.open('Sprint mis à jour', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        this.tachesService.createSprint(formData).subscribe({
          next: () => {
            this.closeSprintModal();
            this.snackBar.open('Sprint créé', 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteTache(tache: Tache) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${tache.titre}"?`)) {
      this.tachesService.deleteTache(tache.id).subscribe({
        next: () => {
          this.snackBar.open('Tâche supprimée', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  deleteSprint(sprint: Sprint) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le sprint "${sprint.nom}"?`)) {
      this.tachesService.deleteSprint(sprint.id).subscribe({
        next: () => {
          this.selectedSprint.set(null);
          this.snackBar.open('Sprint supprimé', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  selectSprint(sprintId: string) {
    this.selectedSprint.set(sprintId);
  }

  clearSprintFilter() {
    this.selectedSprint.set(null);
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'kanban' ? 'list' : 'kanban');
  }

  // Helper methods
  getColumnTasks(columnId: string): Tache[] {
    const taches = this.filteredTaches();
    const sprintFilter = this.selectedSprint();
    
    let filtered = taches;
    if (sprintFilter) {
      filtered = filtered.filter(t => t.sprintId === sprintFilter);
    }
    
    return filtered.filter(t => t.statut === columnId);
  }

  getPrioriteLabel(priorite: string): string {
    const labels: { [key: string]: string } = {
      'basse': 'Basse',
      'moyenne': 'Moyenne',
      'elevee': 'Élevée',
      'critique': 'Critique'
    };
    return labels[priorite] || priorite;
  }

  getPrioriteClass(priorite: string): string {
    const classes: { [key: string]: string } = {
      'basse': 'priority-low',
      'moyenne': 'priority-medium',
      'elevee': 'priority-high',
      'critique': 'priority-critical'
    };
    return classes[priorite] || 'priority-medium';
  }

  getStoryPointsColor(points: number): string {
    if (points <= 3) return '#10b981'; // Vert
    if (points <= 8) return '#f59e0b'; // Jaune
    return '#ef4444'; // Rouge
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getDaysRemaining(date: string): number {
    const echeance = new Date(date);
    const aujourd = new Date();
    const diff = echeance.getTime() - aujourd.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  isOverdue(date: string): boolean {
    return new Date(date) < new Date();
  }
}
