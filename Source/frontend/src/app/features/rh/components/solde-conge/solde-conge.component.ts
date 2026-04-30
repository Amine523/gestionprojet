import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiGenericService } from '@core/services/api-generic.service';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-solde-conge',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './solde-conge.component.html',
  styleUrls: ['./solde-conge.component.scss']
})
export class SoldeCongeComponent implements OnInit {
  private api = inject(ApiGenericService);
  private auth = inject(AuthService);

  soldes = signal<any[]>([]);

  ngOnInit() {
    this.loadSoldes();
  }

  loadSoldes() {
    const user = this.auth.currentUser();
    if (!user) return;

    this.api.getById<any>('DemandesConge/solde', user.id).subscribe((res) => {
      this.soldes.set([
        { type: 'Congés Annuels', restant: res?.annuel || 25, total: 30, icon: 'beach_access', colorClass: 'bg-emerald-500 text-emerald-600', matColor: 'primary' },
        { type: 'RTT', restant: res?.rtt || 5, total: 10, icon: 'timer', colorClass: 'bg-indigo-500 text-indigo-600', matColor: 'accent' },
        { type: 'Maladie', restant: res?.maladie || 0, total: 5, icon: 'medical_services', colorClass: 'bg-rose-500 text-rose-600', matColor: 'warn' }
      ]);
    });
  }
}
