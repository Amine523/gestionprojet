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
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiGenericService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  public dialogRef = inject(MatDialogRef<UserFormComponent>);
  public data = inject(MAT_DIALOG_DATA);

  userForm: FormGroup = this.fb.group({
    id: [''],
    nom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    typeUtilisateurId: ['', [Validators.required]],
    poste: [''],
    societeId: [''],
    actif: [true]
  });

  roles = signal([
    { id: 'ADMIN_SOCIETE', label: 'Administrateur' },
    { id: 'RH', label: 'RH' },
    { id: 'CHEF_PROJET', label: 'Chef de Projet' },
    { id: 'DEVELOPPEUR', label: 'Développeur' },
    { id: 'TESTEUR_QA', label: 'Testeur QA' }
  ]);

  isLoading = signal(false);

  ngOnInit() {
    if (this.data) {
      this.userForm.patchValue(this.data);
    }
    const societeId = this.auth.currentUser()?.societeId;
    this.userForm.patchValue({ societeId });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading.set(true);
      this.api.ajouterOuModifier('utilisateurs', this.userForm.value).subscribe({
        next: () => {
          this.notify.showToast('Utilisateur enregistré', 'success');
          this.dialogRef.close(true);
        },
        error: () => {
          this.isLoading.set(false);
          this.notify.showToast('Erreur lors de l\'enregistrement', 'error');
        }
      });
    }
  }
}
