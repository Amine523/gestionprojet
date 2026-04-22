import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '@core/services/api.service';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  date: string;
  user: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

    <div class="container-fluid p-4" style="background: #f8fafc; min-height: 100vh;">
      <!-- Super Admin Dashboard -->
      @if (role === 'SuperAdmin') {
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="fw-bold mb-1" style="font-size: 28px; color: #1a1a2e;">Dashboard Super Admin</h1>
            <p class="text-muted mb-0">Vue d'ensemble de la plateforme</p>
          </div>
          <button class="btn btn-primary" routerLink="/superadmin/societes">
            <i class="bi bi-plus-lg me-2"></i>Nouvelle Société
          </button>
        </div>

        <div class="row g-4 mb-4">
          @for (stat of stats; track stat.title) {
            <div class="col-md-3">
              <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3">
                  <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: {{stat.color}};">
                    <i class="bi bi-{{stat.icon}}" style="font-size: 28px; color: #fff;"></i>
                  </div>
                  <div class="d-flex flex-column">
                    <span class="fw-bold" style="font-size: 28px; color: #1a1a2e;">{{ stat.value }}</span>
                    <span class="text-muted" style="font-size: 13px;">{{ stat.title }}</span>
                    @if (stat.trend) {
                      <span class="d-flex align-items-center gap-1" style="font-size: 12px; color: {{stat.trendUp ? '#4caf50' : '#f44336'}}; margin-top: 4px;">
                        <i class="bi bi-{{stat.trendUp ? 'trending-up' : 'trending-down'}}"></i>
                        {{stat.trend}}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0">Activité Récente</h5>
                <button class="btn btn-sm btn-light">
                  <i class="bi bi-three-dots"></i>
                </button>
              </div>
              <div class="card-body">
                @if (activities.length === 0) {
                  <div class="text-center py-4 text-muted">
                    <i class="bi bi-inbox" style="font-size: 40px;"></i>
                    <span>Aucune activité récente</span>
                  </div>
                } @else {
                  <div class="d-flex flex-column gap-3">
                    @for (item of activities; track item.id) {
                      <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background: #f8f9fa;">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background: {{item.type === 'user' ? '#e3f2fd' : item.type === 'societe' ? '#fce4ec' : item.type === 'projet' ? '#e8f5e9' : '#fff3e0'}};">
                          <i class="bi bi-{{item.type === 'user' ? 'person-add' : item.type === 'societe' ? 'building' : item.type === 'projet' ? 'folder' : 'bell'}}" style="font-size: 18px; color: #1976d2;"></i>
                        </div>
                        <div class="d-flex flex-column">
                          <span style="font-size: 14px; color: #333;">{{item.description}}</span>
                          <span class="text-muted" style="font-size: 12px;">{{item.user}} • {{item.date}}</span>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="fw-bold mb-0">Sociétés par Statut</h5>
              </div>
              <div class="card-body">
                <div class="d-flex flex-column gap-4">
                  @for (s of societesStats; track s.name) {
                    <div class="d-flex align-items-center gap-3">
                      <div style="width: 100px; font-size: 13px; color: #666;">{{s.name}}</div>
                      <div class="flex-grow-1" style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                        <div [style.width.%]="s.percent" [style.background]="s.color" style="height: 100%; border-radius: 4px; transition: width 0.3s;"></div>
                      </div>
                      <div style="width: 30px; text-align: right; font-size: 14px; font-weight: 500;">{{s.count}}</div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Dernières Sociétés</h5>
            <button class="btn btn-sm btn-outline-primary" routerLink="/superadmin/societes">
              Voir tout <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
          <div class="card-body">
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th class="fw-semibold" style="color: #666; font-size: 13px;">Nom</th>
                  <th class="fw-semibold" style="color: #666; font-size: 13px;">Adresse</th>
                  <th class="fw-semibold" style="color: #666; font-size: 13px;">Téléphone</th>
                  <th class="fw-semibold" style="color: #666; font-size: 13px;">Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (s of societes; track s.nom) {
                  <tr>
                    <td>{{s.nom}}</td>
                    <td>{{s.adresse}}</td>
                    <td>{{s.telephoneContact}}</td>
                    <td>
                      <span class="badge rounded-pill" [class.bg-success]="s.actif" [class.bg-danger]="!s.actif">
                        {{s.actif ? 'Actif' : 'Inactif'}}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-light">
                        <i class="bi bi-three-dots"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (role !== 'SuperAdmin') {
        <div class="mb-4">
          <h1 class="fw-bold mb-1" style="font-size: 28px; color: #1a1a2e;">Dashboard {{role}}</h1>
          <p class="text-muted mb-0">Bienvenue sur votre espace</p>
        </div>
        <div class="card border-0 shadow-sm">
          <div class="card-body d-flex flex-column align-items-center justify-content-center gap-3 py-5">
            <div class="spinner-border text-primary" role="status" style="width: 40px; height: 40px;"></div>
            <span class="text-muted">Chargement...</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [``]
})
export class DashboardComponent implements OnInit {
  @Input() role: string = '';
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  stats: StatCard[] = [];
  activities: ActivityItem[] = [];
  societes: any[] = [];
  societesStats = [
    { name: 'Actives', count: 12, percent: 75, color: '#4caf50' },
    { name: 'Inactives', count: 3, percent: 19, color: '#f44336' },
    { name: 'En attente', count: 1, percent: 6, color: '#ff9800' }
  ];
  displayedColumns = ['nom', 'adresse', 'telephone', 'status', 'actions'];

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.role = data['role'] || this.role || 'SuperAdmin';
    });
    this.loadData();
  }

  loadData() {
    if (this.role === 'SuperAdmin') {
      this.loadSocietes();
      this.loadUtilisateurs();
      this.loadProjets();
    }
  }

  loadSocietes() {
    this.api.getSocietes().subscribe({
      next: (data) => {
        const societes = data || [];
        const actives = societes.filter((s: any) => s.actif).length;
        this.stats = [
          { title: 'Sociétés', value: societes.length, icon: 'apartment', color: 'linear-gradient(135deg, #d32f2f, #b71c1c)' },
          { title: 'Utilisateurs', value: this.userCount, icon: 'supervisor_account', color: 'linear-gradient(135deg, #1976d2, #1565c0)' },
          { title: 'Projets', value: this.projetCount, icon: 'assignment', color: 'linear-gradient(135deg, #4caf50, #388e3c)' },
          { title: 'Abonnements', value: actives, icon: 'subscriptions', color: 'linear-gradient(135deg, #ff9800, #f57c00)' }
        ];
        this.societes = societes.slice(0, 5);
      },
      error: () => {
        this.stats = [
          { title: 'Sociétés', value: 0, icon: 'apartment', color: 'linear-gradient(135deg, #d32f2f, #b71c1c)' },
          { title: 'Utilisateurs', value: 0, icon: 'supervisor_account', color: 'linear-gradient(135deg, #1976d2, #1565c0)' },
          { title: 'Projets', value: 0, icon: 'assignment', color: 'linear-gradient(135deg, #4caf50, #388e3c)' },
          { title: 'Abonnements', value: 0, icon: 'subscriptions', color: 'linear-gradient(135deg, #ff9800, #f57c00)' }
        ];
        this.societes = [];
      }
    });
  }

  userCount = 0;
  loadUtilisateurs() {
    this.api.getUtilisateurs().subscribe({
      next: (data) => { this.userCount = (data || []).length; },
      error: () => { this.userCount = 0; }
    });
  }

  projetCount = 0;
  loadProjets() {
    this.api.getProjets().subscribe({
      next: (data) => { this.projetCount = (data || []).length; },
      error: () => { this.projetCount = 0; }
    });
  }
}

