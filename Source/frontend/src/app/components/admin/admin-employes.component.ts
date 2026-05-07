import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ValidationErrorComponent } from '@shared/components';
import { EmployesService } from '../service/employes.service';
import { Employe, FiltreEmploye, EmployeFormData } from '../model/employes.model';

@Component({
  selector: 'app-admin-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, ValidationErrorComponent],
  templateUrl: './admin-employes.component.html',
  styleUrls: ['./admin-employes.component.scss']
})
export class AdminEmployesComponent implements OnInit {
  private employesService = inject(EmployesService);
  private fb = inject(FormBuilder);

  societeNom = '';
  
  // Reactive signals
  searchQuery = signal('');
  filterPoste = signal('');
  filterStatut = signal('');
  page = signal(1);
  pageSize = signal(10);

  // Computed properties
  filteredEmployes = computed(() => {
    const employes = this.employesService.employes$() || [];
    let filtered = employes;

    if (this.searchQuery()) {
      filtered = filtered.filter(e => 
        e.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        e.prenom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        e.email.toLowerCase().includes(this.searchQuery().toLowerCase())
      );
    }

    if (this.filterPoste()) {
      filtered = filtered.filter(e => e.typeUtilisateurId === this.filterPoste());
    }

    if (this.filterStatut()) {
      filtered = filtered.filter(e => e.statut === this.filterStatut());
    }

    return filtered;
  });

  paginatedEmployes = computed(() => {
    const filtered = this.filteredEmployes();
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredEmployes().length / this.pageSize());
  });

  totalPagesArray = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  });

  stats = computed(() => {
    return this.employesService.stats();
  });

  // Form groups
  employeForm!: FormGroup;
  editForm!: FormGroup;
  showAddDialog = signal(false);
  showEditDialog = signal<Employe | null>(null);
  selectedEmploye = signal<Employe | null>(null);

  societes$ = this.employesService.getSocietes();

  ngOnInit() {
    this.societeNom = this.employesService.getCurrentUser()?.societe?.nom || 'Votre société';
    
    this.employeForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      typeUtilisateurId: ['', Validators.required],
      societeId: ['', Validators.required],
      salaire: [null],
      adresse: ['']
    });

    this.editForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      typeUtilisateurId: ['', Validators.required],
      societeId: ['', Validators.required],
      salaire: [null],
      adresse: ['']
    });

    this.loadEmployes();
  }

  loadEmployes() {
    this.employesService.getEmployes({
      recherche: this.searchQuery(),
      typeUtilisateurId: this.filterPoste(),
      statut: this.filterStatut(),
      societeId: this.employesService.getCurrentUser()?.societeId || ''
    });
  }

  filterEmployes() {
    this.page.set(1);
  }

  openAddDialog() {
    this.employeForm.reset();
    this.showAddDialog.set(true);
  }

  closeAddDialog() {
    this.showAddDialog.set(false);
  }

  openEditDialog(employe: Employe) {
    this.selectedEmploye.set(employe);
    this.editForm.patchValue({
      nom: employe.nom,
      prenom: employe.prenom,
      email: employe.email,
      telephone: employe.telephone,
      typeUtilisateurId: employe.typeUtilisateurId,
      societeId: employe.societeId,
      salaire: employe.salaire,
      adresse: employe.adresse
    });
    this.showEditDialog.set(true);
  }

  closeEditDialog() {
    this.showEditDialog.set(null);
    this.selectedEmploye.set(null);
  }

  onSubmit() {
    if (this.showAddDialog()) {
      this.addEmploye();
    } else if (this.showEditDialog() && this.selectedEmploye()) {
      this.updateEmploye();
    }
  }

  addEmploye() {
    if (this.employeForm.valid) {
      const formData: EmployeFormData = this.employeForm.value;
      this.employesService.createEmploye(formData).subscribe({
        next: () => {
          this.closeAddDialog();
        }
      });
    }
  }

  updateEmploye() {
    if (this.editForm.valid && this.selectedEmploye()) {
      const formData: Partial<EmployeFormData> = this.editForm.value;
      this.employesService.updateEmploye(this.selectedEmploye()!.id, formData).subscribe({
        next: () => {
          this.closeEditDialog();
        }
      });
    }
  }

  deleteEmploye(employe: Employe) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${employe.nom} ${employe.prenom}?`)) {
      this.employesService.deleteEmploye(employe.id).subscribe();
    }
  }

  toggleStatut(employe: Employe) {
    const newStatut = employe.statut === 'actif' ? 'inactif' : 'actif';
    const formData: Partial<EmployeFormData> = { statut: newStatut };
    this.employesService.updateEmploye(employe.id, formData).subscribe();
  }

  // Helper methods
  getRoleLabel(typeId: string): string {
    const types: { [key: string]: string } = {
      'T001': 'Super Admin',
      'T002': 'Admin Société',
      'T003': 'RH',
      'T004': 'Chef de Projet',
      'T005': 'Développeur',
      'T006': 'Testeur/QA',
      'T007': 'Candidat',
      'T008': 'Client'
    };
    return types[typeId] || typeId;
  }

  // Form validation helpers
  get formErrors() {
    const form = this.showAddDialog() ? this.employeForm : this.editForm;
    return form.controls;
  }

  get editErrors() {
    return this.editForm.controls;
  }

  // Pagination helpers
  changePage(newPage: number) {
    this.page.set(newPage);
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.set(this.page() + 1);
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
    }
  }
}
