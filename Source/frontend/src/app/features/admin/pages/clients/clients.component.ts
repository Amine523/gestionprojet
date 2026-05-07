import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployesService } from '../employes/service/employes.service';
import { Employe, FiltreEmploye, EmployeFormData } from '../employes/model/employes.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  private employesService = inject(EmployesService);
  private fb = inject(FormBuilder);
  Math = Math;
  societeNom = '';
  
  searchQuery = '';
  page = signal(1);
  pageSize = signal(10);

  allClients = toSignal(this.employesService.clients$, { initialValue: [] as Employe[] });
  currentStats = toSignal(this.employesService.stats$, { initialValue: { total: 0, actifs: 0 } as any });

  filteredClients = computed(() => {
    return this.allClients();
  });

  paginatedClients = computed(() => {
    const filtered = this.filteredClients();
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredClients().length / this.pageSize());
  });

  totalPagesArray = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  });

  stats = computed(() => {
    return this.currentStats();
  });

  clientForm!: FormGroup;
  editForm!: FormGroup;
  showAddDialog = signal(false);
  showEditDialog = signal(false);
  selectedClient = signal<Employe | null>(null);

  societes$ = this.employesService.getSocietes();

  ngOnInit() {
    this.societeNom = 'Gestion des Clients Externes';
    
    const clientFields = {
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      typeUtilisateurId: ['T008', Validators.required], // Force Client role
      societeId: ['', Validators.required],
      adresse: ['']
    };

    this.clientForm = this.fb.group(clientFields);
    this.editForm = this.fb.group(clientFields);

    this.loadClients();
  }

  loadClients() {
    this.employesService.getClients({
      recherche: this.searchQuery,
      societeId: ''
    }).subscribe();
  }

  filterClients() {
    this.page.set(1);
    this.loadClients();
  }

  openAddDialog() {
    this.clientForm.reset({ typeUtilisateurId: 'T008' });
    this.showAddDialog.set(true);
  }

  closeAddDialog() {
    this.showAddDialog.set(false);
  }

  openEditDialog(client: Employe) {
    this.selectedClient.set(client);
    this.editForm.patchValue({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      typeUtilisateurId: client.typeUtilisateurId,
      societeId: client.societeId,
      adresse: client.adresse
    });
    this.showEditDialog.set(true);
  }

  closeEditDialog() {
    this.showEditDialog.set(false);
    this.selectedClient.set(null);
  }

  onSubmit() {
    if (this.showAddDialog()) {
      this.addClient();
    } else if (this.showEditDialog() && this.selectedClient()) {
      this.updateClient();
    }
  }

  addClient() {
    if (this.clientForm.valid) {
      const formData: EmployeFormData = this.clientForm.value;
      this.employesService.createEmploye(formData).subscribe({
        next: () => {
          this.closeAddDialog();
          this.loadClients();
        }
      });
    }
  }

  updateClient() {
    if (this.editForm.valid && this.selectedClient()) {
      const formData: Partial<EmployeFormData> = this.editForm.value;
      this.employesService.updateEmploye(this.selectedClient()!.id, formData).subscribe({
        next: () => {
          this.closeEditDialog();
          this.loadClients();
        }
      });
    }
  }

  deleteClient(client: Employe) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom}?`)) {
      this.employesService.deleteEmploye(client.id).subscribe({
        next: () => this.loadClients()
      });
    }
  }

  toggleStatut(client: Employe) {
    const newStatut = client.statut === 'actif' ? 'inactif' : 'actif';
    this.employesService.updateEmploye(client.id, { statut: newStatut }).subscribe({
      next: () => this.loadClients()
    });
  }

  changePage(newPage: number) {
    this.page.set(newPage);
  }

  nextPage() {
    if (this.page() < this.totalPages()) this.page.set(this.page() + 1);
  }

  prevPage() {
    if (this.page() > 1) this.page.set(this.page() - 1);
  }
}
