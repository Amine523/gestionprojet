import { Component, OnInit, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { FormStateService } from '@core/services/form-state.service';
import { ToastService } from '@core/services/toast.service';
import { ProjetsService } from '../service/projets.service';
import { Projet, FiltreProjet, ProjetFormData } from '../model/projets.model';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent implements OnInit, OnDestroy {
  private projetsService = inject(ProjetsService);
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private formState = inject(FormStateService);
  private toastService = inject(ToastService);
  private subscriptions: Subscription[] = [];
  
  Math = Math;
  societeNom = '';
  
  searchQuery = signal('');
  filterStatut = signal('');
  page = signal(1);
  pageSize = signal(10);

  private allProjets = signal<Projet[]>([]);
  private currentStats = signal<any>({ total: 0, actifs: 0, enConge: 0 });

  clients = signal<any[]>([]);
  employes = signal<any[]>([]);

  filteredProjets = computed(() => {
    const projets = this.allProjets();
    const emps = this.employes();
    return projets.map(p => {
      const chef = emps.find(e => (e.id || e.Id) === p.chef);
      return {
        ...p,
        chefName: chef ? `${chef.prenom} ${chef.nom}` : (p.chef || 'Non assigné')
      };
    });
  });

  paginatedProjets = computed(() => {
    const filtered = this.filteredProjets();
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.filteredProjets().length / this.pageSize()));
  totalPagesArray = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));
  stats = computed(() => this.currentStats());

  get formErrors() { return this.projetForm.controls; }
  get editErrors() { return this.editForm.controls; }

  projetForm!: FormGroup;
  editForm!: FormGroup;
  showAddDialog = signal(false);
  showEditDialog = signal(false);
  selectedProjet = signal<Projet | null>(null);

  private readonly DRAFT_KEY = 'admin_projet_draft';

  ngOnInit() {
    const user = this.apiService.getCurrentUser();
    const rawNom = user?.societeNom || user?.SocieteNom || user?.societe?.nom || '';
    this.societeNom = (rawNom && rawNom !== 'undefined' && rawNom !== 'null') ? rawNom : 'Votre société';
    
    this.subscriptions.push(this.projetsService.projets$.subscribe(projets => this.allProjets.set(projets)));
    this.subscriptions.push(this.projetsService.stats$.subscribe(stats => this.currentStats.set(stats)));
    
    this.initForms();
    this.loadProjets();
    this.loadLists();
    this.restoreDraft();
  }

  private initForms() {
    this.projetForm = this.fb.group({
      nom: ['', Validators.required],
      nomClient: ['', Validators.required],
      description: [''],
      chef: ['', Validators.required],
      status: ['En cours', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });

    this.editForm = this.fb.group({
      nom: ['', Validators.required],
      nomClient: ['', Validators.required],
      description: [''],
      chef: ['', Validators.required],
      status: ['En cours', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });

    // Save draft on change
    this.subscriptions.push(
      this.projetForm.valueChanges.pipe(debounceTime(500)).subscribe(val => {
        this.formState.saveDraft(this.DRAFT_KEY, val);
      })
    );
  }

  restoreDraft() {
    const state = this.formState.getDraft('admin_projet_state');
    if (state) {
      if (state.searchQuery) this.searchQuery.set(state.searchQuery);
      if (state.filterStatut) this.filterStatut.set(state.filterStatut);
      if (state.page) this.page.set(state.page);
    }

    const draft = this.formState.getDraft(this.DRAFT_KEY);
    if (draft) {
      this.projetForm.patchValue(draft, { emitEvent: false });
    }
  }

  loadLists() {
    const user = this.apiService.getCurrentUser();
    const societeId = user?.societeId || '';

    this.subscriptions.push(
      this.apiService.getUtilisateurs().subscribe(users => {
        const list = (users || []).filter(u => 
          (u.typeUtilisateurId === 'T008' || u.TypeUtilisateurId === 'T008') && u.nom && u.nom !== 'undefined'
        );
        this.clients.set(list);
      })
    );

    if (societeId) {
      this.subscriptions.push(
        this.apiService.getEmployesBySociete(societeId).subscribe(users => {
          const list = (users || []).filter(u => u.nom && u.nom !== 'undefined');
          this.employes.set(list);
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProjets() {
    this.subscriptions.push(
      this.projetsService.getProjets({
        recherche: this.searchQuery(),
        statut: this.filterStatut()
      }).subscribe()
    );
  }

  applyFilter() {
    this.page.set(1);
    this.loadProjets();
    this.saveGeneralState();
  }

  private saveGeneralState() {
    this.formState.saveDraft('admin_projet_state', {
      searchQuery: this.searchQuery(),
      filterStatut: this.filterStatut(),
      page: this.page()
    });
  }

  openAddDialog() {
    this.projetForm.reset({ status: 'En cours' });
    this.restoreDraft();
    this.showAddDialog.set(true);
  }

  closeAddDialog() {
    this.showAddDialog.set(false);
  }

  openEditDialog(projet: Projet) {
    this.selectedProjet.set(projet);
    this.editForm.patchValue({
      nom: projet.nom,
      nomClient: projet.nomClient,
      description: projet.description,
      chef: projet.chef,
      status: projet.status,
      startDate: projet.startDate,
      endDate: projet.endDate
    }, { emitEvent: false });
    this.showEditDialog.set(true);
  }

  closeEditDialog() {
    this.showEditDialog.set(false);
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
          this.formState.clearDraft(this.DRAFT_KEY);
          this.closeAddDialog();
          this.toastService.success('Création effectuée avec succès');
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
          this.toastService.info('Modification enregistrée avec succès');
        }
      });
    }
  }

  editProjet(projet: Projet) {
    this.openEditDialog(projet);
  }

  deleteProjet(projet: Projet) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le projet ${projet.nom}?`)) {
      this.projetsService.deleteProjet(projet.id).subscribe({
        next: () => this.toastService.error('Élément supprimé avec succès')
      });
    }
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'En cours': 'badge-success',
      'Terminé': 'badge-info',
      'En attente': 'badge-warning'
    };
    return statusClasses[status] || 'badge-secondary';
  }

  changePage(newPage: number) { 
    this.page.set(newPage); 
    this.saveGeneralState();
    this.loadProjets();
  }
  nextPage() { if (this.page() < this.totalPages()) this.changePage(this.page() + 1); }
  prevPage() { if (this.page() > 1) this.changePage(this.page() - 1); }

  exportExcel() {
    this.toastService.info('Export Excel démarré...');
  }

  exportPdf() {
    this.toastService.info('Génération du PDF...');
  }

  generateReport(p: Projet) {
    this.toastService.success(`Analyse stratégique du projet ${p.nom} en cours...`);
  }
}
