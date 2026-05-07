import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-talent-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './talent-metrics.component.html',
  styleUrls: ['./talent-metrics.component.scss']
})
export class TalentMetricsComponent implements OnInit {
  private api = inject(ApiService);
  users = signal<any[]>([]);
  topPerformers = signal<any[]>([]);
  riskProfiles = signal<any[]>([]);
  searchQuery = '';

  ngOnInit() {
    this.loadTalentData();
  }

  loadTalentData() {
    const societeId = this.api.getCurrentSocieteId();
    const condition = { Criteres: { SocieteId: societeId } };
    
    // Using the detailed endpoint
    this.api.post('utilisateurs/ListeDetailleParCondition', condition).subscribe((res: any) => {
      const data = res?.value || res || [];
      const mapped = data.map((d: any) => ({
        id: d.utilisateur?.id || d.Utilisateur?.Id,
        nom: d.utilisateur?.nom || d.Utilisateur?.Nom,
        poste: d.utilisateur?.poste || d.Utilisateur?.Poste || 'Employé',
        departement: d.utilisateur?.departement || d.Utilisateur?.Departement || 'Général',
        performanceScore: d.performanceScore || d.PerformanceScore || 0,
        qualityScore: d.qualityScore || d.QualityScore || 0,
        timelinessScore: d.timelinessScore || d.TimelinessScore || 0,
        collaborationScore: d.collaborationScore || d.CollaborationScore || 0,
        burnoutRisk: d.burnoutRisk || d.BurnoutRisk || 'Low',
        currentWorkloadHours: d.currentWorkloadHours || d.CurrentWorkloadHours || 0,
        skillsMatrix: d.skillsMatrix || d.SkillsMatrix || {}
      }));

      this.users.set(mapped);
      this.topPerformers.set([...mapped].sort((a: any, b: any) => b.performanceScore - a.performanceScore).slice(0, 5));
      this.riskProfiles.set(mapped.filter((u: any) => u.burnoutRisk === 'High' || u.burnoutRisk === 'Moderate'));
    });
  }

  filteredUsers() {
    if (!this.searchQuery) return this.users();
    const q = this.searchQuery.toLowerCase();
    return this.users().filter((u: any) => u.nom.toLowerCase().includes(q) || u.poste.toLowerCase().includes(q));
  }
}
