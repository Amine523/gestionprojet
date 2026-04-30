import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './admin-employes.component.html',
  styleUrls: ['./admin-employes.component.scss']
})
export class AdminEmployesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  employes: any[] = [];
  filteredEmployes: any[] = [];
  searchQuery = '';
  filterPoste = '';
  filterStatut = '';
  showAddDialog = false;
  editingEmploye: any = null;
  formData: any = { nom: '', email: '', telephone: '', typeUtilisateurId: 'developpeur', password: '', actif: true };
  societeId = '';
  societeNom = '';

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadEmployes();
  }

  loadEmployes() {
    this.api.getEmployesBySociete(this.societeId).subscribe(data => {
      this.employes = data || [];
      this.filterEmployes();
    });
  }

  filterEmployes() {
    this.filteredEmployes = this.employes.filter(e => {
      const matchesSearch = !this.searchQuery || e.nom?.toLowerCase().includes(this.searchQuery.toLowerCase()) || e.email?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesPoste = !this.filterPoste || (e.typeUtilisateurId || e.poste || '').toLowerCase() === this.filterPoste.toLowerCase();
      const matchesStatut = !this.filterStatut || (this.filterStatut === 'actif' ? e.actif : !e.actif);
      return matchesSearch && matchesPoste && matchesStatut;
    });
  }

  getPosteLabel(p: string): string {
    const labels: any = { developpeur: 'Ingénieur', testeur: 'QA', chef_projet: 'Chef de Projet', rh: 'RH', admin_societe: 'Administrateur' };
    return labels[p?.toLowerCase()] || p;
  }

  openAddDialog() { this.formData = { nom: '', email: '', telephone: '', typeUtilisateurId: 'developpeur', password: '', actif: true }; this.showAddDialog = true; }
  editEmploye(e: any) { this.editingEmploye = e; this.formData = { ...e }; this.showAddDialog = false; }
  closeDialog() { this.showAddDialog = false; this.editingEmploye = null; }

  saveEmploye() {
    if (!this.formData.nom || !this.formData.email) return;
    const payload = { ...this.formData, societeId: this.societeId };
    if (this.editingEmploye) {
      this.api.updateUtilisateur(this.editingEmploye.id, payload).subscribe(() => { 
        this.loadEmployes(); 
        this.closeDialog(); 
        this.snackBar.open('Talent mis à jour', 'OK', { duration: 2000 });
      });
    } else {
      this.api.createUtilisateur(payload).subscribe(() => { 
        this.loadEmployes(); 
        this.closeDialog(); 
        this.snackBar.open('Nouveau talent intégré', 'OK', { duration: 2000 });
      });
    }
  }

  toggleStatut(e: any) {
    e.actif = !e.actif;
    this.api.updateUtilisateur(e.id, e).subscribe(() => this.snackBar.open(e.actif ? 'Unité Activée' : 'Unité Hors Ligne', 'OK', { duration: 2000 }));
  }

  deleteEmploye(e: any) {
    if (confirm('Supprimer cette unité ?')) {
      this.api.deleteUtilisateur(e.id).subscribe({
        next: () => {
          this.snackBar.open('Unité supprimée', 'Fermer', { duration: 3000 });
          this.loadEmployes();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
