import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { Tache } from '@core/models';

@Component({
  selector: 'app-backlog-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatChipsModule, DragDropModule],
  templateUrl: './backlog-table.component.html',
  styleUrls: ['./backlog-table.component.scss']
})
export class BacklogTableComponent implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  displayedColumns = ['order', 'nom', 'priorite', 'projet', 'actions'];
  taches = signal<Tache[]>([]);

  ngOnInit() {
    this.loadBacklog();
  }

  loadBacklog() {
    this.api.search<Tache>('taches', { status: 'To Do' }).subscribe(res => {
      this.taches.set(res || []);
    });
  }

  drop(event: CdkDragDrop<Tache[]>) {
    const arr = [...this.taches()];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.taches.set(arr);
    this.notify.showToast('Priorités mises à jour', 'success');
    // Optionnel : sauvegarder l'ordre en base
  }

  getPriorityClass(priority: string = 'Medium') {
    const base = 'px-2 py-0.5 rounded text-[9px] font-bold uppercase ';
    switch (priority?.toLowerCase()) {
      case 'high': return base + 'bg-rose-100 text-rose-600';
      case 'medium': return base + 'bg-amber-100 text-amber-600';
      default: return base + 'bg-slate-100 text-slate-600';
    }
  }
}
