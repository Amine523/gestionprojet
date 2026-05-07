import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { Tache } from '@core/models';

interface KanbanColumn {
  id: string;
  title: string;
  tasks: Tache[];
  color: string;
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  columns = signal<KanbanColumn[]>([
    { id: 'To Do', title: 'À faire', tasks: [], color: 'bg-slate-400' },
    { id: 'In Progress', title: 'En cours', tasks: [], color: 'bg-sky-500' },
    { id: 'Review', title: 'En révision', tasks: [], color: 'bg-amber-500' },
    { id: 'Done', title: 'Terminé', tasks: [], color: 'bg-emerald-500' }
  ]);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.api.search<Tache>('taches', {}).subscribe(tasks => {
      const cols = this.columns();
      // Reset tasks
      cols.forEach(c => c.tasks = []);
      
      // Dispatch tasks to columns
      tasks.forEach(t => {
        const col = cols.find(c => c.id === t.status) || cols[0];
        col.tasks.push(t);
      });
      
      this.columns.set([...cols]);
    });
  }

  drop(event: CdkDragDrop<Tache[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update status in backend
      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id;
      
      this.api.ajouterOuModifier('taches', { ...task, status: newStatus }).subscribe({
        next: () => this.notify.showToast(`Statut mis à jour : ${newStatus}`, 'success'),
        error: () => this.notify.showToast('Erreur lors de la mise à jour', 'error')
      });
    }
  }

  getPriorityClass(priority: string = 'Medium') {
    const base = 'px-2 py-0.5 rounded text-[9px] font-bold uppercase ';
    switch (priority?.toLowerCase()) {
      case 'high': return base + 'bg-rose-100 text-rose-600';
      case 'medium': return base + 'bg-amber-100 text-amber-600';
      case 'low': return base + 'bg-emerald-100 text-emerald-600';
      default: return base + 'bg-slate-100 text-slate-600';
    }
  }

  editTask(task: Tache) { /* Open Drawer */ }
  deleteTask(task: Tache) {
    if (confirm('Supprimer cette tâche ?')) {
      this.api.delete('taches', task.id).subscribe(() => {
        this.notify.showToast('Tâche supprimée', 'success');
        this.loadTasks();
      });
    }
  }
}
