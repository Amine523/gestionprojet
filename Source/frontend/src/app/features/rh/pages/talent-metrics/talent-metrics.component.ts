import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-talent-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="talent-container">
      <header class="page-header">
        <div class="header-content">
          <h1 class="title">Talent <span class="gradient-text">Intelligence</span></h1>
          <p class="subtitle">Analyse 360° de la performance et de la santé des équipes.</p>
        </div>
      </header>

      <div class="metrics-grid">
        <!-- Top Performers Card -->
        <div class="metrics-card top-performers">
          <div class="card-header">
            <h3>Top Performers</h3>
            <span class="badge badge-success">Mois en cours</span>
          </div>
          <div class="performers-list">
            @for (user of topPerformers(); track user.id) {
              <div class="performer-item">
                <div class="avatar">{{user.nom.substring(0,2)}}</div>
                <div class="info">
                  <span class="name">{{user.nom}}</span>
                  <span class="role">{{user.poste}}</span>
                </div>
                <div class="score">
                  <span class="value">{{user.performanceScore}}</span>
                  <span class="label">Score</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Burnout Risk Card -->
        <div class="metrics-card burnout-alert">
          <div class="card-header">
            <h3>Risques de Surcharge</h3>
            <span class="badge badge-danger">Critique</span>
          </div>
          <div class="risk-list">
            @for (user of riskProfiles(); track user.id) {
              <div class="risk-item" [class.high]="user.burnoutRisk === 'High'">
                <div class="risk-info">
                  <span class="name">{{user.nom}}</span>
                  <span class="load">{{user.currentWorkloadHours}}h estimées</span>
                </div>
                <div class="risk-level">{{user.burnoutRisk}}</div>
              </div>
            }
            @if (riskProfiles().length === 0) {
              <p class="empty-msg">Aucun risque de burnout détecté actuellement.</p>
            }
          </div>
        </div>
      </div>

      <!-- Main Talent Table -->
      <div class="table-card">
        <div class="table-header">
          <h2>Matrice de Performance</h2>
          <div class="search-box">
            <input type="text" placeholder="Rechercher un talent..." [(ngModel)]="searchQuery">
          </div>
        </div>
        <table class="talent-table">
          <thead>
            <tr>
              <th>Talent</th>
              <th>Qualité</th>
              <th>Délais</th>
              <th>Collab.</th>
              <th>Compétences</th>
              <th>Score Global</th>
            </tr>
          </thead>
          <tbody>
            @for (u of filteredUsers(); track u.id) {
              <tr>
                <td>
                  <div class="user-cell">
                    <span class="u-name">{{u.nom}}</span>
                    <span class="u-dept">{{u.departement}}</span>
                  </div>
                </td>
                <td>
                  <div class="progress-mini">
                    <div class="bar"><div class="fill" [style.width.%]="u.qualityScore"></div></div>
                    <span>{{u.qualityScore}}%</span>
                  </div>
                </td>
                <td>
                  <div class="progress-mini">
                    <div class="bar"><div class="fill blue" [style.width.%]="u.timelinessScore"></div></div>
                    <span>{{u.timelinessScore}}%</span>
                  </div>
                </td>
                <td>
                   <div class="progress-mini">
                    <div class="bar purple"><div class="fill" [style.width.%]="u.collaborationScore"></div></div>
                    <span>{{u.collaborationScore}}%</span>
                  </div>
                </td>
                <td>
                  <div class="skills-chips">
                    @for (skill of u.skillsMatrix | keyvalue; track skill.key) {
                      <span class="skill-chip">{{skill.key}}</span>
                    }
                  </div>
                </td>
                <td>
                  <div class="global-score" [class.excellent]="u.performanceScore > 85">
                    {{u.performanceScore}}
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .talent-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .page-header {
      background: #0f172a;
      padding: 2.5rem;
      border-radius: 1.5rem;
      color: white;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .gradient-text {
      background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .metrics-card {
      background: white;
      border-radius: 1.25rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .card-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .performers-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .performer-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 1rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: #6366f1;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .info { flex: 1; display: flex; flex-direction: column; }
    .name { font-weight: 600; color: #1e293b; font-size: 0.9rem; }
    .role { font-size: 0.75rem; color: #64748b; }

    .score { text-align: right; }
    .score .value { display: block; font-weight: 800; color: #6366f1; font-size: 1.1rem; }
    .score .label { font-size: 0.6rem; color: #94a3b8; text-transform: uppercase; }

    .risk-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .risk-item {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      background: #fff1f2;
      border-left: 4px solid #ef4444;
      border-radius: 0.5rem;
    }
    .risk-item.high { background: #fef2f2; border-left-color: #dc2626; }
    .risk-info .name { display: block; font-weight: 700; color: #991b1b; }
    .risk-info .load { font-size: 0.75rem; color: #b91c1c; }
    .risk-level { font-weight: 800; color: #ef4444; }

    .table-card {
      background: white;
      border-radius: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .talent-table {
      width: 100%;
      border-collapse: collapse;
    }

    .talent-table th {
      text-align: left;
      padding: 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
    }

    .talent-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .progress-mini { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 600; color: #475569; }
    .bar { height: 6px; width: 60px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
    .fill { height: 100%; background: #10b981; }
    .fill.blue { background: #3b82f6; }

    .skill-chip {
      padding: 0.2rem 0.5rem;
      background: #f1f5f9;
      border-radius: 0.25rem;
      font-size: 0.65rem;
      color: #475569;
      font-weight: 600;
      margin-right: 0.25rem;
    }

    .global-score {
      width: 36px;
      height: 36px;
      border-radius: 0.5rem;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #64748b;
    }
    .global-score.excellent { background: #ecfdf5; color: #059669; }

    .badge { padding: 0.25rem 0.5rem; border-radius: 0.5rem; font-size: 0.65rem; font-weight: 700; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
  `]
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
