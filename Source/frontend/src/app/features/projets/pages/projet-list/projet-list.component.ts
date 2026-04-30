import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { Projet } from '@core/models';

@Component({
  selector: 'app-projet-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule
  ],
  templateUrl: './projet-list.component.html',
  styleUrls: ['./projet-list.component.scss']
})
export class ProjetListComponent implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  displayedColumns: string[] = ['nom', 'progress', 'status', 'deadline', 'actions'];
  projets = signal<Projet[]>([]);
  totalItems = signal(0);
  isLoading = signal(false);
  pageSize = 10;
  currentPage = 1;
  searchQuery = '';
  currentStatus = signal('Tous');

  ngOnInit() {
    this.loadProjets();
  }

  loadProjets() {
    this.isLoading.set(true);
    const filters: any = {};
    if (this.searchQuery) filters.search = this.searchQuery;
    if (this.currentStatus() !== 'Tous') filters.status = this.currentStatus();

    this.api.getPage<Projet>('projets', this.currentPage, this.pageSize, filters).subscribe({
      next: (res) => {
        this.projets.set(res.items || []);
        this.totalItems.set(res.total || res.items?.length || 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notify.showToast('Erreur lors du chargement des projets', 'error');
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProjets();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProjets();
  }

  filterByStatus(status: string) {
    this.currentStatus.set(status);
    this.currentPage = 1;
    this.loadProjets();
  }

  getStatusClass(status: string) {
    const base = 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ';
    switch (status?.toLowerCase()) {
      case 'en cours': return base + 'bg-sky-100 text-sky-600';
      case 'terminé': return base + 'bg-emerald-100 text-emerald-600';
      case 'en attente': return base + 'bg-amber-100 text-amber-600';
      case 'retard': return base + 'bg-rose-100 text-rose-600';
      default: return base + 'bg-slate-100 text-slate-600';
    }
  }

  addProjet() { /* Open Form Dialog */ }
  editProjet(projet: Projet) { /* Open Form Dialog */ }
  viewDetails(projet: Projet) { /* Navigate to detail */ }
  deleteProjet(projet: Projet) {
    if (confirm(`Supprimer le projet ${projet.nom} ?`)) {
      this.api.delete('projets', projet.id).subscribe(() => {
        this.notify.showToast('Projet supprimé', 'success');
        this.loadProjets();
      });
    }
  }
}
