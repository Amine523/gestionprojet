import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ExportService } from '@core/services/export.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Projet {
  id: string;
  nom: string;
  nomClient: string;
  chef: string;
  status: string;
  startDate: string;
  endDate: string;
  avancee: number;
  avanceeCalculee: number;
  healthScore: number;
  healthColor: string;
  endDatePredicted: string;
  membres: number;
}



@Component({
  selector: 'app-admin-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './admin-projets.component.html',
  styleUrls: ['./admin-projets.component.scss']
})
export class AdminProjetsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private exportService = inject(ExportService);
  private snackBar = inject(MatSnackBar);
  
  societeId: string = '';
  societeNom: string = '';
  projetsSignal = signal<Projet[]>([]);
  chefsSignal = signal<any[]>([]);

  searchQuery = '';
  filterStatut = '';
  page = 1;
  pageSize = 6;
  totalItems = 0;
  Math = Math;
  showDialog = false;
  editingProjet: any = null;
  formData: any = { nom: '', description: '', chef: '', dateDebut: '', dateFin: '', status: 'En attente' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.loadChefs();
  }

  loadChefs() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (users: any) => {
        let list: any[] = Array.isArray(users) ? users : (users?.items || []);
        const filtered = list.filter(u => {
          const typeId = (u.typeUtilisateurId || u.TypeUtilisateurId || u.typeUtilisateur?.id || u.TypeUtilisateur?.Id || '').toString().toUpperCase();
          const poste = (u.poste || u.Poste || '').toString().toUpperCase();
          const nom = (u.nom || u.Nom || '').toString().toUpperCase();
          
          return typeId === 'T004' || typeId.includes('CHEF') || poste.includes('CHEF');
        });
        console.log('AdminProjets - Chefs filtrés:', filtered.length, 'sur', list.length);
        this.chefsSignal.set(filtered);
        this.loadProjets();
      },
      error: () => {
        this.loadProjets();
      }
    });
  }

  loadProjets() {
    const condition: any = { 
      criteres: {},
      SortColumn: 'Id',
      SortOrder: 'DESC'
    };
    if (this.searchQuery) condition.criteres.Nom = this.searchQuery;
    if (this.filterStatut) condition.criteres.Status = this.filterStatut;
    if (this.societeId) condition.criteres.SocieteId = this.societeId;

    this.api.getProjetsDetailleByConditionPage(this.page, this.pageSize, condition).subscribe((res: any) => {
      if (!res) return;
      const items = res.items || [];
      const mapped = items.map((detail: any) => {
        const p = detail.projet || detail.Projet;
        const chefId = p.utilisateurId || p.UtilisateurId;
        const chef = this.chefsSignal().find(c => (c.id || c.Id) === chefId);
        const chefName = p.utilisateurNom || (chef ? `${chef.prenom || ''} ${chef.nom || ''}` : 'Non assigné');
        
        return {
          id: p.id || p.Id, 
          nom: p.nom || p.Nom, 
          nomClient: p.nomClient || p.NomClient, 
          chef: chefName, 
          status: p.status || p.Status || 'En attente',
          startDate: p.startDate || p.StartDate, 
          endDate: p.endDate || p.EndDate, 
          avancee: p.avancee || p.Avancee || 0, 
          avanceeCalculee: detail.avanceeCalculee || detail.AvanceeCalculee || 0,
          healthScore: detail.healthScore || detail.HealthScore || 0,
          healthColor: detail.healthColor || detail.HealthColor || 'Gris',
          endDatePredicted: detail.endDatePredicted || detail.EndDatePredicted || null,
          membres: p.membresCount || p.membres || 1,
          utilisateurId: chefId
        };
      });
      this.projetsSignal.set(mapped);
      this.totalItems = res.totalCount || 0;
      if (this.societeId) {
        const s = this.api.getRawStorage().societes?.find((x: any) => x.id === this.societeId);
        this.societeNom = s?.nom || '';
      }
    });
  }

  getStatusClass(s: string) {
    if (s === 'Terminé') return 'badge-success';
    if (s === 'En cours') return 'badge-info';
    return 'badge-warning';
  }

  setPage(p: number) { this.page = p; this.loadProjets(); }
  onPageSizeChange() { this.page = 1; this.loadProjets(); }
  applyFilter() { this.page = 1; this.loadProjets(); }
  exportExcel() { this.exportService.exportToExcel(this.projetsSignal(), 'Registre_Missions'); }
  exportPdf() { this.exportService.exportToPdf(['Nom', 'Statut', 'Chef'], this.projetsSignal().map(p => [p.nom, p.status, p.chef]), 'Rapport_Controle_Missions', 'Données Intelligence Mission'); }
  generateReport(project: Projet) { this.exportService.generateProjectIntelligenceReport(project, {}); }
  
  openAddDialog() { this.editingProjet = null; this.formData = { nom: '', description: '', chef: '', dateDebut: new Date().toISOString().split('T')[0], dateFin: '', status: 'En attente' }; this.showDialog = true; }
  editProjet(p: any) { this.editingProjet = p; this.formData = { ...p, dateDebut: p.startDate?.split('T')[0], dateFin: p.endDate?.split('T')[0] }; this.showDialog = true; }
  closeDialog() { this.showDialog = false; }

  saveProjet() {
    console.log('saveProjet called', this.formData);
    if (!this.formData.nom) {
      console.log('Nom is required');
      return;
    }
    const data = { 
      ...this.formData, 
      societeId: this.societeId,
      utilisateurId: this.formData.chef, 
      startDate: this.formData.dateDebut, 
      endDate: this.formData.dateFin 
    };
    
    const chefName = this.chefsSignal().find(c => c.id === data.utilisateurId)?.nom || 'Non assigné';
    console.log('Creating project with data:', data, 'chefName:', chefName);

    if (this.editingProjet) {
      this.api.updateProjet({ ...data, id: this.editingProjet.id }).subscribe(() => { 
        this.loadProjets();
        this.closeDialog(); 
      });
    } else {
      this.api.createProjet(data).subscribe((res: any) => { 
        console.log('Create response:', res);
        this.closeDialog();
        // Reload projects to ensure we have the correct data from backend
        this.loadProjets();
      }, (err) => {
        console.error('Error creating project:', err);
      });
    }
  }

  deleteProjet(p: any) {
    if (confirm('Décommissionner la mission ?')) {
      this.api.deleteProjet(p.id).subscribe({
        next: () => {
          this.snackBar.open('Mission décommissionnée', 'Fermer', { duration: 3000 });
          this.loadProjets();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
