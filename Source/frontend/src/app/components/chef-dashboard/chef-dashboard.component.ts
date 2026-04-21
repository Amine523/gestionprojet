import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-chef-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="fw-bold mb-1" style="background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Management de Groupe
          </h1>
          <p class="text-muted mb-0">{{societeNom}} • Pilotage des projets et performance équipe</p>
        </div>
        <div>
          <button class="btn btn-primary" (click)="loadData()">
            <i class="bi bi-plus-lg me-1"></i> Nouveau Projet
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="row g-3 mb-4">
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #8b5cf6;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
                <i class="bi bi-folder2-open" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Projets Actifs</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.projets}}</h2>
                <div class="d-flex align-items-center gap-1 text-success" style="font-size: 11px; font-weight: 700;">
                  <i class="bi bi-trend-up"></i>
                  <span>En progression</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #16a34a;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(22, 163, 74, 0.1); color: #16a34a;">
                <i class="bi bi-people" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Membres Équipe</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.membres}}</h2>
                <div class="d-flex align-items-center gap-1 text-success" style="font-size: 11px; font-weight: 700;">
                  <i class="bi bi-people-fill"></i>
                  <span>Collaboration active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #f59e0b;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
                <i class="bi bi-clipboard-data" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Tâches Ouvertes</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.taches}}</h2>
                <div class="d-flex align-items-center gap-1 text-warning" style="font-size: 11px; font-weight: 700;">
                  <i class="bi bi-clock"></i>
                  <span>À prioriser</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #06b6d4;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(6, 182, 212, 0.1); color: #06b6d4;">
                <i class="bi bi-check2-all" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Livrables Validés</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.tacheTerminees}}</h2>
                <div class="d-flex align-items-center gap-1 text-success" style="font-size: 11px; font-weight: 700;">
                  <i class="bi bi-check-circle"></i>
                  <span>Sprints bouclés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="row g-4 mb-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-graph-up text-primary"></i>
                  <h5 class="fw-bold mb-0">Graphique de Burndown (Vitesse Projet)</h5>
                </div>
                <span class="badge bg-light text-secondary">Projet Actif: {{currentProjectName}}</span>
              </div>
              <div style="height: 300px;">
                <canvas #burndownChart></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm" style="height: 400px;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <i class="bi bi-battery-charging text-primary"></i>
                <h5 class="fw-bold mb-0">Charge Relative de l'Équipe</h5>
              </div>
              <div class="d-flex flex-column gap-3" style="overflow-y: auto; max-height: 300px;">
                @for (m of membres; track m.id) {
                  <div class="d-flex align-items-center gap-3 p-2 rounded-2" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                    <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #0284c7, #0891b2); color: white; font-weight: 700;">
                      {{m.initials}}
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-bold" style="font-size: 14px;">{{m.nom}}</div>
                      <div class="text-muted" style="font-size: 11px;">{{m.role || 'Développeur'}}</div>
                      <div class="progress mt-2" style="height: 6px;">
                        <div class="progress-bar" [class.bg-danger]="m.load > 90" [style.width.%]="m.load"></div>
                      </div>
                    </div>
                    <div class="fw-bold" [class.text-danger]="m.load > 90" style="font-size: 14px;">{{m.load}}%</div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex align-items-center gap-2 mb-4">
            <i class="bi bi-list-check text-primary"></i>
            <h5 class="fw-bold mb-0">Statut Détaillé des Projets</h5>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Projet</th>
                  <th>Status</th>
                  <th>Progression</th>
                  <th>Échéance</th>
                  <th>Vélocité</th>
                </tr>
              </thead>
              <tbody>
                @for (p of projets; track p.id) {
                  <tr>
                    <td class="fw-bold">{{p.nom}}</td>
                    <td><span class="badge" [class.bg-primary]="p.status === 'Actif'" [class.bg-secondary]="p.status !== 'Actif'">{{p.status}}</span></td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="progress" style="width: 100px; height: 8px;">
                          <div class="progress-bar" [style.width.%]="p.pourcentageAvancement || 0"></div>
                        </div>
                        <span class="fw-bold" style="font-size: 12px;">{{p.pourcentageAvancement || 0}}%</span>
                      </div>
                    </td>
                    <td class="text-muted">{{p.endDate | date:'mediumDate'}}</td>
                    <td class="fw-bold text-primary">{{p.velocity || '4.2'}} pts/j</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
  `]
})
export class ChefDashboardComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
  stats = { projets: 0, membres: 0, tacheTerminees: 0, taches: 0 };
  projets: any[] = [];
  membres: any[] = [];
  currentProjectName = 'Chargement...';
  
  @ViewChild('burndownChart') burndownChartRef!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projetsResult: any) => {
        const projets = projetsResult.data || projetsResult || [];
        this.projets = projets;
        this.stats.projets = projets.length;
        if (projets.length > 0) {
          this.currentProjectName = projets[0].nom;
          this.initBurndownChart(projets[0].id);
        }
      }
    });
    
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.membres = employes.map((e: any) => ({
          id: e.id,
          nom: e.nom,
          initials: e.nom?.charAt(0) || 'E',
          role: e.typeUtilisateurId,
          load: Math.floor(Math.random() * 40) + 50 // Simulation for now
        }));
        this.stats.membres = employes.length;
      }
    });
  }

  initBurndownChart(projectId: string) {
    this.api.getBurndown(projectId).subscribe({
      next: (data: any[]) => {
        if (this.burndownChartRef?.nativeElement) {
           new Chart(this.burndownChartRef.nativeElement, {
             type: 'line',
             data: {
               labels: data.map(d => d.day),
               datasets: [
                 {
                   label: 'Réel (Remaining)',
                   data: data.map(d => d.remaining),
                   borderColor: '#0284c7',
                   backgroundColor: 'transparent',
                   borderWidth: 3,
                   tension: 0.1
                 },
                 {
                   label: 'Idéal',
                   data: data.map(d => d.ideal),
                   borderColor: '#cbd5e1',
                   borderDash: [5, 5],
                   backgroundColor: 'transparent',
                   borderWidth: 2,
                   tension: 0
                 }
               ]
             },
             options: {
               responsive: true,
               maintainAspectRatio: false,
               plugins: { legend: { position: 'bottom' } },
               scales: { y: { beginAtZero: true } }
             }
           });
        }
      }
    });
  }
}
