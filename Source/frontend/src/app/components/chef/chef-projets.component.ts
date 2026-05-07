import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjetsService } from '../service/projets.service';
import { Projet, FiltreProjet } from '../model/projets.model';

@Component({
  selector: 'app-chef-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chef-projets.component.html',
  styleUrls: ['./chef-projets.component.scss']
})
export class ChefProjetsComponent implements OnInit {
  private projetsService = inject(ProjetsService);
  private fb = inject(FormBuilder);

  // Reactive signals
  searchQuery = signal('');
  filterStatut = signal('');
  filterClient = signal('');
  selectedProjet = signal<Projet | null>(null);
  showDetailsModal = signal(false);

  // Computed properties
  mesProjets = computed(() => {
    const currentUser = this.getCurrentUser();
    return this.projetsService.projets$().value?.filter(p => 
      p.chefProjetId === currentUser?.id
    ) || [];
  });

  filteredProjets = computed(() => {
    let filtered = this.mesProjets();

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

  stats = computed(() => {
    const projets = this.mesProjets();
    return {
      total: projets.length,
      enCours: projets.filter(p => p.statut === 'en_cours').length,
      termines: projets.filter(p => p.statut === 'termine').length,
      enRetard: projets.filter(p => {
        if (p.statut === 'termine') return false;
        const dateFin = new Date(p.dateFin);
        return dateFin < new Date();
      }).length
    };
  });

  // Form groups
  updateForm!: FormGroup;

  ngOnInit() {
    this.updateForm = this.fb.group({
      statut: ['', Validators.required],
      progression: [0, [Validators.min(0), Validators.max(100)]],
      notes: ['']
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
    // Le filtrage est automatique grâce aux computed properties
  }

  openDetails(projet: Projet) {
    this.selectedProjet.set(projet);
    this.updateForm.patchValue({
      statut: projet.statut,
      progression: projet.progression || 0,
      notes: projet.notes || ''
    });
    this.showDetailsModal.set(true);
  }

  closeDetails() {
    this.showDetailsModal.set(false);
    this.selectedProjet.set(null);
  }

  updateProjet() {
    if (this.updateForm.valid && this.selectedProjet()) {
      const formData = this.updateForm.value;
      this.projetsService.updateProjet(this.selectedProjet()!.id, formData).subscribe({
        next: () => {
          this.closeDetails();
        }
      });
    }
  }

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

  getProgressionClass(progression: number): string {
    if (progression >= 80) return 'progress-success';
    if (progression >= 50) return 'progress-warning';
    if (progression >= 20) return 'progress-info';
    return 'progress-danger';
  }

  isEnRetard(dateFin: string): boolean {
    return new Date(dateFin) < new Date();
  }

  getJoursRestants(dateFin: string): number {
    const fin = new Date(dateFin);
    const aujourd = new Date();
    const diff = fin.getTime() - aujourd.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Helper methods
  private getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
}
