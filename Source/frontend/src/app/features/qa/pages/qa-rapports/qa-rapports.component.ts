import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

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
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const societeData = data.qaTests?.[this.societeId] || [];
    const societeBugs = data.qaBugs?.[this.societeId] || [];

    this.rapports.totalTests = societeData.length;
    this.rapports.totalBugs = societeBugs.length;
    this.rapports.bugsCorriges = societeBugs.filter((b: any) => b.statut === 'Fixed').length;

    if (this.rapports.totalTests > 0) {
      this.rapports.tauxReussite = Math.round(((this.rapports.totalTests - this.rapports.totalBugs) / this.rapports.totalTests) * 100);
    }

    const bugsByProjet: { [key: string]: number } = {};
    societeBugs.forEach((b: any) => {
      bugsByProjet[b.projet] = (bugsByProjet[b.projet] || 0) + 1;
    });

    this.projets = Object.entries(bugsByProjet).map(([nom, nombre]) => ({
      nom,
      nombre,
      percentage: this.rapports.totalBugs > 0 ? Math.round((nombre as number / this.rapports.totalBugs) * 100) : 0
    }));
  }
}

