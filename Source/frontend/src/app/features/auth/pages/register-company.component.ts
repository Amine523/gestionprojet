import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss']
})
export class RegisterCompanyComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor() {
    this.registerForm = this.fb.group({
      societeNom: ['', [Validators.required, Validators.minLength(2)]],
      societeAdresse: ['', [Validators.required]],
      adminNom: ['', [Validators.required]],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminPassword: ['', [Validators.required, Validators.minLength(8)]],
      telephone: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.api.soumettreDemandeSociete(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSubmitted = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Erreur lors de l\'envoi de la demande. Veuillez réessayer.', 'Fermer', { duration: 3000 });
      }
    });
  }
}
