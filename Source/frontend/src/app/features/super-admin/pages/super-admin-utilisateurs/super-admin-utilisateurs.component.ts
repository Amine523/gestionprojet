import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ExportService } from '@core/services/export.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-super-admin-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './super-admin-utilisateurs.component.html',
  styleUrls: ['./super-admin-utilisateurs.component.scss']
})
export class SuperAdminUtilisateursComponent implements OnInit {
  private api = inject(ApiService);
  private exportService = inject(ExportService);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'nom', 'email', 'societeId', 'typeUtilisateurId', 'actif', 'actions'];
  usersSignal = signal<any[]>([]);
  societesSignal = signal<any[]>([]);

  searchQuery = '';
  selectedSociete = '';
  showDialog = false;
  editingUser: any = null;
  formData: any = { nom: '', email: '', societeId: '', typeUtilisateurId: 'T005', actif: true };

  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;

  ngOnInit() {
    this.loadSocietes();
    this.loadUsers();
  }

  loadSocietes() {
    this.api.getSocietes().subscribe({
      next: (data) => { 
        const validSocietes = (data || []).filter((s: any) => s.id && s.id.trim());
        this.societesSignal.set(validSocietes);
      }
    });
  }

  loadUsers() {
    this.isLoading = true;
    const condition = {
      nom: this.searchQuery,
      societeId: this.selectedSociete,
      criteres: {}
    };

    const obs = (this.searchQuery || this.selectedSociete) 
      ? this.api.getUtilisateursByConditionPage(this.page, this.pageSize, condition)
      : this.api.getUtilisateursPage(this.page, this.pageSize);

    obs.subscribe({
      next: (res: any) => {
        this.usersSignal.set(res.items || []);
        this.totalItems = res.totalCount || 0;
        this.isLoading = false;
      },
      error: () => {
        this.usersSignal.set([]);
        this.totalItems = 0;
        this.isLoading = false;
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadUsers();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadUsers();
  }

  applyFilter() {
    this.page = 1;
    this.loadUsers();
  }

  filterBySociete() {
    this.page = 1;
    this.loadUsers();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedSociete = '';
    this.page = 1;
    this.loadUsers();
  }

  exportExcel() {
    this.exportService.exportToExcel(this.usersSignal(), 'Utilisateurs_Nadhemni');
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Société', 'Statut'];
    const data = this.usersSignal().map(u => [
      u.nom, u.email, this.getSocieteName(u.societeId), u.actif ? 'Actif' : 'Inactif'
    ]);
    this.exportService.exportToPdf(cols, data, 'Utilisateurs_Nadhemni', 'Liste des Utilisateurs');
  }

  getSocieteName(societeId: string): string {
    const societe = this.societesSignal().find(s => s.id === societeId);
    return societe ? societe.nom : '-';
  }

  openDialog(user?: any) {
    this.editingUser = user;
    const autoNv = 'V' + new Date().getFullYear() + '.' + String(Date.now()).slice(-4);
    this.formData = user ? { 
      ...user,
      telephone: user.telephone || '',
      password: '',
      nv: user.nv || autoNv
    } : { 
      nom: '', 
      email: '', 
      societeId: '', 
      typeUtilisateurId: 'T005', 
      actif: true,
      telephone: '',
      password: '',
      nv: autoNv
    };
    this.loadSocietes();
    this.showDialog = true;
  }

  saveUser() {
    if (!this.formData.nom || this.formData.nom.trim().length < 3) {
      this.snackBar.open("Le nom doit contenir au moins 3 caractères", 'Fermer', { duration: 3000 });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email || !emailRegex.test(this.formData.email)) {
      this.snackBar.open("Format d'email invalide", 'Fermer', { duration: 3000 });
      return;
    }

    // Vérifier si l'email existe déjà (uniquement pour la création)
    if (!this.editingUser) {
      const emailExists = this.usersSignal().some(u => u.email === this.formData.email);
      if (emailExists) {
        this.snackBar.open("Cet email est déjà utilisé par un autre utilisateur", 'Fermer', { duration: 3000 });
        return;
      }
    }

    const payload = {
      ...this.formData,
      motDePasse: this.formData.password || this.formData.motDePasse || '123456'
    };

    if (this.editingUser) {
      this.api.updateUtilisateur(this.editingUser.id, payload).subscribe({
        next: () => {
          this.usersSignal.update(list => list.map(u => u.id === this.editingUser.id ? { ...u, ...payload } : u));
          this.snackBar.open('Utilisateur mis à jour', 'Fermer', { duration: 3000 });
          this.showDialog = false;
        },
        error: (err) => this.snackBar.open('Erreur: ' + (err.error || 'Échec'), 'Fermer', { duration: 3000 })
      });
    } else {
      this.api.createUtilisateur(payload).subscribe({
        next: () => {
          this.snackBar.open('Nouvel utilisateur créé', 'Fermer', { duration: 3000 });
          this.showDialog = false;
          this.loadUsers();
        },
        error: (err) => {
          const errorText = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
          if (errorText.includes('UNIQUE KEY') && errorText.includes('email')) {
            this.snackBar.open("Cet email existe déjà dans la base de données", 'Fermer', { duration: 5000 });
          } else {
            this.snackBar.open('Erreur: ' + (err.error?.message || errorText || 'Échec'), 'Fermer', { duration: 5000 });
          }
        }
      });
    }
  }

  deleteUser(user: any) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.api.deleteUtilisateur(user.id).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  toggleStatus(user: any) {
    const updated = { ...user, actif: !user.actif };
    this.api.updateUtilisateur(user.id, updated).subscribe({
      next: () => {
        this.usersSignal.update(list => list.map(u => u.id === user.id ? { ...u, actif: !user.actif } : u));
      }
    });
  }
}
