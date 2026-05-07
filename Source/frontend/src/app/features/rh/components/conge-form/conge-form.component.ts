import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiGenericService } from '@core/services/api-generic.service';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-conge-form',
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
    MatIconModule
  ],
  templateUrl: './conge-form.component.html',
  styleUrls: ['./conge-form.component.scss']
})
export class CongeFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiGenericService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  public dialogRef = inject(MatDialogRef<CongeFormComponent>);

  congeForm = this.fb.group({
    typePointageId: ['Annuel', [Validators.required]],
    dateDebut: [null, [Validators.required]],
    dateFin: [null, [Validators.required]],
    motif: [''],
    status: ['En_attente']
  });

  isLoading = signal(false);

  calculateDays(): number {
    const start = this.congeForm.get('dateDebut')?.value;
    const end = this.congeForm.get('dateFin')?.value;
    if (start && end) {
      const diff = Math.abs(new Date(end).getTime() - new Date(start).getTime());
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  }

  onSubmit() {
    if (this.congeForm.valid) {
      this.isLoading.set(true);
      const user = this.auth.currentUser();
      const payload = {
        ...this.congeForm.value,
        utilisateurId: user?.id,
        societeId: user?.societeId,
        jours: this.calculateDays()
      };

      this.api.ajouterOuModifier('DemandesConge', payload).subscribe({
        next: () => {
          this.notify.showToast('Demande envoyée !', 'success');
          this.dialogRef.close(true);
        },
        error: () => {
          this.isLoading.set(false);
          this.notify.showToast('Erreur lors de l\'envoi', 'error');
        }
      });
    }
  }
}
