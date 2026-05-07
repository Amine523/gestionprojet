import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { marked } from 'marked';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dev-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dev-projets.component.html',
  styleUrls: ['./dev-projets.component.scss']
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
        this.projets = (data || []).map(p => ({
          ...p,
          avancement: p.avancee || Math.floor(Math.random() * 100),
          taches: p.taches || Math.floor(Math.random() * 20) + 5
        }));
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

    this.aiService.generate(`Analysez l'état du projet suivant : ${this.selectedProjet.nom}. Description : ${this.selectedProjet.description}`).subscribe({
      next: async (res: any) => {
        if (res?.response) {
          this.aiInsights = await marked.parse(res.response);
        } else {
          this.aiInsights = "L'IA n'a pas pu générer d'analyse pour ce projet.";
        }
        this.aiLoading = false;
      },
      error: () => {
        this.aiInsights = "Erreur de connexion au module IA.";
        this.aiLoading = false;
      }
    });
  }
}
