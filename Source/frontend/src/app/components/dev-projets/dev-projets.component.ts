import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AiService } from '../../services/ai.service';
import { marked } from 'marked';

@Component({
  selector: 'app-dev-projets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="mb-4">
        <h1 class="fw-bold" style="font-size: 28px; color: #1a1a2e;">Mes Projets</h1>
        <p class="text-muted">Le contexte de mes tâches - {{societeNom}}</p>
      </div>

      <div class="d-flex gap-3 mb-4">
        <div class="input-group" style="max-width: 400px;">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" [(ngModel)]="searchQuery" placeholder="Rechercher un projet...">
        </div>
        <select class="form-select" style="width: auto;" [(ngModel)]="filterStatut">
          <option value="">Tous</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>
      </div>

      <div class="row g-4">
        @for (projet of filteredProjets; track projet.id) {
          <div class="col-md-6 col-lg-4">
            <div class="card border-0 shadow-sm" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" (click)="selectProjet(projet)">
              <div class="card-body">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background: linear-gradient(135deg, #4caf50, #388e3c);">
                    <i class="bi bi-folder" style="color: white; font-size: 24px;"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h5 class="fw-bold mb-1" style="font-size: 18px;">{{projet.nom}}</h5>
                    <span class="badge rounded-pill" [class.bg-primary]="projet.statut?.toLowerCase() === 'en cours'" [class.bg-success]="projet.statut?.toLowerCase() === 'terminé'">{{projet.statut}}</span>
                  </div>
                </div>
                <p class="text-muted" style="font-size: 13px;">{{projet.description}}</p>
                
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-1" style="font-size: 12px; color: #666;">
                    <span>Avancement</span>
                    <span>{{projet.avancement}}%</span>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar" [style.width.%]="projet.avancement" [class.bg-success]="projet.avancement >= 80" [class.bg-primary]="projet.avancement < 80"></div>
                  </div>
                </div>

                <div class="row g-3 mb-3 p-3 rounded-3" style="background: #f5f5f5;">
                  <div class="col-4">
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-people" style="color: #666; font-size: 20px;"></i>
                      <div class="d-flex flex-column">
                        <span class="small text-muted" style="font-size: 11px;">Équipe</span>
                        <span class="fw-medium" style="font-size: 13px;">{{projet.equipe}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-list-task" style="color: #666; font-size: 20px;"></i>
                      <div class="d-flex flex-column">
                        <span class="small text-muted" style="font-size: 11px;">Tâches</span>
                        <span class="fw-medium" style="font-size: 13px;">{{projet.taches}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-calendar" style="color: #666; font-size: 20px;"></i>
                      <div class="d-flex flex-column">
                        <span class="small text-muted" style="font-size: 11px;">Dates</span>
                        <span class="fw-medium" style="font-size: 13px;">{{projet.dates}}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-flex gap-2 border-top pt-3">
                  <button class="btn btn-sm btn-primary" routerLink="/dev/taches">
                    <i class="bi bi-list-task me-1"></i>Backlog
                  </button>
                  <button class="btn btn-sm btn-primary">
                    <i class="bi bi-view-list me-1"></i>Sprints
                  </button>
                  <button class="btn btn-sm btn-primary" routerLink="/dev/docs">
                    <i class="bi bi-book me-1"></i>Docs
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      @if (selectedProjet) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header" style="background: linear-gradient(135deg, #4caf50, #388e3c); color: white; border-radius: 16px 16px 0 0;">
                <h5 class="modal-title">{{selectedProjet.nom}}</h5>
                <button type="button" class="btn-close" style="color: white;" (click)="selectedProjet = null"></button>
              </div>
              <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                <div class="mb-4">
                  <h6 class="fw-bold mb-2">Description</h6>
                  <p class="mb-0">{{selectedProjet.description}}</p>
                </div>
                <div class="mb-4">
                  <h6 class="fw-bold mb-3">Équipe</h6>
                  <div class="d-flex flex-column gap-2">
                    @for (member of selectedProjet.membres; track member.nom) {
                      <div class="d-flex align-items-center gap-2 p-3 rounded-3" style="background: #f5f5f5;">
                        <i class="bi bi-person-circle" style="color: #666; font-size: 20px;"></i>
                        <span>{{member.nom}}</span>
                        <span class="badge rounded-pill bg-secondary">{{member.role}}</span>
                      </div>
                    }
                  </div>
                </div>
                <div class="row g-3">
                  <div class="col-6">
                    <div class="small text-muted mb-1">Date début:</div>
                    <div class="fw-bold">{{selectedProjet.dateDebut}}</div>
                  </div>
                  <div class="col-6">
                    <div class="small text-muted mb-1">Date fin prévue:</div>
                    <div class="fw-bold">{{selectedProjet.dateFin}}</div>
                  </div>
                  <div class="col-6">
                    <div class="small text-muted mb-1">Tâches total:</div>
                    <div class="fw-bold">{{selectedProjet.taches}}</div>
                  </div>
                  <div class="col-6">
                    <div class="small text-muted mb-1">Avancement:</div>
                    <div class="fw-bold">{{selectedProjet.avancement}}%</div>
                  </div>
                </div>

                @if (aiLoading) {
                  <div class="mt-4 p-3 bg-light rounded text-center">
                    <div class="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                    <span class="text-muted small">L'IA de Llama 3.2 analyse ce projet...</span>
                  </div>
                }

                @if (aiInsights) {
                  <div class="mt-4 p-4 rounded-3" style="background: linear-gradient(to right, #f8f9fa, #e9ecef); border-left: 4px solid #8e24aa;">
                    <div class="d-flex align-items-center gap-2 mb-3">
                      <i class="bi bi-robot" style="color: #8e24aa; font-size: 24px;"></i>
                      <h6 class="fw-bold mb-0" style="color: #8e24aa;">Insights IA (Llama 3.2)</h6>
                    </div>
                    <div class="markdown-body" style="font-size: 14px;" [innerHTML]="aiInsights"></div>
                  </div>
                }
              </div>
              <div class="modal-footer d-flex justify-content-between">
                <button class="btn btn-outline-purple" (click)="analyserProjet()" [disabled]="aiLoading" style="color: #8e24aa; border-color: #8e24aa;">
                  <i class="bi bi-magic me-1"></i> Analyser avec IA
                </button>
                <button class="btn btn-primary" routerLink="/dev/taches" (click)="selectedProjet = null">
                  <i class="bi bi-list-task me-1"></i> Voir les tâches
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="selectedProjet = null"></div>
      }
    </div>
  `,
  styles: [``]
})
export class DevProjetsComponent implements OnInit {
  private api = inject(ApiService);
  private aiService = inject(AiService);

  searchQuery = '';
  filterStatut = '';

  projets: any[] = [];

  selectedProjet: any = null;
  aiLoading = false;
  aiInsights: string | null = null;
  
  societeId = '';
  societeNom = '';

  get filteredProjets() {
    return this.projets.filter(p => {
      const matchSearch = !this.searchQuery || p.nom.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatut = !this.filterStatut || p.statut === this.filterStatut;
      return matchSearch && matchStatut;
    });
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (data) => {
        this.projets = data.length ? data : [{ id: 1, nom: 'Projet démo', description: 'Description', statut: 'En cours', societeId: this.societeId }];
      },
      error: () => {}
    });
  }

  selectProjet(projet: any) {
    this.selectedProjet = projet;
    this.aiInsights = null;
  }

  async analyserProjet() {
    if (!this.selectedProjet) return;
    this.aiLoading = true;
    this.aiInsights = null;

    this.aiService.getProjectInsights(this.selectedProjet).subscribe({
      next: async (res) => {
        if (res?.response) {
          this.aiInsights = await marked.parse(res.response);
        } else {
          this.aiInsights = "L'IA n'a pas pu analyser ce projet.";
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
