import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiGenericService } from '@core/services/api-generic.service';

@Component({
  selector: 'app-activite-recente',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './activite-recente.component.html',
  styleUrls: ['./activite-recente.component.scss']
})
export class ActiviteRecenteComponent implements OnInit {
  private api = inject(ApiGenericService);
  activites = signal<any[]>([]);

  ngOnInit() {
    this.loadActivites();
  }

  loadActivites() {
    this.api.search('Dashboard', { type: 'activite-recente' }).subscribe((data: any) => {
      this.activites.set(data || this.getMockActivites());
    });
  }

  getIcon(type: string) {
    switch (type?.toLowerCase()) {
      case 'projet': return 'assignment';
      case 'tache': return 'check_circle';
      case 'conge': return 'event';
      case 'pointage': return 'timer';
      default: return 'edit';
    }
  }

  private getMockActivites() {
    return [
      { id: '1', utilisateurNom: 'Amine Slimani', description: 'A complété la tâche "Intégration API"', type: 'tache', projet: 'GestProjet V1', date: new Date() },
      { id: '2', utilisateurNom: 'Sarah Ben', description: 'A soumis une demande de congé', type: 'conge', date: new Date() },
      { id: '3', utilisateurNom: 'Karim Larbi', description: 'A créé un nouveau projet "Dashboard RH"', type: 'projet', date: new Date() },
      { id: '4', utilisateurNom: 'Yassine Toumi', description: 'Pointage entrée effectué', type: 'pointage', date: new Date() }
    ];
  }
}
