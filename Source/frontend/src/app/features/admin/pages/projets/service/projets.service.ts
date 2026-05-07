import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { Projet, ProjetStats, FiltreProjet, ProjetFormData, ProjetReport } from '../model/projets.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetsService {
  private projetsSubject = new BehaviorSubject<Projet[]>([]);
  private statsSubject = new BehaviorSubject<ProjetStats>({
    total: 0,
    enCours: 0,
    termines: 0,
    enAttente: 0,
    parStatut: {}
  });

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  getProjets(filtre?: FiltreProjet): Observable<Projet[]> {
    const user = this.apiService.getCurrentUser();
    const societeId = user?.societeId || '';
    
    // Si on a un societeId, on utilise getProjetsBySociete
    const projectsObservable = societeId 
      ? this.apiService.getProjetsBySociete(societeId)
      : this.apiService.getProjets();

    return projectsObservable.pipe(
      map((projets: any[]) => {
        let filteredProjets = projets.map(projet => this.mapToProjet(projet));
        
        if (filtre) {
          filteredProjets = this.filtrerProjets(filteredProjets, filtre);
        }
        
        this.projetsSubject.next(filteredProjets);
        this.updateStats(filteredProjets);
        return filteredProjets;
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors du chargement des projets', 'Fermer', { duration: 3000 });
        return of([]);
      })
    );
  }

  getProjetById(id: string): Observable<Projet | null> {
    return this.apiService.getProjets().pipe(
      map((projets: any[]) => {
        const projet = projets.find(p => (p.id || p.Id) === id);
        return projet ? this.mapToProjet(projet) : null;
      }),
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement du projet', 'Fermer', { duration: 3000 });
        return of(null);
      })
    );
  }

  createProjet(formData: ProjetFormData): Observable<Projet> {
    return this.apiService.createProjet(formData).pipe(
      map((projet: any) => this.mapToProjet(projet)),
      tap(() => {
        this.snackBar.open('Projet créé avec succès', 'Fermer', { duration: 3000 });
        this.refreshProjets();
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la création du projet', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  updateProjet(id: string, formData: Partial<ProjetFormData>): Observable<Projet> {
    const dataWithId = { ...formData, id };
    return this.apiService.updateProjet(dataWithId).pipe(
      map((projet: any) => this.mapToProjet(projet)),
      tap(() => {
        this.snackBar.open('Projet mis à jour avec succès', 'Fermer', { duration: 3000 });
        this.refreshProjets();
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la mise à jour du projet', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  deleteProjet(id: string): Observable<void> {
    return this.apiService.deleteProjet(id).pipe(
      tap(() => {
        this.snackBar.open('Projet supprimé avec succès', 'Fermer', { duration: 3000 });
        this.refreshProjets();
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la suppression du projet', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  generateReport(projet: Projet): Observable<ProjetReport> {
    return of({
      id: projet.id,
      nom: projet.nom,
      nomClient: projet.nomClient,
      status: projet.status,
      avancee: projet.avancee,
      healthScore: this.calculateHealthScore(projet),
      recommendations: this.generateRecommendations(projet),
      generatedAt: new Date().toISOString()
    });
  }

  // BehaviorSubjects pour les composants
  get projets$() {
    return this.projetsSubject.asObservable();
  }

  get stats$() {
    return this.statsSubject.asObservable();
  }

  private mapToProjet(data: any): Projet {
    const sanitize = (val: any) => {
      if (!val || typeof val !== 'string') return val || '';
      return val.replace(/undefined/g, '').trim();
    };

    return {
      id: data.id || data.Id,
      nom: data.nom || data.Nom,
      nomClient: sanitize(data.nomClient || data.NomClient),
      description: data.description || data.Description,
      chef: sanitize(data.chef || data.Chef || data.utilisateurId || data.UtilisateurId),
      utilisateurId: data.utilisateurId || data.UtilisateurId || '',
      status: data.status || data.Statut || 'En cours',
      startDate: data.startDate || data.StartDate,
      endDate: data.endDate || data.EndDate,
      avancee: data.avancee || data.Avancee || 0,
      avanceeCalculee: data.avanceeCalculee || data.AvanceeCalculee || 0,
      healthScore: data.healthScore || data.HealthScore || 0,
      healthColor: data.healthColor || data.HealthColor || '#10b981',
      endDatePredicted: data.endDatePredicted || data.EndDatePredicted,
      membres: data.membres || data.Membres || []
    };
  }

  private filtrerProjets(projets: Projet[], filtre: FiltreProjet): Projet[] {
    return projets.filter(projet => {
      let matches = true;

      if (filtre.recherche) {
        const recherche = filtre.recherche.toLowerCase();
        matches = matches && (
          projet.nom.toLowerCase().includes(recherche) ||
          projet.nomClient.toLowerCase().includes(recherche)
        );
      }

      if (filtre.statut) {
        matches = matches && projet.status === filtre.statut;
      }

      return matches;
    });
  }

  private updateStats(projets: Projet[]): void {
    const stats: ProjetStats = {
      total: projets.length,
      enCours: projets.filter(p => p.status === 'En cours').length,
      termines: projets.filter(p => p.status === 'Terminé').length,
      enAttente: projets.filter(p => p.status === 'En attente').length,
      parStatut: {}
    };

    // Calcul par statut
    projets.forEach(projet => {
      stats.parStatut[projet.status] = (stats.parStatut[projet.status] || 0) + 1;
    });

    this.statsSubject.next(stats);
  }

  private calculateHealthScore(projet: Projet): number {
    let score = 100;
    
    // Pénalité pour retard
    if (projet.endDatePredicted) {
      const predictedEnd = new Date(projet.endDatePredicted);
      const actualEnd = new Date(projet.endDate);
      if (actualEnd > predictedEnd) {
        const daysLate = Math.floor((actualEnd.getTime() - predictedEnd.getTime()) / (1000 * 60 * 60 * 24));
        score -= Math.min(daysLate * 2, 50);
      }
    }
    
    // Bonus pour avancement
    if (projet.avanceeCalculee > 80) {
      score += 10;
    } else if (projet.avanceeCalculee < 50) {
      score -= 20;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private generateRecommendations(projet: Projet): string {
    const recommendations: string[] = [];
    
    if (projet.avanceeCalculee < 50) {
      recommendations.push('⚠️ Projet en retard - Planifier des réunions de suivi');
    }
    
    if (projet.avanceeCalculee < 80) {
      recommendations.push('📊 Analyser les blocages et réaffecter les ressources');
    }
    
    if (projet.membres && Array.isArray(projet.membres) && projet.membres.length < 2) {
      recommendations.push('👥 Renforcer l\'équipe avec des compétences complémentaires');
    }
    
    if (projet.healthScore < 70) {
      recommendations.push('🔍 Audit de qualité recommandé');
    }
    
    return recommendations.join('\n');
  }

  private refreshProjets(): void {
    this.getProjets().subscribe();
  }

  // Export methods
  exportProjetsToExcel(projets: Projet[]): void {
    const data = projets.map(projet => ({
      'Nom': projet.nom,
      'Client': projet.nomClient,
      'Statut': projet.status,
      'Chef': projet.chef,
      'Date début': projet.startDate,
      'Date fin': projet.endDate,
      'Membres': Array.isArray(projet.membres) ? projet.membres.length : 0
    }));

    // Créer un blob et télécharger
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projets');
    XLSX.writeFile(workbook, 'projets.xlsx');
  }
}
