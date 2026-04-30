import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { Projet } from '@core/models';

@Component({
  selector: 'app-projet-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule
  ],
  templateUrl: './projet-form.component.html',
  styleUrls: ['./projet-form.component.scss']
})
export class ProjetFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);
  private dialogRef = inject(MatDialogRef<ProjetFormComponent>);
  public data = inject(MAT_DIALOG_DATA);

  projetForm: FormGroup = this.fb.group({
    id: [''],
    nom: ['', [Validators.required]],
    nomClient: [''],
    description: [''],
    startDate: [new Date()],
    endDate: [null],
    status: ['En attente'],
    societeId: ['']
  });

  isLoading = signal(false);

  ngOnInit() {
    if (this.data) {
      this.projetForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.projetForm.valid) {
      this.isLoading.set(true);
      const payload = this.projetForm.value;
      
      this.api.ajouterOuModifier('projets', payload).subscribe({
        next: () => {
          this.notify.showToast('Projet enregistré avec succès', 'success');
          this.dialogRef.close(true);
        },
        error: () => {
          this.isLoading.set(false);
          this.notify.showToast('Erreur lors de l\'enregistrement', 'error');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
