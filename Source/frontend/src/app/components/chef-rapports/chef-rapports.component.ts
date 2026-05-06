import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chef-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #2196f3, #1976d2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-graph-up" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Rapports</h1>
          <p class="mb-0" style="opacity: 0.8;">Analysez la performance de vos projets - {{societeNom}}</p>
        </div>
      </div>

      <div class="d-flex gap-3 mb-4 flex-wrap">
        <select class="form-select" style="width: auto;" [(ngModel)]="periode" (ngModelChange)="updateRapport()">
          <option value="semaine">Cette semaine</option>
          <option value="mois">Ce mois</option>
          <option value="trimestre">Ce trimestre</option>
        </select>
        <select class="form-select" style="width: auto;" [(ngModel)]="selectedProjet" (ngModelChange)="updateRapport()">
          <option value="">Tous</option>
          <option value="Application Mobile">Application Mobile</option>
          <option value="API REST">API REST</option>
          <option value="Dashboard">Dashboard</option>
        </select>
        <button class="btn btn-primary" style="background: #2196f3; border: none;">
          <i class="bi bi-file-pdf me-2"></i>PDF
        </button>
        <button class="btn btn-primary" style="background: #2196f3; border: none;">
          <i class="bi bi-file-earmark-excel me-2"></i>Excel
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <ul class="nav nav-tabs" id="rapportsTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="avancement-tab" data-bs-toggle="tab" data-bs-target="#avancement" type="button" role="tab">Avancement</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="productivite-tab" data-bs-toggle="tab" data-bs-target="#productivite" type="button" role="tab">Productivité</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="delais-tab" data-bs-toggle="tab" data-bs-target="#delais" type="button" role="tab">Respect des délais</button>
          </li>
        </ul>
        <div class="tab-content p-4">
          <div class="tab-pane fade show active" id="avancement" role="tabpanel">
            <div class="mb-5">
              <h4 class="fw-bold mb-4">Avancement global</h4>
              <div class="d-flex flex-column align-items-center">
                <svg viewBox="0 0 100 50" style="width: 200px; height: 100px;">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e0e0e0" stroke-width="10"/>
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#2196f3" stroke-width="10" [attr.stroke-dasharray]="avancement * 1.25 + ' 125'"/>
                </svg>
                <div class="fw-bold" style="font-size: 48px; color: #2196f3;">{{avancement}}%</div>
              </div>
            </div>

            <div>
              <h4 class="fw-bold mb-4">Par projet</h4>
              @for (p of projets; track p.nom) {
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-medium">{{p.nom}}</span>
                    <span class="fw-bold" style="color: #2196f3;">{{p.avancement}}%</span>
                  </div>
                  <div class="progress" style="height: 8px;">
                    <div class="progress-bar" [style.width.%]="p.avancement" [style.background]="p.avancement > 70 ? '#2196f3' : '#ff9800'"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="tab-pane fade" id="productivite" role="tabpanel">
            <h4 class="fw-bold mb-4">Productivité de l'équipe</h4>
            <div class="row g-4 mb-5">
              <div class="col-md-3">
                <div class="card border-0 shadow-sm p-4 text-center">
                  <i class="bi bi-check-circle" style="font-size: 32px; color: #2196f3; margin-bottom: 8px;"></i>
                  <div class="fw-bold" style="font-size: 28px;">{{tachesTerminees}}</div>
                  <div class="text-muted" style="font-size: 12px;">Tâches terminées</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card border-0 shadow-sm p-4 text-center">
                  <i class="bi bi-clock" style="font-size: 32px; color: #2196f3; margin-bottom: 8px;"></i>
                  <div class="fw-bold" style="font-size: 28px;">{{tempsMoyen}}</div>
                  <div class="text-muted" style="font-size: 12px;">Temps moyen (h)</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card border-0 shadow-sm p-4 text-center">
                  <i class="bi bi-speedometer2" style="font-size: 32px; color: #2196f3; margin-bottom: 8px;"></i>
                  <div class="fw-bold" style="font-size: 28px;">{{vlocuteur}}</div>
                  <div class="text-muted" style="font-size: 12px;">Vitesse (h/semaine)</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card border-0 shadow-sm p-4 text-center">
                  <i class="bi bi-graph-up" style="font-size: 32px; color: #2196f3; margin-bottom: 8px;"></i>
                  <div class="fw-bold" style="font-size: 28px;">{{rendement}}%</div>
                  <div class="text-muted" style="font-size: 12px;">Rendement</div>
                </div>
              </div>
            </div>

            <h4 class="fw-bold mb-4">Par développeur</h4>
            <div class="d-flex flex-column gap-3">
              @for (d of developpeurs; track d.nom) {
                <div class="d-flex justify-content-between align-items-center p-3 rounded-3" style="background: #f9f9f9;">
                  <div>
                    <div class="fw-bold">{{d.nom}}</div>
                    <div class="text-muted small">{{d.role}}</div>
                  </div>
                  <div class="d-flex gap-4 text-muted">
                    <span>{{d.taches}} tâches</span>
                    <span>{{d.heures}}h</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="tab-pane fade" id="delais" role="tabpanel">
            <h4 class="fw-bold mb-4">Indicateurs délais</h4>
            <div class="row g-4 mb-5">
              <div class="col-md-4">
                <div class="card border-0 p-4 text-center" style="background: #e8f5e9;">
                  <i class="bi bi-check-circle" style="font-size: 32px; color: #4caf50; margin-bottom: 8px;"></i>
                  <div class="fw-bold" style="font-size: 32px;">{{dansLesDelais}}</div>
                  <div class="text-muted" style="font-size: 12px;">Dans les délais</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 p-4 text-center" style="background: #fff3e0;">
                  <i class="bi bi-clock" style="font-size: 32px; color: #ff9800; margin-bottom: 8px;"></i>
                  <div class="fw-bold" style="font-size: 32px;">{{avecRetard}}</div>
                  <div class="text-muted" style="font-size: 12px;">Avec retard</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 p-4 text-center" style="background: #ffebee;">
                  <i class="bi bi-x-circle" style="font-size: 32px; color: #f44336; margin-bottom: 8px;"></i>
                  <div class="fw-bold" style="font-size: 32px;">{{nonTermines}}</div>
                  <div class="text-muted" style="font-size: 12px;">Non terminé(e)s</div>
                </div>
              </div>
            </div>

            <h4 class="fw-bold mb-4">Tendance</h4>
            <div class="d-flex flex-column gap-3">
              <div class="d-flex align-items-center gap-4">
                <span style="width: 100px;">Semaine 12</span>
                <div class="flex-grow-1" style="height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden;">
                  <div style="height: 100%; width: 85%; background: linear-gradient(90deg, #2196f3, #4caf50); border-radius: 10px;"></div>
                </div>
                <span class="fw-bold" style="width: 50px; text-align: right;">85%</span>
              </div>
              <div class="d-flex align-items-center gap-4">
                <span style="width: 100px;">Semaine 13</span>
                <div class="flex-grow-1" style="height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden;">
                  <div style="height: 100%; width: 78%; background: linear-gradient(90deg, #2196f3, #4caf50); border-radius: 10px;"></div>
                </div>
                <span class="fw-bold" style="width: 50px; text-align: right;">78%</span>
              </div>
              <div class="d-flex align-items-center gap-4">
                <span style="width: 100px;">Semaine 14</span>
                <div class="flex-grow-1" style="height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden;">
                  <div style="height: 100%; width: 92%; background: linear-gradient(90deg, #2196f3, #4caf50); border-radius: 10px;"></div>
                </div>
                <span class="fw-bold" style="width: 50px; text-align: right;">92%</span>
              </div>
              <div class="d-flex align-items-center gap-4">
                <span style="width: 100px;">Semaine 15</span>
                <div class="flex-grow-1" style="height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden;">
                  <div style="height: 100%; width: 88%; background: linear-gradient(90deg, #2196f3, #4caf50); border-radius: 10px;"></div>
                </div>
                <span class="fw-bold" style="width: 50px; text-align: right;">88%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class ChefRapportsComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
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
    alert('Rapport mis à jour: ' + this.periode);
  }
}
