import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-rh-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './rh-employes.component.html',
  styleUrls: ['./rh-employes.component.scss']
})
export class RhEmployesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private exportService = inject(ExportService);

  employesSignal = signal<any[]>([]);
  searchQuery = signal('');
  filterDepartement = signal('');
  filterStatut = signal('');
  
  filteredEmployes = computed(() => {
    const list = this.employesSignal();
    const q = this.searchQuery().toLowerCase();
    const dept = this.filterDepartement().toLowerCase();
    const stat = this.filterStatut();
    
    return list.filter(e => {
      const matchesSearch = !q || e.nom.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
      const matchesDept = !dept || e.departement?.toLowerCase() === dept;
      const matchesStatut = !stat || 
        (stat === 'actif' && e.actif) || 
        (stat === 'inactif' && !e.actif);
      return matchesSearch && matchesDept && matchesStatut;
    });
  });

  displayedColumns = ['nom', 'email', 'poste', 'departement', 'contrat', 'statut', 'actions'];
  
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;
  
  showForm = false;
  editingEmploye: any = null;
  viewingEmploye: any = null;
  formData: any = { nom: '', email: '', motDePasse: '', telephone: '', poste: 'Développeur', departement: 'Informatique', contrat: 'CDI', actif: true };
  
  totalEmployes = 0;
  employesActifs = 0;
  employesInactifs = 0;
  nouveauxEmployes = 0;
  departementsStats: any[] = [];
  societeId: string = '';
  societeNom: string = '';

  ngOnInit() { 
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadEmployes(); 
  }

  private normalizeEmploye(e: any): any {
    if (!e) return null;
    return {
      id: e.id || e.Id || e.utilisateurId || e.UtilisateurId,
      nom: e.nom || e.Nom || 'Sans nom',
      email: e.email || e.Email || '',
      telephone: e.telephone || e.Telephone || '',
      poste: e.poste || e.Poste || 'Employé',
      departement: e.departement || e.Departement || 'Général',
      contrat: e.contrat || e.Contrat || 'CDI',
      actif: e.actif !== undefined ? e.actif : (e.Actif !== undefined ? e.Actif : true),
      societeId: e.societeId || e.SocieteId || this.societeId,
      typeUtilisateurId: e.typeUtilisateurId || e.TypeUtilisateurId || 'T005'
    };
  }

  loadEmployes() {
    this.isLoading = true;
    // Utilisation directe du filtrage par société côté Backend
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (res: any) => {
        let list: any[] = Array.isArray(res) ? res : (res?.items || []);
        const normalized = list.map((e: any) => this.normalizeEmploye(e)).filter(e => e !== null);
        this.employesSignal.set(normalized);
        this.totalItems = normalized.length;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => { 
        console.error('RH Error:', err);
        this.employesSignal.set([]);
        this.isLoading = false; 
      }
    });
  }

  filterEmployes() {
    this.page = 1;
    this.loadEmployes();
  }


  
  setPage(p: number) {
    this.page = p;
    this.loadEmployes();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadEmployes();
  }

  exportExcel() {
    this.exportService.exportToExcel(this.filteredEmployes(), 'Talents_Ecosystem_' + this.societeNom);
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Poste', 'Contrat', 'Statut'];
    const data = this.filteredEmployes().map(e => [
      e.nom, e.email, e.poste, e.contrat || 'CDI', e.actif ? 'Actif' : 'Inactif'
    ]);
    this.exportService.exportToPdf(cols, data, 'Talents_Ecosystem', 'Audit Stratégique Talents - ' + this.societeNom);
  }

  calculateStats() {
    const list = this.employesSignal();
    this.totalEmployes = list.length;
    this.employesActifs = list.filter(e => e.actif).length;
    this.employesInactifs = this.totalEmployes - this.employesActifs;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    this.nouveauxEmployes = 0; // calculated from real data when available
    
    const depts = ['Informatique', 'RH', 'Commercial', 'Finance'];
    this.departementsStats = depts.map(d => ({
      nom: d,
      nombre: list.filter(e => e.departement === d).length,
      percentage: 0
    }));
    const max = Math.max(...this.departementsStats.map(d => d.nombre), 1);
    this.departementsStats.forEach(d => d.percentage = (d.nombre / max) * 100);
  }

  viewDetails(e: any) { this.viewingEmploye = e; }
  editEmploye(e: any) { this.editingEmploye = e; this.formData = { ...e }; this.showForm = true; }
  
  toggleStatut(e: any) {
    const updatedUser = { ...e, actif: !e.actif };
    this.api.updateUtilisateur(e.id || e.Id, updatedUser).subscribe({
      next: () => {
        // Immediate update
        this.employesSignal.update(list => list.map(item => 
          (item.id === e.id) ? { ...item, actif: !item.actif } : item
        ));
        this.snackBar.open(e.actif ? 'Talent activé' : 'Talent désactivé', 'Fermer', { duration: 2000 });
        this.calculateStats();
      }
    });
  }

  deleteEmploye(e: any) {
    if (confirm("Confirmer la suppression de " + e.nom + " ?")) {
      this.api.deleteUtilisateur(e.id || e.Id).subscribe({
        next: () => {
          this.snackBar.open("Collaborateur supprimé", 'Fermer', { duration: 2000 });
          this.loadEmployes();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  openForm() {
    this.formData = { nom: '', email: '', motDePasse: '', telephone: '', poste: 'Développeur', departement: 'Informatique', contrat: 'CDI', actif: true, typeUtilisateurId: 'T005' };
    this.showForm = true;
    this.editingEmploye = null;
  }

  closeDialog() {
    this.showForm = false;
    this.editingEmploye = null;
    this.viewingEmploye = null;
  }

  saveEmploye() {
    if (!this.formData.nom || this.formData.nom.trim().length < 3) {
      this.snackBar.open("Le nom doit contenir au moins 3 caractères", 'Fermer', { duration: 3000 });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email || !emailRegex.test(this.formData.email)) {
      this.snackBar.open("Format d'email invalide", 'Fermer', { duration: 3000 });
      return;
    }

    const payload = { 
      id: this.editingEmploye ? (this.editingEmploye.id || this.editingEmploye.Id) : '',
      nom: this.formData.nom,
      email: this.formData.email,
      motDePasse: this.formData.motDePasse || '123456',
      typeUtilisateurId: this.formData.typeUtilisateurId || 'T005',
      societeId: this.societeId,
      actif: this.formData.actif !== undefined ? this.formData.actif : true,
      roleId: 'R001'
    };
    
    if (this.editingEmploye) {
      this.api.updateUtilisateur(this.editingEmploye.id || this.editingEmploye.Id, payload).subscribe({
        next: () => {
          this.loadEmployes();
          this.snackBar.open('Registre mis à jour', 'Fermer', { duration: 2000 });
          this.closeDialog();
        },
        error: (err) => this.snackBar.open('Erreur: ' + (err.message || 'Échec'), 'Fermer', { duration: 3000 })
      });
    } else {
      this.api.createUtilisateur(payload).subscribe({
        next: () => {
          this.loadEmployes();
          this.snackBar.open('Nouveau collaborateur ajouté', 'Fermer', { duration: 2000 });
          this.closeDialog();
        },
        error: (err) => this.snackBar.open('Erreur: ' + (err.message || 'Échec'), 'Fermer', { duration: 3000 })
      });
    }
  }
}
