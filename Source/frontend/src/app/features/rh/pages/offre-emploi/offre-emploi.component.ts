import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-offre-emploi',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './offre-emploi.component.html',
  styleUrls: ['./offre-emploi.component.scss']
})
export class OffreEmploiComponent implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  offres = signal<any[]>([]);

  ngOnInit() {
    this.loadOffres();
  }

  loadOffres() {
    this.api.search('OffreEmploI', {}).subscribe(res => {
      this.offres.set(res || this.getMockOffres());
    });
  }

  viewCandidats(offre: any) {
    // Navigation vers la liste des candidats pour cette offre
  }

  private getMockOffres() {
    return [
      { id: '1', titre: 'Développeur Angular Senior', poste: 'Frontend', lieu: 'Tunis / Remote', salaire: '4500 DT', statut: 'Ouvert', candidaturesCount: 12, description: 'Nous recherchons un expert Angular pour rejoindre notre équipe produit...' },
      { id: '2', titre: 'Chef de Projet IT', poste: 'Management', lieu: 'Casablanca', salaire: '6000 DT', statut: 'Ouvert', candidaturesCount: 5, description: 'Gérez des projets d\'envergure internationale dans un environnement Agile...' },
      { id: '3', titre: 'Testeur QA', poste: 'Qualité', lieu: 'Alger', salaire: '3000 DT', statut: 'Fermé', candidaturesCount: 8, description: 'Mise en place de tests automatisés et suivi des bugs...' }
    ];
  }
}
