import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-abonnement-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './abonnement-list.component.html',
  styleUrls: ['./abonnement-list.component.scss']
})
export class AbonnementListComponent implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  displayedColumns: string[] = ['societe', 'plan', 'periode', 'statut', 'actions'];
  abonnements = signal<any[]>([]);

  ngOnInit() {
    this.loadAbonnements();
  }

  loadAbonnements() {
    this.api.search('abonnements', {}).subscribe(res => {
      this.abonnements.set(res || this.getMockAbonnements());
    });
  }

  getPlanClass(plan: string) {
    const base = 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ';
    switch (plan?.toLowerCase()) {
      case 'premium': return base + 'bg-indigo-100 text-indigo-600';
      case 'standard': return base + 'bg-sky-100 text-sky-600';
      case 'basic': return base + 'bg-slate-100 text-slate-600';
      default: return base + 'bg-slate-100 text-slate-600';
    }
  }

  private getMockAbonnements() {
    return [
      { id: '1', societeNom: 'Tech Solutions', societeId: 'S001', typeAbonnement: 'Premium', dateDebut: new Date('2024-01-01'), dateFin: new Date('2025-01-01'), actif: true },
      { id: '2', societeNom: 'Creative Agency', societeId: 'S002', typeAbonnement: 'Standard', dateDebut: new Date('2024-03-15'), dateFin: new Date('2025-03-15'), actif: true },
      { id: '3', societeNom: 'StartUp Inc', societeId: 'S003', typeAbonnement: 'Basic', dateDebut: new Date('2023-06-01'), dateFin: new Date('2024-06-01'), actif: false }
    ];
  }
}
