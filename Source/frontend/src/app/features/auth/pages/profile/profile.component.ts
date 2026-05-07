import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '@core/services/api.service';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private api = inject(ApiGenericService);
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

  profileForm: FormGroup = this.fb.group({
    id: [''],
    nom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telephone: [''],
    poste: [''],
    societeId: ['']
  });

  isLoading = signal(false);
  userInitials = signal('??');
  userRole = signal('Chargement...');
  userEmail = signal('');

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const user = this.auth.currentUser();
    if (user) {
      this.profileForm.patchValue(user);
      this.userInitials.set(user.nom.substring(0, 2).toUpperCase());
      this.userRole.set(this.auth.getUserRole());
      this.userEmail.set(user.email);
    }
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.isLoading.set(true);
      this.api.ajouterOuModifier('utilisateurs', this.profileForm.value).subscribe({
        next: () => {
          this.notify.showToast('Profil mis à jour avec succès', 'success');
          this.isLoading.set(false);
        },
        error: () => {
          this.notify.showToast('Erreur lors de la mise à jour', 'error');
          this.isLoading.set(false);
        }
      });
    }
  }
}
