import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (control && control.invalid && (control.dirty || control.touched)) {
      <div class="validation-error-container">
        @if (control.errors?.['required']) {
          <span class="error-msg">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Ce champ est obligatoire
          </span>
        }
        @if (control.errors?.['email']) {
          <span class="error-msg">Format d'email invalide</span>
        }
        @if (control.errors?.['minlength']) {
          <span class="error-msg">Minimum {{ control.errors?.['minlength'].requiredLength }} caractères requis</span>
        }
        @if (control.errors?.['maxlength']) {
          <span class="error-msg">Maximum {{ control.errors?.['maxlength'].requiredLength }} caractères autorisés</span>
        }
        @if (control.errors?.['pattern']) {
          <span class="error-msg">Format invalide</span>
        }
        @if (control.errors?.['min']) {
          <span class="error-msg">Valeur minimum : {{ control.errors?.['min'].min }}</span>
        }
        @if (control.errors?.['max']) {
          <span class="error-msg">Valeur maximum : {{ control.errors?.['max'].max }}</span>
        }
      </div>
    }
  `,
  styles: [`
    .validation-error-container {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
      animation: fadeInError 0.2s ease-out;
    }

    .error-msg {
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    @keyframes fadeInError {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ValidationErrorComponent {
  @Input() control?: AbstractControl | null;
}
