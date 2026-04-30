import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-applicant-postuler',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './postuler.component.html',
  styleUrls: ['./postuler.component.scss']
})
export class ApplicantPostulerComponent { 
  private api = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  selectedOffre: any = null;
  cvFile: File | null = null;
  isSubmitting = false;
  isLoginMode = false;
  
  applyForm = new FormGroup({
    nom: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    telephone: new FormControl('', Validators.pattern('^[0-9+ ]+$'))
  });
  
  constructor() { 
    this.selectedOffre = this.api.getOffreEmploiTemp(); 
  }
  
  onFileSelected(event: any) { 
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Le fichier est trop volumineux (max 5 MB)', 'Fermer', { duration: 3000 });
        return;
      }
      this.cvFile = file;
    }
  }
  
  submit() {
    if (this.applyForm.invalid) return;
    this.isSubmitting = true;
    
    const { email, password, nom, telephone } = this.applyForm.value;
    
    const authObs = this.isLoginMode 
      ? this.api.login(email!, password!) 
      : this.api.registerCandidate({ email, password, nom });

    authObs.subscribe({
      next: (res: any) => {
        this.api.setToken(res.token);
        localStorage.setItem('utilisateur', JSON.stringify(res.utilisateur));
        
        const formData = new FormData();
        formData.append('candidatId', res.utilisateur.id);
        formData.append('offreId', this.selectedOffre?.id);
        if (this.cvFile) {
          formData.append('cv', this.cvFile);
        }

        this.api.postulerForm(formData).subscribe({
          next: () => {
            this.snackBar.open('Candidature soumise avec succès !', 'Fermer', { duration: 3000 });
            this.isSubmitting = false;
            this.router.navigate(['/applicant/profil']);
          },
          error: (err: any) => {
            console.error('Upload error', err);
            this.snackBar.open('Erreur lors de l\'envoi du dossier.', 'Fermer', { duration: 3000 });
            this.isSubmitting = false;
          }
        });
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Erreur d\'authentification', 'Fermer', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  } 
}
