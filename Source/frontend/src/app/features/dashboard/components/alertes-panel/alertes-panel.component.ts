import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiGenericService } from '@core/services/api-generic.service';

@Component({
  selector: 'app-alertes-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './alertes-panel.component.html',
  styleUrls: ['./alertes-panel.component.scss']
})
export class AlertesPanelComponent implements OnInit {
  private api = inject(ApiGenericService);
  alertes = signal<any[]>([]);

  ngOnInit() {
    this.loadAlertes();
  }

  loadAlertes() {
    this.api.search('Dashboard', { type: 'alertes' }).subscribe((data: any) => {
      this.alertes.set(data || this.getMockAlertes());
    });
  }

  getPriorityClass(priorite: string) {
    switch (priorite?.toLowerCase()) {
      case 'haute': return 'bg-rose-100 text-rose-600';
      case 'moyenne': return 'bg-amber-100 text-amber-600';
      default: return 'bg-sky-100 text-sky-600';
    }
  }

  getIcon(type: string) {
    switch (type?.toLowerCase()) {
      case 'paiement': return 'payments';
      case 'expiration': return 'event_busy';
      case 'erreur': return 'error_outline';
      default: return 'notifications';
    }
  }

  private getMockAlertes() {
    return [
      { id: '1', titre: 'Abonnement expire bientôt', message: 'La société "Tech Solutions" arrive à échéance dans 3 jours.', priorite: 'haute', type: 'expiration', date: new Date() },
      { id: '2', titre: 'Échec de paiement', message: 'Le prélèvement pour "Creative Studio" a échoué.', priorite: 'haute', type: 'paiement', date: new Date() },
      { id: '3', titre: 'Nouveau ticket support', message: 'Un nouveau ticket a été ouvert par "Dev Corp".', priorite: 'moyenne', type: 'info', date: new Date() }
    ];
  }
}
