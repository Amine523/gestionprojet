import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-employes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-people" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Employés - {{societeNom}}</h1>
          <p class="mb-0" style="opacity: 0.8;">Gestion des utilisateurs</p>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
            <div class="d-flex gap-2 flex-wrap">
              <div class="input-group" style="min-width: 250px;">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control border-start-0 bg-light" [(ngModel)]="searchQuery" (ngModelChange)="filterEmployes()" placeholder="Rechercher par nom ou email...">
              </div>
              <select class="form-select" style="width: auto;" [(ngModel)]="filterPoste" (ngModelChange)="filterEmployes()">
                <option value="">Tous les postes</option>
                <option value="developpeur">Développeur</option>
                <option value="testeur">Testeur</option>
                <option value="chef_projet">Chef de projet</option>
                <option value="rh">RH</option>
                <option value="admin_societe">Admin Société</option>
                <option value="utilisateur">Utilisateur</option>
              </select>
              <select class="form-select" style="width: auto;" [(ngModel)]="filterStatut" (ngModelChange)="filterEmployes()">
                <option value="">Tous</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
            <button class="btn btn-primary" (click)="showAddDialog = true">
              <i class="bi bi-plus-lg me-2"></i>Ajouter employé
            </button>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Poste</th>
                  <th>Téléphone</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredEmployes; track e.id) {
                  <tr>
                    <td>{{e['id'] || e.id}}</td>
                    <td>{{e['nom'] || e.nom}}</td>
                    <td>{{e['email'] || e.email}}</td>
                    <td>{{getPosteLabel(e['typeUtilisateurId'] || e.typeUtilisateurId || e.poste)}}</td>
                    <td class="font-monospace" style="font-size: 13px;">{{e['telephone'] || e.telephone || '—'}}</td>
                    <td>
                      <span class="badge rounded-pill" [class]="e.actif ? 'bg-success' : 'bg-danger'">
                        {{e.actif ? 'Actif' : 'Inactif'}}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" (click)="editEmploye(e)" title="Modifier">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary me-1" (click)="toggleStatut(e)" [title]="e.actif ? 'Désactiver' : 'Activer'">
                        <i class="bi bi-{{e.actif ? 'ban' : 'check-circle'}}"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteEmploye(e)" title="Supprimer">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (filteredEmployes.length === 0) {
            <div class="text-center py-5 text-muted">
              <i class="bi bi-person-x" style="font-size: 48px;"></i>
              <p class="mt-3">Aucun employé trouvé</p>
            </div>
          }
        </div>
      </div>

      @if (showAddDialog || editingEmploye) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                <h5 class="modal-title">{{editingEmploye ? 'Modifier' : 'Nouvel'}} Employé</h5>
                <button type="button" class="btn-close btn-close-white" (click)="closeDialog()"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nom complet</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input type="text" class="form-control" [(ngModel)]="formData.nom" placeholder="Nom et prénom">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <input type="email" class="form-control" [(ngModel)]="formData.email" placeholder="email@exemple.com">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Téléphone</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                    <input type="text" class="form-control" [(ngModel)]="formData.telephone" placeholder="+216 00 000 000">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mot de passe</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <input type="password" class="form-control" [(ngModel)]="formData.password" placeholder="Mot de passe par défaut: admin123">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Poste</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-briefcase"></i></span>
                    <select class="form-select" [(ngModel)]="formData.typeUtilisateurId">
                      <option value="developpeur">Développeur</option>
                      <option value="testeur">Testeur</option>
                      <option value="chef_projet">Chef de projet</option>
                      <option value="rh">RH</option>
                      <option value="admin_societe">Admin Société</option>
                      <option value="utilisateur">Utilisateur</option>
                    </select>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center py-2">
                  <span>Employé actif</span>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="formData.actif">
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" (click)="closeDialog()">Annuler</button>
                <button type="button" class="btn btn-primary" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="saveEmploye()">
                  <i class="bi bi-save me-2"></i>{{editingEmploye ? 'Modifier' : 'Enregistrer'}}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="closeDialog()"></div>
      }
    </div>
  `,
  styles: [``]
})
export class AdminEmployesComponent implements OnInit {
  private api = inject(ApiService);

  employes: any[] = [];
  filteredEmployes: any[] = [];
  displayedColumns = ['id', 'nom', 'email', 'poste', 'telephone', 'statut', 'actions'];
  
  searchQuery = '';
  filterPoste = '';
  filterStatut = '';
  
  showAddDialog = false;
  editingEmploye: any = null;
  formData: any = { nom: '', email: '', telephone: '', poste: 'developpeur', actif: true };

  societeId = '';
  societeNom = '';

  ngOnInit() {
    const currentUser = this.api.getCurrentUser();
    this.societeId = currentUser?.societeId || '';
    this.societeNom = currentUser?.societe?.nom || 'Votre société';
    this.loadEmployes();
  }

  loadEmployes() {
    console.log('Admin societeId:', this.societeId);
    this.api.getUtilisateurs().subscribe({
      next: (data) => {
        const apiData = data || [];
        console.log('Total users from DB:', apiData.length);
        if (apiData.length > 0 && this.societeId) {
          this.employes = apiData.filter((u: any) => u.societeId === this.societeId);
        } else if (apiData.length > 0) {
          this.employes = apiData;
        } else {
          this.employes = this.getSeedEmployes().filter((u: any) => u.societeId === this.societeId);
        }
        console.log('Loaded employes for societe', this.societeId, ':', this.employes.length);
        this.filterEmployes();
      },
      error: () => {
        this.employes = this.getSeedEmployes().filter((u: any) => u.societeId === this.societeId);
        this.filterEmployes();
      }
    });
  }

  getSeedEmployes(): any[] {
    return [
      { id: 'SP_ADM', nom: 'Admin Soft Pro', email: 'admin@softpro.tn', telephone: '+216 55 100 001', societeId: 'SP001', typeUtilisateurId: 'admin_societe', actif: true },
      { id: 'SP_RH', nom: 'RH Soft Pro', email: 'rh@softpro.tn', telephone: '+216 55 100 002', societeId: 'SP001', typeUtilisateurId: 'rh', actif: true },
      { id: 'SP_CHEF', nom: 'Chef Groupe Soft Pro', email: 'chef@softpro.tn', telephone: '+216 55 100 003', societeId: 'SP001', typeUtilisateurId: 'chef_projet', actif: true },
      { id: 'SP_DEV', nom: 'Développeur Soft Pro', email: 'dev@softpro.tn', telephone: '+216 55 100 004', societeId: 'SP001', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SP_TEST', nom: 'Testeur QA Soft Pro', email: 'test@softpro.tn', telephone: '+216 55 100 005', societeId: 'SP001', typeUtilisateurId: 'testeur', actif: true },
      { id: 'SOC_TN001_ADM', nom: 'Ahmed Ben Ali', email: 'ahmed@techtunisia.tn', telephone: '+216 00 111 111', societeId: 'SOC_TN001', typeUtilisateurId: 'admin_societe', actif: true },
      { id: 'SOC_TN001_DEV1', nom: 'Fatma Kraiem', email: 'fatma@techtunisia.tn', telephone: '+216 00 111 112', societeId: 'SOC_TN001', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN001_DEV2', nom: 'Mohamed Said', email: 'mohamed@techtunisia.tn', telephone: '+216 00 111 113', societeId: 'SOC_TN001', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN001_RH', nom: 'Sarah Trimeche', email: 'sarah@techtunisia.tn', telephone: '+216 00 111 114', societeId: 'SOC_TN001', typeUtilisateurId: 'rh', actif: true },
      { id: 'SOC_TN002_ADM', nom: 'Slaheddine Mansour', email: 'salah@digitalconnect.tn', telephone: '+216 00 222 111', societeId: 'SOC_TN002', typeUtilisateurId: 'admin_societe', actif: true },
      { id: 'SOC_TN002_DEV', nom: 'Leila Mseddi', email: 'leila@digitalconnect.tn', telephone: '+216 00 222 112', societeId: 'SOC_TN002', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN002_CHEF', nom: 'Karim Bouazizi', email: 'karim@digitalconnect.tn', telephone: '+216 00 222 113', societeId: 'SOC_TN002', typeUtilisateurId: 'chef_projet', actif: true },
      { id: 'SOC_TN003_ADM', nom: 'Youssef Ghanmi', email: 'youssef@innovatetech.tn', telephone: '+216 00 333 111', societeId: 'SOC_TN003', typeUtilisateurId: 'admin_societe', actif: true },
      { id: 'SOC_TN003_DEV1', nom: 'Samia Trabelsi', email: 'samia@innovatetech.tn', telephone: '+216 00 333 112', societeId: 'SOC_TN003', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN003_DEV2', nom: 'Ali Bouzid', email: 'ali@innovatetech.tn', telephone: '+216 00 333 113', societeId: 'SOC_TN003', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN003_RH', nom: 'Nour Ben Hamida', email: 'nour@innovatetech.tn', telephone: '+216 00 333 114', societeId: 'SOC_TN003', typeUtilisateurId: 'rh', actif: true },
      { id: 'SOC_TN003_TEST', nom: 'Mehdi Khelifi', email: 'mehdi@innovatetech.tn', telephone: '+216 00 333 115', societeId: 'SOC_TN003', typeUtilisateurId: 'testeur', actif: true },
      { id: 'SOC_TN004_ADM', nom: 'Malek Amara', email: 'malek@smarttech.tn', telephone: '+216 00 444 111', societeId: 'SOC_TN004', typeUtilisateurId: 'admin_societe', actif: true },
      { id: 'SOC_TN004_DEV1', nom: 'Nadia Hamdi', email: 'nadia@smarttech.tn', telephone: '+216 00 444 112', societeId: 'SOC_TN004', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN004_DEV2', nom: 'Imed Chaabane', email: 'imed@smarttech.tn', telephone: '+216 00 444 113', societeId: 'SOC_TN004', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN004_CHEF', nom: 'Hichem Ben Ammar', email: 'hichem@smarttech.tn', telephone: '+216 00 444 114', societeId: 'SOC_TN004', typeUtilisateurId: 'chef_projet', actif: true },
      { id: 'SOC_TN005_ADM', nom: 'Tarek Lassoued', email: 'tarek@carthage.tn', telephone: '+216 00 555 111', societeId: 'SOC_TN005', typeUtilisateurId: 'admin_societe', actif: true },
      { id: 'SOC_TN005_CHEF', nom: 'Bilal Graa', email: 'bilal@carthage.tn', telephone: '+216 00 555 112', societeId: 'SOC_TN005', typeUtilisateurId: 'chef_projet', actif: true },
      { id: 'SOC_TN005_USER', nom: 'Hajer Charfi', email: 'hajer@carthage.tn', telephone: '+216 00 555 113', societeId: 'SOC_TN005', typeUtilisateurId: 'utilisateur', actif: true },
      { id: 'SOC_TN006_ADM', nom: 'Bilel Karray', email: 'bilel@medinatech.tn', telephone: '+216 00 666 111', societeId: 'SOC_TN006', typeUtilisateurId: 'admin_societe', actif: true },
      { id: 'SOC_TN006_DEV1', nom: 'Asma Ben Helal', email: 'asma@medinatech.tn', telephone: '+216 00 666 112', societeId: 'SOC_TN006', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN006_DEV2', nom: 'Wassim Jlassi', email: 'wassim@medinatech.tn', telephone: '+216 00 666 113', societeId: 'SOC_TN006', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN006_RH', nom: 'Mona Ben Ali', email: 'mona@medinatech.tn', telephone: '+216 00 666 114', societeId: 'SOC_TN006', typeUtilisateurId: 'rh', actif: true },
      { id: 'SOC_TN007_ADM', nom: 'Maher Dhieb', email: 'maher@sfaxit.tn', telephone: '+216 00 777 111', societeId: 'SOC_TN007', typeUtilisateurId: 'admin_societe', actif: true },
      { id: 'SOC_TN007_DEV1', nom: 'Ons Maalla', email: 'ons@sfaxit.tn', telephone: '+216 00 777 112', societeId: 'SOC_TN007', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN007_DEV2', nom: 'Riadh Jebali', email: 'riadh@sfaxit.tn', telephone: '+216 00 777 113', societeId: 'SOC_TN007', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN007_CHEF', nom: 'Saber Ben Hassine', email: 'saber@sfaxit.tn', telephone: '+216 00 777 114', societeId: 'SOC_TN007', typeUtilisateurId: 'chef_projet', actif: true },
      { id: 'SOC_TN007_TEST', nom: 'Sana Benabdallah', email: 'sana@sfaxit.tn', telephone: '+216 00 777 115', societeId: 'SOC_TN007', typeUtilisateurId: 'testeur', actif: true },
      { id: 'SOC_TN008_CHEF', nom: 'Chedly Belhaj', email: 'chedly@monastir.tn', telephone: '+216 00 888 111', societeId: 'SOC_TN008', typeUtilisateurId: 'chef_projet', actif: true },
      { id: 'SOC_TN008_DEV1', nom: 'Mariem Mghirbi', email: 'mariem@monastir.tn', telephone: '+216 00 888 112', societeId: 'SOC_TN008', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN008_DEV2', nom: 'Abdelwaheb Ayed', email: 'abdelwaheb@monastir.tn', telephone: '+216 00 888 113', societeId: 'SOC_TN008', typeUtilisateurId: 'developpeur', actif: true },
      { id: 'SOC_TN008_RH', nom: 'Dalila Ben Amor', email: 'dalila@monastir.tn', telephone: '+216 00 888 114', societeId: 'SOC_TN008', typeUtilisateurId: 'rh', actif: true }
    ];
  }

  filterEmployes() {
    this.filteredEmployes = this.employes.filter(e => {
      const poste = e.typeUtilisateurId || e.poste || '';
      const matchesSearch = !this.searchQuery || 
        (e.nom?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        e.email?.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesPoste = !this.filterPoste || poste === this.filterPoste;
      const matchesStatut = !this.filterStatut || 
        (this.filterStatut === 'actif' && e.actif) || 
        (this.filterStatut === 'inactif' && !e.actif);
      return matchesSearch && matchesPoste && matchesStatut;
    });
  }

  getPosteLabel(poste: string): string {
    const labels: any = { 
      developpeur: 'Développeur', 
      testeur: 'Testeur', 
      chef_projet: 'Chef de projet', 
      rh: 'RH',
      admin_societe: 'Admin Société',
      utilisateur: 'Utilisateur'
    };
    return labels[poste] || poste;
  }

  editEmploye(e: any) {
    this.editingEmploye = e;
    this.formData = { ...e };
  }

  toggleStatut(e: any) {
    e.actif = !e.actif;
    alert(e.actif ? 'Employé activé' : 'Employé désactivé');
  }

  deleteEmploye(e: any) {
    if (confirm('Supprimer ' + e.nom + '?')) {
      this.employes = this.employes.filter(x => x.id !== e.id);
      this.saveToStorage();
      this.filterEmployes();
      alert('Employé supprimé');
    }
  }

  saveToStorage() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.employes = this.employes;
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  closeDialog() {
    this.showAddDialog = false;
    this.editingEmploye = null;
    this.formData = { nom: '', email: '', telephone: '', password: '', typeUtilisateurId: 'developpeur', actif: true };
  }

  saveEmploye() {
    if (!this.formData.nom || !this.formData.email) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    const telephoneVal = this.formData.telephone ? String(this.formData.telephone).trim() : '';
    
    const employeData = {
      nom: this.formData.nom,
      email: this.formData.email,
      password: this.formData.password || 'admin123',
      telephone: telephoneVal,
      societeId: this.societeId,
      typeUtilisateurId: this.formData.typeUtilisateurId,
      actif: this.formData.actif
    };
    
    console.log('Saving employe with telephone:', telephoneVal);
    
    if (this.editingEmploye) {
      this.api.updateUtilisateur(this.editingEmploye.id, employeData).subscribe({
        next: () => {
          const index = this.employes.findIndex((e: any) => e.id === this.editingEmploye.id);
          if (index >= 0) this.employes[index] = { ...employeData, id: this.editingEmploye.id };
          this.filterEmployes();
          alert('Employé modifié');
        },
        error: () => {
          const index = this.employes.findIndex((e: any) => e.id === this.editingEmploye.id);
          if (index >= 0) this.employes[index] = { ...employeData, id: this.editingEmploye.id };
          this.saveToStorage();
          this.filterEmployes();
          alert('Employé modifié (hors ligne)');
        }
      });
    } else {
      this.api.createUtilisateur(employeData).subscribe({
        next: (res) => {
          const newEmploye = { ...employeData, id: res.id || res };
          this.employes.push(newEmploye);
          this.filterEmployes();
          alert('Employé ajouté');
        },
        error: () => {
          const newId = 'EMP_' + Date.now();
          const newEmploye = { ...employeData, id: newId };
          this.employes.push(newEmploye);
          this.saveToStorage();
          this.filterEmployes();
          alert('Employé ajouté (hors ligne)');
        }
      });
    }
    
    this.closeDialog();
  }
}
