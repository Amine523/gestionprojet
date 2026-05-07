import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjetsService } from '../service/projets.service';
import { Projet, ProjetFormData, FiltreProjet } from '../model/projets.model';

@Component({
  selector: 'app-admin-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './admin-projets.component.html',
  styleUrls: ['./admin-projets.component.scss']
})
export class AdminProjetsComponent implements OnInit {
  private projetsService = inject(ProjetsService);
  private fb = inject(FormBuilder);

  // Reactive signals
  searchQuery = signal('');
  filterStatut = signal('');
  filterClient = signal('');
  page = signal(1);
  pageSize = signal(10);

  // Computed properties
  filteredProjets = computed(() => {
    const projets = this.projetsService.projets$().value || [];
    let filtered = projets;

    if (this.searchQuery()) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchQuery().toLowerCase())
      );
    }

    if (this.filterStatut()) {
      filtered = filtered.filter(p => p.statut === this.filterStatut());
    }

    if (this.filterClient()) {
      filtered = filtered.filter(p => p.clientId === this.filterClient());
    }

    return filtered;
  });

  paginatedProjets = computed(() => {
    const filtered = this.filteredProjets();
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProjets().length / this.pageSize());
  });

  totalPagesArray = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  });

  stats = computed(() => {
    return this.projetsService.stats().value;
  });

  // Form groups
  projetForm!: FormGroup;
  editForm!: FormGroup;
  showAddDialog = signal(false);
  showEditDialog = signal<Projet | null>(null);
  selectedProjet = signal<Projet | null>(null);

  clients$ = this.projetsService.getClients();
  employes$ = this.projetsService.getEmployes();

  ngOnInit() {
    this.projetForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      clientId: ['', Validators.required],
      chefProjetId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      budget: [null, Validators.min(0)],
      statut: ['en_cours', Validators.required]
    });

    this.editForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      clientId: ['', Validators.required],
      chefProjetId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      budget: [null, Validators.min(0)],
      statut: ['en_cours', Validators.required]
    });

    this.loadProjets();
  }

  loadProjets() {
    this.projetsService.getProjets({
      recherche: this.searchQuery(),
      statut: this.filterStatut(),
      clientId: this.filterClient()
    });
  }

  filterProjets() {
    this.page.set(1);
  }

  openAddDialog() {
    this.projetForm.reset();
    this.showAddDialog.set(true);
  }

  closeAddDialog() {
    this.showAddDialog.set(false);
  }

  openEditDialog(projet: Projet) {
    this.selectedProjet.set(projet);
    this.editForm.patchValue({
      nom: projet.nom,
      description: projet.description,
      clientId: projet.clientId,
      chefProjetId: projet.chefProjetId,
      dateDebut: projet.dateDebut,
      dateFin: projet.dateFin,
      budget: projet.budget,
      statut: projet.statut
    });
    this.showEditDialog.set(true);
  }

  closeEditDialog() {
    this.showEditDialog.set(null);
    this.selectedProjet.set(null);
  }

  onSubmit() {
    if (this.showAddDialog()) {
      this.addProjet();
    } else if (this.showEditDialog() && this.selectedProjet()) {
      this.updateProjet();
    }
  }

  addProjet() {
    if (this.projetForm.valid) {
      const formData: ProjetFormData = this.projetForm.value;
      this.projetsService.createProjet(formData).subscribe({
        next: () => {
          this.closeAddDialog();
        }
      });
    }
  }

  updateProjet() {
    if (this.editForm.valid && this.selectedProjet()) {
      const formData: Partial<ProjetFormData> = this.editForm.value;
      this.projetsService.updateProjet(this.selectedProjet()!.id, formData).subscribe({
        next: () => {
          this.closeEditDialog();
        }
      });
    }
  }

  deleteProjet(projet: Projet) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projet.nom}"?`)) {
      this.projetsService.deleteProjet(projet.id).subscribe();
    }
  }

  // Helper methods
  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'en_cours': 'En Cours',
      'termine': 'Terminé',
      'en_pause': 'En Pause',
      'annule': 'Annulé'
    };
    return labels[statut] || statut;
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'en_cours': 'badge-warning',
      'termine': 'badge-success',
      'en_pause': 'badge-info',
      'annule': 'badge-danger'
    };
    return classes[statut] || 'badge-secondary';
  }

  // Form validation helpers
  get formErrors() {
    const form = this.showAddDialog() ? this.projetForm : this.editForm;
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
