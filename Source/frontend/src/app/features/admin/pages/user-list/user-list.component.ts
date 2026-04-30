import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { Utilisateur } from '@core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatInputModule, MatChipsModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  displayedColumns: string[] = ['nom', 'role', 'poste', 'statut', 'actions'];
  users = signal<Utilisateur[]>([]);
  totalItems = signal(0);
  searchQuery = '';
  currentPage = 1;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getPage<Utilisateur>('utilisateurs', this.currentPage, 10, { search: this.searchQuery }).subscribe(res => {
      this.users.set(res.items || []);
      this.totalItems.set(res.total || 0);
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.loadUsers();
  }
}
