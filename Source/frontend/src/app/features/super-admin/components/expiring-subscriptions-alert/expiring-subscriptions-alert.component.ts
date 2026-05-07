import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiGenericService } from '@core/services/api-generic.service';

@Component({
  selector: 'app-expiring-subscriptions-alert',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './expiring-subscriptions-alert.component.html',
  styleUrls: ['./expiring-subscriptions-alert.component.scss']
})
export class ExpiringSubscriptionsAlert implements OnInit {
  private api = inject(ApiGenericService);
  
  subs = signal<any[]>([]);

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.api.search('abonnements/expiring', { days: 30 }).subscribe(res => {
      this.subs.set(res || this.getMockAlerts());
    });
  }

  private getMockAlerts() {
    return [
      { id: '1', societeNom: 'Tech Solutions', plan: 'Premium', expiryDate: new Date(Date.now() + 5 * 86400000), daysRemaining: 5 },
      { id: '2', societeNom: 'StartUp Inc', plan: 'Basic', expiryDate: new Date(Date.now() + 12 * 86400000), daysRemaining: 12 }
    ];
  }
}
