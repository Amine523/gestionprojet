import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { Utilisateur } from '@core/models';

@Component({
  selector: 'app-equipe-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatListModule],
  templateUrl: './equipe-assign.component.html',
  styleUrls: ['./equipe-assign.component.scss']
})
export class EquipeAssignComponent implements OnInit {
  @Input({ required: true }) projetId!: string;
  @Input({ required: true }) societeId!: string;

  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  users = signal<Utilisateur[]>([]);
  assignedUserIds = signal<Set<string>>(new Set());
  isSaving = signal(false);

  ngOnInit() {
    this.loadUsers();
    this.loadCurrentAssignments();
  }

  loadUsers() {
    this.api.search<Utilisateur>('utilisateurs', { societeId: this.societeId }).subscribe(users => {
      this.users.set(users || []);
    });
  }

  loadCurrentAssignments() {
    this.api.search<any>('projetutilisateur', { projetId: this.projetId }).subscribe(assignments => {
      const ids = new Set(assignments?.map((a: any) => a.utilisateurId) || []);
      this.assignedUserIds.set(ids);
    });
  }

  isAssigned(userId: string): boolean {
    return this.assignedUserIds().has(userId);
  }

  toggleAssignment(userId: string) {
    const ids = new Set(this.assignedUserIds());
    if (ids.has(userId)) {
      ids.delete(userId);
    } else {
      ids.add(userId);
    }
    this.assignedUserIds.set(ids);
  }

  saveAssignments() {
    this.isSaving.set(true);
    const payload = {
      projetId: this.projetId,
      utilisateurIds: Array.from(this.assignedUserIds())
    };

    // Note: Endpoint /api/projetutilisateur/liste-update (custom)
    this.api.ajouterOuModifier('projetutilisateur/sync', payload).subscribe({
      next: () => {
        this.notify.showToast('Équipe mise à jour', 'success');
        this.isSaving.set(false);
      },
      error: () => {
        this.notify.showToast('Erreur lors de la mise à jour', 'error');
        this.isSaving.set(false);
      }
    });
  }
}
