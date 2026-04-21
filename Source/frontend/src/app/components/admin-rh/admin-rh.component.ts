import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-rh',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-person-badge" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Ressources Humaines</h1>
          <p class="mb-0" style="opacity: 0.8;">Gestion RH - {{societeNom}}</p>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <ul class="nav nav-tabs" id="rhTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="pointage-tab" data-bs-toggle="tab" data-bs-target="#pointage" type="button" role="tab">Pointage</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="conges-tab" data-bs-toggle="tab" data-bs-target="#conges" type="button" role="tab">Congés</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="salaires-tab" data-bs-toggle="tab" data-bs-target="#salaires" type="button" role="tab">Salaires</button>
          </li>
        </ul>
        <div class="tab-content p-4">
          <div class="tab-pane fade show active" id="pointage" role="tabpanel">
            <h4 class="fw-bold mb-4">Historique de Pointage</h4>
            <div class="d-flex flex-column gap-3">
              @for (p of pointages; track p.id) {
                <div class="card border-0 shadow-sm">
                  <div class="card-body d-flex align-items-center gap-3">
                    <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: #f5f5f5;">
                      <i class="bi bi-{{p.type === 'entree' ? 'box-arrow-in-right' : 'box-arrow-right'}}" style="font-size: 20px; color: #667eea;"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-bold">{{p.nom}}</div>
                      <div class="text-muted small">{{p.type === 'entree' ? 'Entrée' : 'Sortie'}}</div>
                    </div>
                    <div class="text-muted small">{{p.heure}}</div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="tab-pane fade" id="conges" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold mb-0">Demandes de Congés</h4>
              <button class="btn btn-primary" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;">
                <i class="bi bi-plus-lg me-2"></i>Nouvelle Demande
              </button>
            </div>
            <div class="d-flex flex-column gap-3">
              @for (c of conges; track c.id) {
                <div class="card border-0 shadow-sm">
                  <div class="card-body d-flex align-items-center gap-3">
                    <div class="flex-grow-1">
                      <div class="fw-bold">{{c.nom}}</div>
                      <div class="text-muted small">{{c.type}}</div>
                      <div class="text-muted small">{{c.dateDebut}} - {{c.dateFin}}</div>
                    </div>
                    <span class="badge rounded-pill" [class.bg-success]="c.statut === 'approuve'" [class.bg-primary]="c.statut === 'en_cours'" [class.bg-danger]="c.statut === 'rejete'">
                      {{c.statut === 'approuve' ? 'Approuvé' : c.statut === 'en_cours' ? 'En cours' : 'Rejeté'}}
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="tab-pane fade" id="salaires" role="tabpanel">
            <h4 class="fw-bold mb-4">Bulletins de Salaire</h4>
            <div class="d-flex flex-column gap-3">
              @for (s of salaires; track s.id) {
                <div class="card border-0 shadow-sm">
                  <div class="card-body d-flex align-items-center gap-3">
                    <div class="flex-grow-1">
                      <div class="fw-bold">{{s.mois}}</div>
                      <div class="text-muted small">Salaire net: {{s.net}} DT</div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" (click)="downloadPdf(s)">
                      <i class="bi bi-download"></i> PDF
                    </button>
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
export class AdminRhComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId: string = '';
  societeNom: string = '';
  pointages: any[] = [];
  conges: any[] = [];
  salaires: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    this.api.getUtilisateurs().subscribe({
      next: (users) => {
        const usersOfSociete = users.filter((u: any) => u.societeId === this.societeId);
        
        this.pointages = usersOfSociete.slice(0, 5).map((u: any, idx: number) => ({
          id: idx + 1,
          nom: u.nom,
          type: idx % 2 === 0 ? 'entree' : 'sortie',
          heure: idx === 0 ? '08:30' : idx === 1 ? '09:00' : '17:' + (30 - idx * 5)
        }));
        
        this.conges = usersOfSociete.slice(0, 3).map((u: any, idx: number) => ({
          id: idx + 1,
          nom: u.nom,
          type: idx === 0 ? 'Congés annuel' : idx === 1 ? 'Congés maladie' : 'Congés sans-solde',
          dateDebut: idx === 0 ? '10/04/2026' : idx === 1 ? '05/04/2026' : '25/04/2026',
          dateFin: idx === 0 ? '20/04/2026' : idx === 1 ? '07/04/2026' : '26/04/2026',
          statut: idx === 0 ? 'approuve' : idx === 1 ? 'en_cours' : 'rejete'
        }));
        
        this.salaires = [
          { id: 1, mois: 'Mars 2026', net: 2500 },
          { id: 2, mois: 'Février 2026', net: 2500 },
          { id: 3, mois: 'Janvier 2026', net: 2450 }
        ];
      },
      error: () => {
        this.pointages = [
          { id: 1, nom: 'Employé 1', type: 'entree', heure: '08:30' },
          { id: 2, nom: 'Employé 2', type: 'sortie', heure: '17:30' }
        ];
        this.conges = [
          { id: 1, nom: 'Employé 1', type: 'Congés annuel', dateDebut: '10/04/2026', dateFin: '20/04/2026', statut: 'approuve' }
        ];
        this.salaires = [
          { id: 1, mois: 'Mars 2026', net: 2500 }
        ];
      }
    });
  }

  downloadPdf(salaire: any) {
    const content = `
BULLETIN DE PAIE - ${salaire.mois}
=====================================

Société: ${this.societeNom}
Date: ${new Date().toLocaleDateString('fr-FR')}

-----------------------------------
EMPLOYÉ
-----------------------------------
Nom: ${this.societeNom}
Salaire net: ${salaire.net} DT

-----------------------------------
DÉTAILS
-----------------------------------
Salaire de base: ${salaire.net} DT
Indemnités: 0 DT
 TOTAL: ${salaire.net} DT

=====================================
Signature: ___________________
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bulletin_paie_${salaire.mois}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    alert('Bulletin de paie téléchargé');
  }
}
