import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      const { email, password, rememberMe } = this.loginForm.value;
      
      this.authService.login(email, password, rememberMe).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Identifiants incorrects');
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
