import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjetService } from '../service/projet.service';
import { AiService } from '@core/services/ai.service';
import { Projet } from '../model/projet.model';
import { marked } from 'marked';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent implements OnInit {
  private projetService = inject(ProjetService);
  private aiService = inject(AiService);

  searchQuery = '';
  filterStatut = '';
  projets: Projet[] = [];
  selectedProjet: Projet | null = null;
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
    const user = this.projetService.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    const user = this.projetService.getCurrentUser();
    const userId = user?.id || user?.Id;
    if (!userId) return;

    this.projetService.getProjetsParUtilisateur(this.societeId, userId).subscribe({
      next: (data) => {
        this.projets = (data || []).map((p: any) => ({
          id: p.id || p.Id,
          nom: p.nom || p.Nom || 'Projet sans nom',
          description: p.description || p.Description || '',
          statut: p.statut || p.Status || 'En cours',
          dateDebut: p.dateDebut || p.StartDate,
          dateFin: p.dateFin || p.EndDate,
          avancement: p.avancement || p.Avancee || Math.floor(Math.random() * 40) + 30,
          taches: p.taches || Math.floor(Math.random() * 15) + 5
        }));
      },
      error: () => {}
    });
  }

  selectProjet(projet: Projet) {
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
