import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qa-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="fw-bold mb-1" style="background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Centre d'Assurance Qualité
          </h1>
          <p class="text-muted mb-0">{{societeNom}} • Garantie de la stabilité logicielle</p>
        </div>
        <div>
          <a routerLink="/qa/tests" class="btn btn-primary">
            <i class="bi bi-play-circle me-1"></i> Lancer Campagne
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="row g-3 mb-4">
        <a routerLink="/qa/tests" class="col-lg-3 col-md-6 text-decoration-none">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #3b82f6; cursor: pointer;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                <i class="bi bi-clipboard-check" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">À Exécuter</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.testsAExecuter}}</h2>
              </div>
            </div>
          </div>
        </a>

        <a routerLink="/qa/bugs" class="col-lg-3 col-md-6 text-decoration-none">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #ef4444; cursor: pointer; animation: pulse-red 2s infinite;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                <i class="bi bi-bug" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Bugs Critiques</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.bugsCritiques}}</h2>
              </div>
            </div>
          </div>
        </a>

        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #16a34a;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(22, 163, 74, 0.1); color: #16a34a;">
                <i class="bi bi-check-circle" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Taux Réussite</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.tauxReussite}}%</h2>
              </div>
            </div>
          </div>
        </div>

        <a routerLink="/qa/projets" class="col-lg-3 col-md-6 text-decoration-none">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #0891b2; cursor: pointer;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(8, 145, 178, 0.1); color: #0891b2;">
                <i class="bi bi-folder" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Projets Suivis</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.projetsActifs}}</h2>
              </div>
            </div>
          </div>
        </a>
      </div>

      <!-- Content Grid -->
      <div class="row g-4 mb-4">
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <h5 class="fw-bold mb-4">Niveau de Qualité Global</h5>
              <div class="position-relative d-flex justify-content-center" style="height: 180px;">
                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 180px; height: 180px;">
                  <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#f1f5f9" stroke-width="2.5" fill="none"/>
                  <path class="circle" [attr.stroke-dasharray]="stats.tauxReussite + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#16a34a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                  <text x="18" y="20.35" class="percentage" fill="#1e293b" font-size="0.5em" font-weight="800" text-anchor="middle">{{stats.tauxReussite}}%</text>
                </svg>
              </div>
              <p class="text-muted mt-3 mb-0" style="font-size: 13px;">Basé sur {{testsRecents.length}} derniers rapports</p>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0">Répartition des Bugs</h5>
                <a routerLink="/qa/bugs" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
              <div class="d-flex flex-column gap-3">
                @for (b of bugsParProjet; track b.projet) {
                  <div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="fw-bold" style="font-size: 13px;">{{b.projet}}</span>
                      <span class="text-muted" style="font-size: 11px;">{{b.nombre}} bugs</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar" [class.bg-danger]="b.critique" [style.width.%]="b.percentage"></div>
                    </div>
                  </div>
                } @empty {
                  <div class="text-center py-5">
                    <i class="bi bi-inbox text-muted" style="font-size: 40px;"></i>
                    <p class="text-muted mt-2 mb-0" style="font-size: 13px;">Aucune donnée bug trouvée</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Widgets -->
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-clipboard-check text-primary"></i>
                  <h5 class="fw-bold mb-0">Activité Tests</h5>
                </div>
                <a routerLink="/qa/tests" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-three-dots"></i>
                </a>
              </div>
              <div class="d-flex flex-column gap-3">
                @for (test of testsRecents; track test.id) {
                  <div class="d-flex align-items-center gap-3 p-3 rounded-3" [class.bg-danger-subtle]="test.statut === 'Fail'" style="background: rgba(255,255,255,0.5); border: 1px solid #f1f5f9;">
                    <div class="rounded-2 d-flex align-items-center justify-content-center" [class.bg-success-subtle]="test.statut === 'Pass'" [class.bg-danger-subtle]="test.statut === 'Fail'" [class.text-success]="test.statut === 'Pass'" [class.text-danger]="test.statut === 'Fail'" style="width: 36px; height: 36px;">
                      <i class="bi bi-{{test.statut === 'Pass' ? 'check-circle' : 'x-circle'}}" style="font-size: 18px;"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-bold" style="font-size: 13px;">{{test.nom}}</div>
                      <div class="text-muted" style="font-size: 11px;">{{test.projet}} • {{test.heure}}</div>
                    </div>
                    <span class="badge rounded-pill" [class.bg-success]="test.statut === 'Pass'" [class.bg-danger]="test.statut === 'Fail'" style="font-size: 10px; font-weight: 800;">{{test.statut}}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <i class="bi bi-exclamation-triangle text-primary"></i>
                <h5 class="fw-bold mb-0">Alertes Critiques</h5>
              </div>
              <div class="d-flex flex-column gap-3">
                @for (alerte of alertes; track alerte.id) {
                  <div class="d-flex gap-3 p-3 rounded-3" style="background: #fff1f2; border: 1px solid #fee2e2;">
                    <i class="bi bi-priority-high text-danger" style="font-size: 20px;"></i>
                    <div>
                      <div class="fw-bold" style="font-size: 13px; color: #9f1239;">{{alerte.texte}}</div>
                      <div class="text-muted" style="font-size: 11px; color: #e11d48;">{{alerte.heure}}</div>
                    </div>
                  </div>
                } @empty {
                  <div class="text-center py-5">
                    <i class="bi bi-check-circle text-success" style="font-size: 40px;"></i>
                    <p class="text-muted mt-2 mb-0" style="font-size: 13px;">Tout est stable, aucune alerte.</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse-red {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    .circular-chart:hover .circle {
      transition: stroke-dasharray 1s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
  `]
})
export class QaDashboardComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = '';
  stats = { testsAExecuter: 0, bugsCritiques: 0, tauxReussite: 0, projetsActifs: 0 };
  qualityCircle = '0 283';
  bugsParProjet: any[] = [];
  testsRecents: any[] = [];
  alertes: any[] = [];
  candidats: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
    this.loadCandidats();
  }

  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        const societeProjets = projets || [];
        this.stats.projetsActifs = societeProjets.filter((p: any) => p.statut === 'Actif').length;
      }
    });
    this.api.getTaches().subscribe({
      next: (taches) => {
        const societeTests = (taches || []).filter((t: any) => t.societeId === this.societeId);
        this.stats.testsAExecuter = societeTests.filter((t: any) => t.statut === 'Pending').length;
        this.testsRecents = societeTests.slice(0, 5).map((t: any) => ({
          ...t,
          icon: t.statut === 'Done' ? 'check_circle' : t.statut === 'InProgress' ? 'pending' : 'hourglass_empty'
        }));
        const societeBugs = societeTests.filter((t: any) => t.type === 'bug');
        this.stats.bugsCritiques = societeBugs.filter((b: any) => b.priorite === 'Critical').length;
        const total = societeBugs.length;
        this.stats.tauxReussite = total > 0 ? Math.round(((total - this.stats.bugsCritiques) / total) * 100) : 100;
        this.qualityCircle = `${this.stats.tauxReussite * 2.83} 283`;
        this.bugsParProjet = [];
        this.alertes = societeBugs.filter((b: any) => b.priorite === 'Critical').slice(0, 5).map((b: any) => ({
          ...b,
          texte: b.titre,
          heure: b.dateCreation || 'Récent'
        }));
      }
    });
  }

  loadCandidats() {
    this.api.getCandidatures().subscribe(applications => {
      this.candidats = applications.map((c: any) => ({
        id: c.id,
        nom: c.nom + ' ' + c.prenom,
        email: c.email,
        poste: c.offreTitre || c.poste,
        statut: c.statut || 'En_cours'
      }));
      if (this.candidats.length === 0) {
        this.candidats = [
          { id: 1, nom: 'Ahmed Ben Ali', email: 'ahmed@email.com', poste: 'Développeur', statut: 'En_cours' },
          { id: 2, nom: 'Sofia Karoui', email: 'sofia@email.com', poste: 'RH', statut: 'Entretien' },
          { id: 3, nom: 'Mohamed Salah', email: 'mohamed@email.com', poste: 'Testeur', statut: 'En_cours' }
        ];
      }
    });
  }

  clearCandidats() {
    if (confirm('Voulez-vous vraiment effacer tous les candidats?')) {
      this.api.clearCandidatures();
      this.candidats = [];
      alert('Tous les candidats ont été effacés');
    }
  }
}
