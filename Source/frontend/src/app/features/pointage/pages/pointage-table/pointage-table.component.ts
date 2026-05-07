import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ApiGenericService } from '@core/services/api-generic.service';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-pointage-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, FormsModule],
  templateUrl: './pointage-table.component.html',
  styleUrls: ['./pointage-table.component.scss']
})
export class PointageTableComponent implements OnInit {
  private api = inject(ApiGenericService);
  private auth = inject(AuthService);

  displayedColumns = ['date', 'entree', 'sortie', 'duree', 'actions'];
  pointages = signal<any[]>([]);
  totalItems = signal(0);
  currentPage = 1;
  filterDate = new Date();

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    const user = this.auth.currentUser();
    if (!user) return;

    this.api.getPage('pointage', this.currentPage, 10, { utilisateurId: user.id }).subscribe(res => {
      this.pointages.set(res.items || []);
      this.totalItems.set(res.total || 0);
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.loadHistory();
  }

  calculateDuration(p: any): string {
    if (!p.heureEntree || !p.heureSortie) return '--h --m';
    const [h1, m1] = p.heureEntree.split(':');
    const [h2, m2] = p.heureSortie.split(':');
    const d1 = new Date(); d1.setHours(+h1, +m1);
    const d2 = new Date(); d2.setHours(+h2, +m2);
    const diff = Math.floor((d2.getTime() - d1.getTime()) / 1000 / 60);
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}h ${m}m`;
  }
}
