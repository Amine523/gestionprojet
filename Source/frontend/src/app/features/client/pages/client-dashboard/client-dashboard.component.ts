import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ApiGenericService } from '@core/services/api-generic.service';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  private api = inject(ApiGenericService);
  private auth = inject(AuthService);

  projects = signal<any[]>([]);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    const user = this.auth.currentUser();
    // En tant que client, on cherche les projets liés à notre societe ou nomClient
    this.api.search('projets', { clientNom: user?.nom }).subscribe(res => {
      this.projects.set(res || this.getMockProjects());
    });
  }

  private getMockProjects() {
    return [
      { id: '1', nom: 'Plateforme E-commerce V2', description: 'Refonte complète de la boutique en ligne avec intégration de paiements crypto.', status: 'En cours', endDate: new Date('2024-12-15'), progression: 65, tasksCompleted: 42, tasksPending: 18, bugsOpen: 3 },
      { id: '2', nom: 'Application Mobile iOS/Android', description: 'Développement d\'une app native pour la gestion des stocks en entrepôt.', status: 'Lancement', endDate: new Date('2025-03-01'), progression: 12, tasksCompleted: 5, tasksPending: 35, bugsOpen: 0 }
    ];
  }
}
