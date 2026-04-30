import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-plans',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './qa-plans.component.html',
  styleUrls: ['./qa-plans.component.scss']
})
export class QaPlansComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);

  societeId = '';
  societeNom = '';

  plans: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPlans();
  }

  loadPlans() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const storedPlans = data.qaPlans?.[this.societeId] || [];
    if (storedPlans.length > 0) {
      this.plans = storedPlans;
    }
  }
}

