import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-qa-rapports',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './qa-rapports.component.html',
  styleUrls: ['./qa-rapports.component.scss']
})
export class QaRapportsComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = '';

  rapports = { tauxReussite: 0, totalTests: 0, totalBugs: 0, bugsCorriges: 0 };
  projets: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    forkJoin({
      tests: this.api.getTestsBySociete(this.societeId),
      taches: this.api.getTachesBySociete(this.societeId)
    }).subscribe({
      next: (res) => {
        const societeData = res.tests || [];
        const societeBugs = (res.taches || []).filter((t: any) => 
          (t.type === 'Bug' || t.Type === 'Bug' || (t.titre || '').toLowerCase().includes('bug'))
        );

        this.rapports.totalTests = societeData.length;
        this.rapports.totalBugs = societeBugs.length;
        this.rapports.bugsCorriges = societeBugs.filter((b: any) => 
          ['Fixed', 'Terminé', 'Done', 'Resolved'].includes(b.statut || b.Statut)
        ).length;

        if (this.rapports.totalTests > 0) {
          this.rapports.tauxReussite = Math.round(((this.rapports.totalTests - this.rapports.totalBugs) / this.rapports.totalTests) * 100);
        } else {
          this.rapports.tauxReussite = 0;
        }

        const bugsByProjet: { [key: string]: number } = {};
        societeBugs.forEach((b: any) => {
          const projetNom = b.projetNom || b.ProjetNom || b.projet || 'Inconnu';
          bugsByProjet[projetNom] = (bugsByProjet[projetNom] || 0) + 1;
        });

        this.projets = Object.entries(bugsByProjet).map(([nom, nombre]) => ({
          nom,
          nombre,
          percentage: this.rapports.totalBugs > 0 ? Math.round((nombre as number / this.rapports.totalBugs) * 100) : 0
        }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rapports QA:', err);
      }
    });
  }
}

