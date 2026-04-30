import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-tache-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './tache-form.component.html',
  styleUrls: ['./tache-form.component.scss']
})
export class TacheFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);
  public dialogRef = inject(MatDialogRef<TacheFormComponent>);
  public data = inject(MAT_DIALOG_DATA);

  tacheForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required]],
    description: [''],
    priorite: ['Medium'],
    status: ['To Do'],
    projetId: ['', [Validators.required]],
    utilisateurId: ['']
  });

  users = signal<any[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    if (this.data?.projetId) {
      this.tacheForm.patchValue({ projetId: this.data.projetId });
    }
    this.loadUsers();
  }

  loadUsers() {
    // Charger les membres du projet
    this.api.search('projetutilisateur', { projetId: this.data.projetId }).subscribe((members: any) => {
      this.users.set(members || []);
    });
  }

  onSubmit() {
    if (this.tacheForm.valid) {
      this.isLoading.set(true);
      const payload = this.tacheForm.value;
      
      this.api.ajouterOuModifier('taches', payload).subscribe({
        next: (tache) => {
          if (payload.utilisateurId) {
            // Assigner l'utilisateur (via TacheAssignation)
            this.api.ajouterOuModifier('tacheassignees', { 
              tacheId: (tache as any).id, 
              utilisateurId: payload.utilisateurId 
            }).subscribe();
          }
          this.notify.showToast('Tâche créée', 'success');
          this.dialogRef.close(true);
        },
        error: () => {
          this.isLoading.set(false);
          this.notify.showToast('Erreur lors de la création', 'error');
        }
      });
    }
  }
}
