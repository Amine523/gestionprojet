import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chef-projets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid p-4">
      <div class="mb-4">
        <h1 class="fw-bold" style="font-size: 30px; color: #1a1a2e;">Projets</h1>
        <p class="text-muted">Gérez vos projets et suivez leur progression - {{societeNom}}</p>
      </div>

      <div class="card border-0 shadow-sm">
        <ul class="nav nav-tabs" id="projetsTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="cartes-tab" data-bs-toggle="tab" data-bs-target="#cartes" type="button" role="tab">Vue Cartes (Résumé)</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="gantt-tab" data-bs-toggle="tab" data-bs-target="#gantt" type="button" role="tab">Timeline & Planning (Gantt)</button>
          </li>
        </ul>
        <div class="tab-content p-4">
          <div class="tab-pane fade show active" id="cartes" role="tabpanel">
            <div class="row g-4">
              @for (p of projets; track p.id) {
                <div class="col-md-6 col-lg-4">
                  <div class="card border-0 shadow-sm p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-folder" style="color: #2196f3; font-size: 20px;"></i>
                        <span class="fw-bold" style="font-size: 18px;">{{p.nom}}</span>
                      </div>
                      <span class="badge rounded-pill" [class.bg-primary]="p.statut === 'En_cours'" [class.bg-success]="p.statut !== 'En_cours'">{{p.statut}}</span>
                    </div>
                    <p class="text-muted mb-3" style="font-size: 14px;">{{p.description}}</p>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between mb-2" style="font-size: 13px;">
                        <span>Progression</span>
                        <span>{{p.progression}}%</span>
                      </div>
                      <div class="progress" style="height: 8px;">
                        <div class="progress-bar" [style.width.%]="p.progression" style="background: #2196f3;"></div>
                      </div>
                    </div>
                    <div class="d-flex gap-4 mb-3" style="font-size: 13px;">
                      <span><i class="bi bi-clipboard me-1"></i>{{p.taches}} tâches</span>
                      <span><i class="bi bi-people me-1"></i>{{p.membres}} membres</span>
                      <span><i class="bi bi-calendar me-1"></i>{{p.echeance}}</span>
                    </div>
                    <div class="d-flex gap-2 pt-3" style="border-top: 1px solid #eee;">
                      <button class="btn btn-sm btn-outline-primary"><i class="bi bi-eye me-1"></i>Détails</button>
                      <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil me-1"></i>Modifier</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="tab-pane fade" id="gantt" role="tabpanel">
            <div class="card border-0" style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <div class="d-flex" style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #334155; font-size: 13px; text-transform: uppercase;">
                <div style="width: 250px; padding: 20px; border-right: 1px solid #e2e8f0;">Nom du Projet</div>
                <div class="flex-grow-1 d-flex justify-content-around" style="padding: 20px 0;">
                  <span>Mois 1</span><span>Mois 2</span><span>Mois 3</span><span>Mois 4</span><span>Mois 5</span><span>Mois 6</span>
                </div>
              </div>
              
              @for (p of projets; track p.id) {
                <div class="d-flex" style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;">
                  <div style="width: 250px; padding: 20px; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: center;">
                    <div class="fw-bold" style="font-size: 14px; color: #1e293b;">{{p.nom}}</div>
                    <div class="small text-muted fw-medium" style="font-size: 12px; margin-top: 4px;">{{p.taches}} tâches en cours</div>
                  </div>
                  <div class="flex-grow-1 position-relative" style="padding: 20px 0;">
                    <div class="position-absolute top-0 bottom-0 start-0 end-0 d-flex pointer-events-none">
                      <div class="flex-grow-1" style="border-right: 1px dashed #e2e8f0;"></div>
                      <div class="flex-grow-1" style="border-right: 1px dashed #e2e8f0;"></div>
                      <div class="flex-grow-1" style="border-right: 1px dashed #e2e8f0;"></div>
                      <div class="flex-grow-1" style="border-right: 1px dashed #e2e8f0;"></div>
                      <div class="flex-grow-1" style="border-right: 1px dashed #e2e8f0;"></div>
                      <div class="flex-grow-1"></div>
                    </div>
                    <div class="position-absolute top-50 translate-middle-y d-flex align-items-center px-3 text-white fw-bold" style="font-size: 12px; height: 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s, filter 0.2s; z-index: 10;"
                         [style.left.%]="p.id * 12"
                         [style.width.%]="30 + (p.id * 4)"
                         [style.background]="p.statut === 'En_cours' ? 'linear-gradient(90deg, #3b82f6, #2563eb)' : 'linear-gradient(90deg, #10b981, #059669)'">
                      <span>{{p.progression}}%</span>
                    </div>
                  </div>
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
export class ChefProjetsComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
  projets: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    const user = this.api.getCurrentUser();
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (data) => { 
        // Filtre pour ne voir que ses propres projets
        const myProjets = data.filter((p: any) => p.utilisateurId === user?.id);
        
        this.projets = myProjets.length ? myProjets : (data.length ? [] : [
          { id: 1, nom: 'Projet démo', description: 'Projet de démonstration', progression: 50, statut: 'En_cours', taches: 10, membres: 3, echeance: '15/05/2026', societeId: this.societeId }
        ]); 
      },
      error: () => {
        this.projets = [
          { id: 1, nom: 'Projet démo', description: 'Projet de démonstration', progression: 50, statut: 'En_cours', taches: 10, membres: 3, echeance: '15/05/2026', societeId: this.societeId }
        ];
      }
    });
  }
}
