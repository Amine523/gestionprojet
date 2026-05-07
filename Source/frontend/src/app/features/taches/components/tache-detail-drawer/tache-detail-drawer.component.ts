import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { Tache, SousTache } from '@core/models';

@Component({
  selector: 'app-tache-detail-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatDividerModule, MatProgressBarModule],
  templateUrl: './tache-detail-drawer.component.html',
  styleUrls: ['./tache-detail-drawer.component.scss']
})
export class TacheDetailDrawerComponent implements OnInit {
  @Input({ required: true }) tacheId!: string;
  @Output() onClose = new EventEmitter<void>();

  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  tache = signal<Tache | null>(null);
  subtasks = signal<SousTache[]>([]);
  isLoading = signal(false);
  newSubtaskText = '';

  completedCount = computed(() => this.subtasks().filter(st => st.status === 'Done').length);

  ngOnInit() {
    this.loadTacheDetails();
  }

  loadTacheDetails() {
    this.isLoading.set(true);
    this.api.getById<Tache>('taches', this.tacheId).subscribe({
      next: (t) => {
        this.tache.set(t);
        this.loadSubtasks();
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadSubtasks() {
    this.api.search<SousTache>('soustache', { tacheId: this.tacheId }).subscribe({
      next: (st) => {
        this.subtasks.set(st || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  toggleSubtask(st: SousTache) {
    const newStatus = st.status === 'Done' ? 'To Do' : 'Done';
    this.api.ajouterOuModifier('soustache', { ...st, status: newStatus }).subscribe(() => {
      this.loadSubtasks();
    });
  }

  addSubtask() {
    if (!this.newSubtaskText.trim()) return;
    const payload = {
      tacheId: this.tacheId,
      description: this.newSubtaskText,
      status: 'To Do',
      actif: true
    };
    this.api.ajouterOuModifier('soustache', payload).subscribe(() => {
      this.newSubtaskText = '';
      this.loadSubtasks();
    });
  }

  getPriorityClass(priority?: string) {
    const base = 'px-2 py-0.5 rounded text-[9px] font-bold uppercase ';
    switch (priority?.toLowerCase()) {
      case 'high': return base + 'bg-rose-100 text-rose-600';
      case 'medium': return base + 'bg-amber-100 text-amber-600';
      case 'low': return base + 'bg-emerald-100 text-emerald-600';
      default: return base + 'bg-slate-100 text-slate-600';
    }
  }
}
