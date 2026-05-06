import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chef-suivi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #2196f3, #1976d2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-graph-up" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Suivi d'Avancement</h1>
          <p class="mb-0" style="opacity: 0.8;">Analysez la progression de vos projets - {{societeNom}}</p>
        </div>
      </div>

      <div class="d-flex gap-3 mb-4">
        <select class="form-select" style="width: auto;" [(ngModel)]="selectedProjet" (ngModelChange)="updateData()">
          @for (p of projets; track p.id) {
            <option [value]="p.nom">{{p.nom}}</option>
          }
        </select>
        <button class="btn btn-primary" style="background: #2196f3; border: none;">
          <i class="bi bi-download me-2"></i>Exporter
        </button>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #4caf50, #388e3c); color: white; font-size: 22px;">
                <i class="bi bi-check-circle"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{avancement}}%</div>
                <div class="text-muted" style="font-size: 12px;">Avancement</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #ff9800, #f57c00); color: white; font-size: 22px;">
                <i class="bi bi-clock"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{tempsEstime}}h</div>
                <div class="text-muted" style="font-size: 12px;">Temps estimé</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #2196f3, #1976d2); color: white; font-size: 22px;">
                <i class="bi bi-hourglass"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{tempsReel}}h</div>
                <div class="text-muted" style="font-size: 12px;">Temps réel</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; color: white; font-size: 22px;" [style.background]="tauxRetard > 20 ? 'linear-gradient(135deg, #f44336, #c62828)' : 'linear-gradient(135deg, #4caf50, #388e3c)'">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{tauxRetard}}%</div>
                <div class="text-muted" style="font-size: 12px;">Taux retard</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <ul class="nav nav-tabs" id="suiviTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="tableau-tab" data-bs-toggle="tab" data-bs-target="#tableau" type="button" role="tab">Tableau de suivi</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="graphiques-tab" data-bs-toggle="tab" data-bs-target="#graphiques" type="button" role="tab">Graphiques</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="alertes-tab" data-bs-toggle="tab" data-bs-target="#alertes" type="button" role="tab">Alertes</button>
          </li>
        </ul>
        <div class="tab-content p-4">
          <div class="tab-pane fade show active" id="tableau" role="tabpanel">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Tâche</th>
                    <th>Responsable</th>
                    <th>Statut</th>
                    <th>Temps</th>
                    <th>Progression</th>
                    <th>Alerte</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of taches; track t.id) {
                    <tr [class.bg-warning-subtle]="t.retard">
                      <td>{{t.titre}}</td>
                      <td>{{t.responsable}}</td>
                      <td>
                        <span class="badge rounded-pill" [class.bg-secondary]="t.statut === 'To Do'" [class.bg-primary]="t.statut === 'In Progress'" [class.bg-success]="t.statut === 'Done'">{{t.statut}}</span>
                      </td>
                      <td>{{t.temps}}h</td>
                      <td>
                        <div class="d-flex align-items-center gap-2" style="width: 150px;">
                          <div class="progress flex-grow-1" style="height: 6px;">
                            <div class="progress-bar" [style.width.%]="t.progression"></div>
                          </div>
                          <span class="small">{{t.progression}}%</span>
                        </div>
                      </td>
                      <td>
                        @if (t.retard) {
                          <i class="bi bi-exclamation-triangle text-warning" style="font-size: 18px;"></i>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div class="tab-pane fade" id="graphiques" role="tabpanel">
            <h4 class="fw-bold mb-4">Avancement du projet</h4>
            <div class="mb-5">
              <div class="progress mb-2" style="height: 24px; border-radius: 12px;">
                <div class="progress-bar" [style.width.%]="avancement" style="background: #2196f3;"></div>
              </div>
              <div class="text-center fw-bold">{{avancement}}% terminé</div>
            </div>

            <div class="row g-4">
              <div class="col-md-4">
                <div>
                  <div class="mb-2" style="font-size: 13px;">To Do</div>
                  <div class="progress mb-2" style="height: 8px; border-radius: 8px;">
                    <div class="progress-bar" [style.width.%]="stats.todo" style="background: #6c757d;"></div>
                  </div>
                  <div class="text-end fw-bold" style="font-size: 12px;">{{stats.todo}}%</div>
                </div>
              </div>
              <div class="col-md-4">
                <div>
                  <div class="mb-2" style="font-size: 13px;">In Progress</div>
                  <div class="progress mb-2" style="height: 8px; border-radius: 8px;">
                    <div class="progress-bar" [style.width.%]="stats.inProgress" style="background: #0dcaf0;"></div>
                  </div>
                  <div class="text-end fw-bold" style="font-size: 12px;">{{stats.inProgress}}%</div>
                </div>
              </div>
              <div class="col-md-4">
                <div>
                  <div class="mb-2" style="font-size: 13px;">Done</div>
                  <div class="progress mb-2" style="height: 8px; border-radius: 8px;">
                    <div class="progress-bar" [style.width.%]="stats.done" style="background: #2196f3;"></div>
                  </div>
                  <div class="text-end fw-bold" style="font-size: 12px;">{{stats.done}}%</div>
                </div>
              </div>
            </div>

            <h4 class="fw-bold mb-4 mt-5">Temps estimé vs réel</h4>
            <div class="d-flex flex-column gap-3">
              <div class="d-flex align-items-center gap-4">
                <span style="width: 80px;">Estimé</span>
                <div style="height: 24px; background: #2196f3; border-radius: 12px; width: 200px;"></div>
                <span class="fw-bold" style="width: 60px; text-align: right;">{{tempsEstime}}h</span>
              </div>
              <div class="d-flex align-items-center gap-4">
                <span style="width: 80px;">Réel</span>
                <div style="height: 24px; background: #ff9800; border-radius: 12px;" [style.width.%]="(tempsReel/tempsEstime)*100"></div>
                <span class="fw-bold" style="width: 60px; text-align: right;">{{tempsReel}}h</span>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="alertes" role="tabpanel">
            <h4 class="fw-bold mb-4">Alertes actives</h4>
            <div class="d-flex flex-column gap-3">
              @for (a of alertes; track a.id) {
                <div class="d-flex align-items-center gap-3 p-3 rounded-3" [class.bg-danger-subtle]="a.critique" [class.bg-warning-subtle]="!a.critique">
                  <i [class]="a.critique ? 'bi bi-exclamation-circle text-danger' : 'bi bi-exclamation-triangle text-warning'" style="font-size: 28px;"></i>
                  <div class="flex-grow-1 d-flex flex-column">
                    <div class="fw-bold" style="font-size: 14px;">{{a.titre}}</div>
                    <div class="text-muted" style="font-size: 12px;">{{a.description}}</div>
                    <div class="text-muted" style="font-size: 11px; margin-top: 4px;">{{a.date}}</div>
                  </div>
                  <button class="btn btn-sm btn-primary">Résoudre</button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class ChefSuiviComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
  selectedProjet = '';
  projets: any[] = [];

  avancement = 0;
  tempsEstime = 0;
  tempsReel = 0;
  tauxRetard = 0;

  stats = { todo: 0, inProgress: 0, done: 0 };

  taches: any[] = [];
  displayedColumns = ['tache', 'responsable', 'statut', 'temps', 'progression', 'alerte'];

  alertes: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = projets.map((p: any) => ({ id: p.id, nom: p.nom }));
        if (this.projets.length > 0 && !this.selectedProjet) {
          this.selectedProjet = this.projets[0].nom;
        }
        this.updateData();
      },
      error: () => {}
    });
    
    this.api.getTaches().subscribe({
      next: (taches) => {
        const societeTaches = (taches || []).filter((t: any) => t.societeId === this.societeId);
        this.taches = societeTaches.map((t: any, idx: number) => {
          // Utiliser les vrais assignés si disponibles
          let responsable = 'Non assigné';
          if (t.assignees && t.assignees.length > 0) {
            responsable = t.assignees[0].nom;
          } else if (t.utilisateurNom) {
            responsable = t.utilisateurNom;
          }
          
          return {
            id: t.id || idx + 1,
            titre: t.nom || t.titre || 'Tâche sans nom',
            responsable: responsable,
            statut: t.status || 'To Do',
            temps: t.tempsEstime || 0,
            progression: t.progression || (t.status === 'Done' ? 100 : t.status === 'In Progress' ? 50 : 0),
            retard: t.estEnRetard || false
          };
        });
        this.stats.done = this.taches.filter(t => t.statut === 'Done' || t.statut === 'done').length;
        this.stats.inProgress = this.taches.filter(t => t.statut === 'In Progress' || t.statut === 'inprogress').length;
        this.stats.todo = this.taches.filter(t => t.statut === 'To Do' || t.statut === 'todo').length;
        if (this.taches.length > 0) {
          this.avancement = Math.round(this.stats.done / this.taches.length * 100);
        }
      },
      error: () => {}
    });
  }

  updateData() {
    if (this.selectedProjet) {
      const projet = this.projets.find(p => p.nom === this.selectedProjet);
      this.tempsEstime = projet ? (projet.taches?.length || 10) * 8 : 80;
      this.tempsReel = Math.floor(this.tempsEstime * (1 + Math.random() * 0.3));
      this.tauxRetard = Math.round((this.tempsReel - this.tempsEstime) / this.tempsEstime * 100);
    }
    alert('Données mises à jour pour: ' + this.selectedProjet);
  }
}
