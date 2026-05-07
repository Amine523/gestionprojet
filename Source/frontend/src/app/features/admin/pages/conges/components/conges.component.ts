import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ValidationErrorComponent } from '@shared/components';
import { CongesService } from '../service/conges.service';
import { Conge, FiltreConge, CongeFormData } from '../model/conges.model';

@Component({
  selector: 'app-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatSnackBarModule, ValidationErrorComponent],
  templateUrl: './conges.component.html',
  styleUrls: ['./conges.component.scss']
})
export class CongesComponent implements OnInit {
  private congesService = inject(CongesService);
  private fb = inject(FormBuilder);

  societeNom = '';
  isRh = false;
  
  // Reactive signals
  activeTab = signal('all');
  searchQuery = signal('');
  filterUtilisateurId = signal('');
  filterTypeConge = signal('');
  filterStatut = signal('');
  filterPeriode = signal({ debut: '', fin: '' });

  // Computed properties
  filteredConges = computed(() => {
    return this.congesService.conges$().value?.filter(conge => {
      let matches = true;

      if (this.activeTab() === 'pending') {
        matches = conge.status === 'en_attente';
      } else if (this.activeTab() === 'approved') {
        matches = conge.status === 'valide';
      } else if (this.activeTab() === 'rejected') {
        matches = conge.status === 'refuse';
      } else if (this.activeTab() === 'soldes') {
        matches = conge.status === 'soldes';
      }

      if (this.searchQuery()) {
        const recherche = this.searchQuery().toLowerCase();
        matches = matches && (
          conge.motif.toLowerCase().includes(recherche) ||
          conge.utilisateurNom.toLowerCase().includes(recherche)
        );
      }

      if (this.filterUtilisateurId()) {
        matches = matches && conge.utilisateurId === this.filterUtilisateurId();
      }

      if (this.filterTypeConge()) {
        matches = matches && conge.typeNom === this.filterTypeConge();
      }

      if (this.filterStatut()) {
        matches = matches && conge.status === this.filterStatut();
      }

      if (this.filterPeriode().debut && this.filterPeriode().fin) {
        matches = matches && this.congeDansPeriode(conge, this.filterPeriode());
      }

      return matches;
    }) || [];
  });

  paginatedConges = computed(() => {
    return this.filteredConges();
  });

  stats = computed(() => {
    return this.congesService.stats$().value;
  });

  enAttenteCount = computed(() => {
    return this.filteredConges().filter(c => c.status === 'en_attente').length;
  });

  // Form groups
  congeForm!: FormGroup;
  showAddDialog = signal(false);
  showEditDialog = signal<Conge | null>(null);
  selectedConge = signal<Conge | null>(null);

  ngOnInit() {
    this.societeNom = this.congesService.getCurrentUser()?.societe?.nom || 'Votre société';
    
    // Vérifier si l'utilisateur est RH
    this.isRh = this.congesService.getCurrentUser()?.typeUtilisateurId === 'T003';
    
    this.loadData();
  }

  loadData() {
    this.congesService.getConges();
  }

  activeTabChanged(tab: string) {
    this.activeTab.set(tab);
  }

  filtrerConges() {
    this.congesService.getConges({
      utilisateurId: this.filterUtilisateurId(),
      typeConge: this.filterTypeConge(),
      statut: this.filterStatut(),
      periode: this.filterPeriode(),
      recherche: this.searchQuery()
    });
  }

  openAddDialog() {
    this.congeForm = this.fb.group({
      utilisateurId: ['', Validators.required],
      typeCongeId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      motif: ['', Validators.required],
      justificatif: [null],
      commentaire: ['']
    });
    this.showAddDialog.set(true);
  }

  closeAddDialog() {
    this.showAddDialog.set(false);
  }

  openEditDialog(conge: Conge) {
    this.selectedConge.set(conge);
    this.congeForm = this.fb.group({
      utilisateurId: [conge.utilisateurId, Validators.required],
      typeCongeId: [conge.typeNom, Validators.required],
      dateDebut: [conge.dateDebut, Validators.required],
      dateFin: [conge.dateFin, Validators.required],
      motif: [conge.motif, Validators.required],
      justificatif: [conge.justificatif],
      commentaire: [conge.commentaire || '']
    });
    this.showEditDialog.set(true);
  }

  closeEditDialog() {
    this.showEditDialog.set(null);
    this.selectedConge.set(null);
  }

  onSubmit() {
    if (this.showAddDialog()) {
      this.addConge();
    } else if (this.showEditDialog() && this.selectedConge()) {
      this.updateConge();
    }
  }

  addConge() {
    if (this.congeForm.valid) {
      const formData: CongeFormData = this.congeForm.value;
      this.congesService.createConge(formData).subscribe({
        next: () => {
          this.closeAddDialog();
        }
      });
    }
  }

  updateConge() {
    if (this.congeForm.valid && this.selectedConge()) {
      const formData: Partial<CongeFormData> = this.congeForm.value;
      this.congesService.updateConge(this.selectedConge()!.id, formData).subscribe({
        next: () => {
          this.closeEditDialog();
        }
      });
    }
  }

  validerConge(conge: Conge) {
    this.congesService.validerConge(conge.id, 'Validé par le système');
  }

  refuserConge(conge: Conge) {
    this.congesService.refuserConge(conge.id, 'Refusé par le système');
  }

  exportPdf() {
    const conges = this.filteredConges();
    const data = conges.map(c => ({
      'ID': c.id,
      'Utilisateur': c.utilisateurNom,
      'Type': c.typeNom,
      'Date Début': c.dateDebut,
      'Date Fin': c.dateFin,
      'Jours': c.nombreJours,
      'Motif': c.motif,
      'Statut': c.status
    }));

    // Créer un blob et télécharger
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(worksheet, 'Congés');
    XLSX.writeFile(workbook, 'conges.xlsx');
  }

  // Helper methods
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'en_attente': 'badge-warning',
      'valide': 'badge-success',
      'refuse': 'badge-danger',
      'soldes': 'badge-info'
    };
    return statusClasses[status] || 'badge-secondary';
  }

  // Form validation helpers
  get formErrors() {
    return this.congeForm.controls;
  }
}
