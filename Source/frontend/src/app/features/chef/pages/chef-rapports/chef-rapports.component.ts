import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './chef-rapports.component.html',
  styleUrls: ['./chef-rapports.component.scss']
})
export class ChefRapportsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = 'Votre société';
  activeTab = 'avancement';
  
  periode = 'semaine';
  selectedProjet = '';
  avancement = 0;

  projets: any[] = [];

  tachesTerminees = 0;
  tempsMoyen = 0;
  vlocuteur = 0;
  rendement = 0;

  developpeurs: any[] = [];

  dansLesDelais = 0;
  avecRetard = 0;
  nonTermines = 0;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = projets.map((p: any) => ({ nom: p.nom, avancement: Math.floor(Math.random() * 40) + 60 }));
        if (this.projets.length > 0) {
          this.avancement = this.projets[0].avancement;
        }
      },
      error: () => {}
    });
    
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.developpeurs = employes.slice(0, 5).map((e: any) => ({
          nom: e.nom,
          role: e.typeUtilisateurId || 'Développeur',
          taches: Math.floor(Math.random() * 20) + 5,
          heures: Math.floor(Math.random() * 40) + 40
        }));
        this.tachesTerminees = this.developpeurs.reduce((sum: number, d: any) => sum + d.taches, 0);
        this.vlocuteur = this.developpeurs.length;
        this.rendement = Math.floor(Math.random() * 20) + 80;
        this.tempsMoyen = 3 + Math.floor(Math.random() * 4);
      },
      error: () => {}
    });
    
    this.dansLesDelais = Math.floor(Math.random() * 15) + 5;
    this.avecRetard = Math.floor(Math.random() * 5);
    this.nonTermines = Math.floor(Math.random() * 3);
  }

  updateRapport() {
    this.snackBar.open('Rapport mis à jour: ' + this.periode, 'Fermer', { duration: 3000 });
  }
}

