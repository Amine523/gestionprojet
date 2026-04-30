import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { marked } from 'marked';

import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent],
  templateUrl: './rh-dashboard.component.html',
  styleUrls: ['./rh-dashboard.component.scss']
})
export class RhDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private aiService = inject(AiService);

  societeId = '';
  societeNom = '';

  stats = { totalEmployes: 0, presents: 0, congesEnAttente: 0, absences: 0, tauxAbsent: 0 };
  activities: any[] = [];
  
  delaiMoyenRecrutement = 0;
  turnover = 0;
  tauxPresence = 0;
  heatmapDays: any[] = [];

  aiLoading = false;
  aiInsights: string | null = null;
  topTalents: any[] = [];
  riskCount = 0;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = this.api.getCurrentSocieteId();
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
    this.generateHeatmap();
  }

  loadData() {
    this.api.getRHStats(this.societeId).subscribe({
      next: (data) => {
        this.stats.totalEmployes = data.totalEmployes || 0;
        this.stats.absences = data.employesAbsents || 0;
        this.stats.presents = data.employesPresents || 0;
        this.stats.congesEnAttente = data.demandesCongesEnAttente || 0;
        this.stats.tauxAbsent = 100 - (data.tauxPresence || 0);
        this.tauxPresence = data.tauxPresence || 0;
        
        this.turnover = data.turnover || 8.5; 
      },
      error: () => {
        // Données par défaut si l'API échoue
        this.stats.totalEmployes = 24;
        this.stats.absences = 2;
        this.stats.presents = 22;
        this.stats.congesEnAttente = 5;
        this.stats.tauxAbsent = 8;
        this.tauxPresence = 92;
        this.turnover = 8.5;
      }
    });

    this.api.getCandidaturesBySociete(this.societeId).subscribe(societeCandidats => {
      const acceptedCandidats = societeCandidats.filter((c: any) => c.statut === 'Accepté');
      if (acceptedCandidats.length > 0) {
        const delays = acceptedCandidats.map((c: any) => {
          const start = new Date(c.dateCandidature || Date.now()).getTime();
          const end = c.dateEntretien ? new Date(c.dateEntretien).getTime() : new Date().getTime();
          return (end - start) / (1000 * 3600 * 24);
        });
        this.delaiMoyenRecrutement = Math.max(1, Math.round(delays.reduce((a:number, b:number) => a + b, 0) / delays.length));
      } else {
        this.delaiMoyenRecrutement = 12;
      }
    });

    this.api.getEmployesBySociete(this.societeId).subscribe(employes => {
      const employesMap: { [id: string]: boolean } = {};
      employes.forEach((e: any) => employesMap[e.id || e.Id] = true);

      this.api.getPointages().subscribe({
        next: (pts) => {
          const societePts = (pts || []).filter((p: any) => employesMap[p.utilisateurId || p.UtilisateurId]);
          if (societePts.length > 0) {
            this.activities = societePts.slice(0, 10).map((p: any) => ({
              id: p.id || 'act_'+Math.random(),
              title: `Pointage: ${p.utilisateurNom || 'Utilisateur'}`,
              time: p.heureDebut || p.HeureEntree || '--:--',
              type: 'pointage'
            }));
          } else {
            // Données par défaut
            this.activities = [
              { id: 1, title: 'Pointage: Ahmed Benali', time: '08:00', type: 'pointage' },
              { id: 2, title: 'Pointage: Sara Karoui', time: '08:15', type: 'pointage' },
              { id: 3, title: 'Pointage: Mohamed Salah', time: '08:30', type: 'pointage' },
              { id: 4, title: 'Pointage: Fatima Zahra', time: '08:45', type: 'pointage' },
              { id: 5, title: 'Pointage: Youssef Amrani', time: '09:00', type: 'pointage' }
            ];
          }
        },
        error: () => {
          this.activities = [
            { id: 1, title: 'Pointage: Ahmed Benali', time: '08:00', type: 'pointage' },
            { id: 2, title: 'Pointage: Sara Karoui', time: '08:15', type: 'pointage' },
            { id: 3, title: 'Pointage: Mohamed Salah', time: '08:30', type: 'pointage' }
          ];
        }
      });
    });
  }

  generateHeatmap() {
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      days.push({
        date: date.toLocaleDateString(),
        count: Math.floor(Math.random() * 20) + 80,
        level: Math.floor(Math.random() * 4) + 1
      });
    }
    this.heatmapDays = days;
  }

  getHeatmapColor(level: number): string {
    const colors = ['#f1f5f9', '#bae6fd', '#38bdf8', '#0284c7', '#0369a1'];
    return colors[level] || colors[0];
  }

  async analyserRH() {
    this.aiLoading = true;
    this.aiInsights = null;
    
    const payload = {
      totalEmployes: this.stats.totalEmployes,
      presents: this.stats.presents,
      absences: this.stats.absences,
      congesEnAttente: this.stats.congesEnAttente,
      turnover: this.turnover,
      tauxPresence: this.tauxPresence,
      delaiMoyenRecrutement: this.delaiMoyenRecrutement
    };

    this.aiService.getRhInsights(payload).subscribe({
      next: async (res: any) => {
        if (res?.response) {
          this.aiInsights = await marked.parse(res.response);
        } else {
          this.aiInsights = "L'IA n'a pas pu analyser ces données.";
        }
        this.aiLoading = false;
      },
      error: () => {
        this.aiInsights = "Erreur lors de la connexion à l'IA.";
        this.aiLoading = false;
      }
    });
  }
}

