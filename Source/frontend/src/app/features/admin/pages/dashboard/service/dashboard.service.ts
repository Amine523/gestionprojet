import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { ExportService } from '@core/services/export.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardStats, Activity, AIInsight } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private apiService: ApiService,
    private aiService: AiService,
    private exportService: ExportService
  ) {}

  getCurrentUser() {
    return this.apiService.getCurrentUser();
  }

  getSocieteNom(): string {
    const user = this.getCurrentUser();
    return user?.societe?.nom || 'Votre société';
  }

  getDashboardStats(societeId: string): Observable<any> {
    return forkJoin({
      projets: this.apiService.getProjetsBySociete(societeId),
      employes: this.apiService.getEmployesBySociete(societeId),
      statsRH: this.apiService.getRHStats(societeId)
    }).pipe(
      map((res: any) => ({
        totalEmployes: res.employes.length,
        projetsActifs: res.projets.filter((p: any) => (p.status || p.Status || p.statut || '').toLowerCase().includes('actif')).length,
        tauxPresence: res.statsRH.tauxPresence || 0,
        demandesAttente: res.statsRH.demandesCongesEnAttente || 0
      }))
    );
  }

  getActivities(societeId: string): Observable<any[]> {
    return this.apiService.getActiviteRecente(20, societeId);
  }

  getAIInsights(societeId: string, stats: any): Observable<any> {
    const context = `
      SOCIÉTÉ: ${this.getSocieteNom()}
      STATISTIQUES ADMIN:
      - Effectif: ${stats.employes} employés
      - Projets: ${stats.projetsActifs} projets en cours
      - Performance: ${stats.productivite}% de productivité estimée
    `;

    return this.aiService.getDashboardInsights({ context });
  }

  exportRapport(stats: DashboardStats, activities: Activity[], aiInsights?: string) {
    const content = `
# Rapport Stratégique - ${this.getSocieteNom()}
Date: ${new Date().toLocaleDateString('fr-FR')}

## Indicateurs Clés
- **Employés**: ${stats.employes}
- **Projets Actifs**: ${stats.projetsActifs}
- **Heures Travaillées**: ${stats.heuresTravaillees}h
- **Productivité Globale**: ${stats.productivite}%

## Recommandations IA
${aiInsights || 'Aucune recommandation disponible'}

## Activités Récentes
${activities.slice(0, 20).map(act => 
  `- ${act.type}: ${act.action} (${act.utilisateur} - ${act.date})`
).join('\n')}
    `;

    this.exportService.exportToPdf(
      ['Type', 'Action', 'Utilisateur', 'Date'],
      activities.slice(0, 20).map(act => [act.type, act.action, act.utilisateur, act.date]),
      `rapport-${this.getSocieteNom()}-${Date.now()}`,
      'Rapport Stratégique'
    );
  }

  filterActivities(activities: Activity[], searchTerm: string): Activity[] {
    if (!searchTerm) return activities;
    
    const term = searchTerm.toLowerCase();
    return activities.filter(act => 
      act.type.toLowerCase().includes(term) ||
      act.action.toLowerCase().includes(term) ||
      act.resource.toLowerCase().includes(term) ||
      act.utilisateur.toLowerCase().includes(term) ||
      act.date.toLowerCase().includes(term)
    );
  }

  getTypeBadgeClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      'CRÉATION': 'badge-success',
      'MODIFICATION': 'badge-warning',
      'SUPPRESSION': 'badge-danger',
      'CONNEXION': 'badge-info',
      'EXPORT': 'badge-primary'
    };
    
    return typeMap[type.toUpperCase()] || 'badge-secondary';
  }

  formatStatValue(value: number | string, suffix: string = ''): string {
    if (typeof value === 'number') {
      return value.toLocaleString('fr-FR') + suffix;
    }
    return value.toString();
  }

  calculateTrend(current: number, previous: number): { value: string; isPositive: boolean } {
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
      isPositive: change >= 0
    };
  }
}
