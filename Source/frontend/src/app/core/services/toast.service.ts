import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  success(message: string, duration: number = 4000) {
    this.show(message, 'success', duration);
  }

  info(message: string, duration: number = 4000) {
    this.show(message, 'info', duration);
  }

  error(message: string, duration: number = 5000) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration: number = 4500) {
    this.show(message, 'warning', duration);
  }

  private show(message: string, type: 'success' | 'info' | 'error' | 'warning', duration: number) {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message, type },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-toast-panel']
    });
  }
}
