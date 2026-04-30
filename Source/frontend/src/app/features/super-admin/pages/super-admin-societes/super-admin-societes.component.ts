import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ExportService } from '@core/services/export.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-super-admin-societes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './super-admin-societes.component.html',
  styleUrls: ['./super-admin-societes.component.scss']
})
export class SuperAdminSocietesComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private exportService = inject(ExportService);
  private snackBar = inject(MatSnackBar);

  get activeCount() {
    return this.societesSignal().filter(s => s.actif).length;
  }

  viewProjets(societe: any) {
    const id = societe.id || societe.Id;
    if (!id) return;
    this.router.navigate(['/superadmin/projets'], { queryParams: { societeId: id } });
  }

  societesSignal = signal<any[]>([]);
  searchFiltersSignal = signal({ global: '', city: '', planAbonnement: '' });

  filteredSocietes = computed(() => {
    const list = this.societesSignal();
    const filters = this.searchFiltersSignal();
    return list.filter(s => {
      const g = (s.nom + (s.email || '')).toLowerCase().includes(filters.global.toLowerCase());
      const c = (s.ville + (s.pays || '')).toLowerCase().includes(filters.city.toLowerCase());
      const p = !filters.planAbonnement || (s.planAbonnement || 'Standard').toUpperCase() === filters.planAbonnement;
      return g && c && p;
    });
  });

  searchFilters = { global: '', city: '', planAbonnement: '' };
  searchQuery = '';
  showDialog = false;
  editingSociete: any = null;
  formData: any = { nom: '', adresse: '', telephoneContact: '', actif: true, planAbonnement: 'Standard' };

  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['filter']) this.searchQuery = params['filter'];
    });
    this.loadSocietes();
  }

  loadSocietes() {
    this.isLoading = true;
    this.api.getSocietesPage(this.page, this.pageSize).subscribe({
      next: (res: any) => {
        const items = (res.items || []).map((s: any, idx: number) => {
          // Normalisation des propriétés (Handle PascalCase vs camelCase)
          const normalized = {
            id: s.id || s.Id || 'SOC_TN' + (idx + 1),
            nom: s.nom || s.Nom || '',
            email: s.email || s.Email || '',
            telephoneContact: s.telephoneContact || s.TelephoneContact || s.telephone || s.Telephone || '',
            ville: s.ville || s.Ville || '',
            pays: s.pays || s.Pays || '',
            adresse: s.adresse || s.Adresse || '',
            planAbonnement: s.planAbonnement || s.PlanAbonnement || 'Standard',
            actif: s.actif !== undefined ? s.actif : (s.Actif !== undefined ? s.Actif : true)
          };
          return normalized;
        });
        this.societesSignal.set(items);
        this.totalItems = res.totalCount || 0;
        this.isLoading = false;
      },
      error: () => {
        this.societesSignal.set([]);
        this.isLoading = false;
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadSocietes();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadSocietes();
  }

  getVisiblePages(): (number | string)[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (this.page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = this.page - 1; i <= this.page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }

  exportExcel() {
    this.exportService.exportToExcel(this.filteredSocietes(), 'Societes_Nadhemni');
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Ville', 'Statut'];
    const data = this.filteredSocietes().map(s => [
      s.nom, s.email, s.ville, s.actif ? 'Actif' : 'Suspendu'
    ]);
    this.exportService.exportToPdf(cols, data, 'Societes_Nadhemni', 'Liste des Sociétés');
  }

  applyAdvancedFilter() {
    this.searchFiltersSignal.update(f => ({ ...f, ...this.searchFilters }));
  }

  openDialog(societe?: any) {
    this.editingSociete = societe;
    this.formData = societe ? { 
      ...societe
    } : { 
      nom: '', adresse: '', telephoneContact: '', actif: true, planAbonnement: 'Standard', email: '', ville: '', pays: ''
    };
    this.showDialog = true;
  }

  saveSociete() {
    if (!this.formData.nom || this.formData.nom.trim().length < 2) {
      this.snackBar.open("Le nom de la société doit contenir au moins 2 caractères", 'Fermer', { duration: 3000 });
      return;
    }
    
    if (this.editingSociete) {
      this.api.updateSociete(this.formData).subscribe({
        next: () => {
          this.societesSignal.update(list => list.map(s => 
            (s.id === this.formData.id) ? { ...this.formData } : s
          ));
          this.snackBar.open('Société mise à jour', 'Fermer', { duration: 3000 });
          this.showDialog = false;
        }
      });
    } else {
      const societeId = 'SOC_' + Date.now().toString(36).toUpperCase();
      this.formData.id = societeId;
      this.api.createSociete(this.formData).subscribe({
        next: () => {
          this.loadSocietes();
          this.snackBar.open('Nouvelle société créée', 'Fermer', { duration: 3000 });
          this.showDialog = false;
        }
      });
    }
  }

  toggleStatus(societe: any) {
    const updated = { ...societe, actif: !societe.actif };
    this.api.updateSociete(updated).subscribe({
      next: () => {
        this.societesSignal.update(list => list.map(s => s.id === societe.id ? updated : s));
      }
    });
  }

  deleteSociete(societe: any) {
    const id = societe.id || societe.Id || '';
    if (!id) return;
    if (confirm('Confirmer la suppression définitive de ' + societe.nom + ' ?')) {
      this.api.deleteSociete(id).subscribe({
        next: () => {
          this.snackBar.open('Société supprimée', 'Fermer', { duration: 3000 });
          this.loadSocietes();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
