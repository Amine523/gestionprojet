import { Component, OnInit, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ValidationErrorComponent } from '@shared/components';
import { EmployesService } from '../service/employes.service';
import { Employe, FiltreEmploye, EmployeFormData } from '../model/employes.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, ValidationErrorComponent],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.scss']
})
export class EmployesComponent implements OnInit, OnDestroy {
  private employesService = inject(EmployesService);
  private fb = inject(FormBuilder);
  private subscriptions: Subscription[] = [];
  
  // Make Math available in template
  Math = Math;

  societeNom = '';
  
  // Reactive signals
  searchQuery = signal('');
  filterPoste = signal('');
  filterStatut = signal('');
  page = signal(1);
  pageSize = signal(10);

  // Data storage
  private allEmployes: Employe[] = [];
  private currentStats: any = { total: 0, actifs: 0, enConge: 0 };

  // Computed properties
  filteredEmployes = computed(() => {
    return this.allEmployes;
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
    return this.currentStats;
  });

  // Form groups
  employeForm!: FormGroup;
  editForm!: FormGroup;
  showAddDialog = signal(false);
  showEditDialog = signal(false);
  selectedEmploye = signal<Employe | null>(null);

  societes$ = this.employesService.getSocietes();

  ngOnInit() {
    this.societeNom = 'Votre société';
    
    // Subscribe to employes data
    this.subscriptions.push(
      this.employesService.employes$.subscribe(employes => {
        this.allEmployes = employes;
      })
    );

    // Subscribe to stats data
    this.subscriptions.push(
      this.employesService.stats$.subscribe(stats => {
        this.currentStats = stats;
      })
    );
    
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

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadEmployes() {
    this.employesService.getEmployes({
      recherche: this.searchQuery(),
      typeUtilisateurId: this.filterPoste(),
      statut: this.filterStatut(),
      societeId: ''
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
    this.showEditDialog.set(false);
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

  onEditSubmit() {
    this.updateEmploye();
  }

  editEmploye(employe: Employe) {
    this.openEditDialog(employe);
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
