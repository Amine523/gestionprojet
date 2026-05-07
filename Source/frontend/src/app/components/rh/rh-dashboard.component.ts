import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployesService } from '../service/employes.service';
import { AuthService } from '../service/auth.service';
import { ProjetsService } from '../service/projets.service';
import { Employe, Projet } from '../model/employes.model';

interface Conge {
  id: string;
  employeId: string;
  employeNom: string;
  type: 'conge_paye' | 'maladie' | 'personnel';
  dateDebut: string;
  dateFin: string;
  duree: number;
  statut: 'en_attente' | 'approuve' | 'refuse';
  motif?: string;
  dateDemande: string;
  approuvePar?: string;
  dateApprobation?: string;
}

interface Recrutement {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  typeUtilisateurId: string;
  experience: string;
  competences: string[];
  statut: 'candidat' | 'entretien' | 'test' | 'offre' | 'accepte' | 'refuse';
  dateCandidature: string;
  cvUrl?: string;
  notes?: string;
}

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './rh-dashboard.component.html',
  styleUrls: ['./rh-dashboard.component.scss']
})
export class RhDashboardComponent implements OnInit {
  private employesService = inject(EmployesService);
  private authService = inject(AuthService);
  private projetsService = inject(ProjetsService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentUser = this.authService.currentUser();
  searchQuery = signal('');
  selectedTab = signal<'overview' | 'employes' | 'recrutement' | 'conges' | 'formations'>('overview');

  // Mock data - à remplacer par des vrais appels API
  conges = signal<Conge[]>([
    {
      id: '1',
      employeId: 'emp1',
      employeNom: 'Jean Dupont',
      type: 'conge_paye',
      dateDebut: '2024-01-20',
      dateFin: '2024-01-25',
      duree: 5,
      statut: 'en_attente',
      dateDemande: '2024-01-15'
    },
    {
      id: '2',
      employeId: 'emp2',
      employeNom: 'Marie Martin',
      type: 'maladie',
      dateDebut: '2024-01-18',
      dateFin: '2024-01-19',
      duree: 2,
      statut: 'approuve',
      dateDemande: '2024-01-17',
      approuvePar: 'RH Manager',
      dateApprobation: '2024-01-17'
    }
  ]);

  recrutements = signal<Recrutement[]>([
    {
      id: '1',
      nom: 'Pierre',
      prenom: 'Durand',
      email: 'pierre.durand@email.com',
      telephone: '0123456789',
      typeUtilisateurId: 'T005',
      experience: '5 ans en développement web',
      competences: ['Angular', 'TypeScript', 'Node.js'],
      statut: 'entretien',
      dateCandidature: '2024-01-10'
    },
    {
      id: '2',
      nom: 'Sophie',
      prenom: 'Bernard',
      email: 'sophie.bernard@email.com',
      typeUtilisateurId: 'T006',
      experience: '3 ans en QA',
      competences: ['Selenium', 'Cypress', 'Jest'],
      statut: 'test',
      dateCandidature: '2024-01-12'
    }
  ]);

  // Computed properties
  employes = computed(() => {
    return this.employesService.employes$() || [];
  });

  projets = computed(() => {
    return this.projetsService.projets$() || [];
  });

  filteredEmployes = computed(() => {
    const allEmployes = this.employes();
    if (!this.searchQuery()) return allEmployes;
    
    return allEmployes.filter(emp => 
      emp.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      emp.prenom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      emp.email.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  filteredConges = computed(() => {
    const allConges = this.conges();
    if (!this.searchQuery()) return allConges;
    
    return allConges.filter(conge => 
      conge.employeNom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      conge.type.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  filteredRecrutements = computed(() => {
    const allRecrutements = this.recrutements();
    if (!this.searchQuery()) return allRecrutements;
    
    return allRecrutements.filter(rec => 
      rec.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      rec.prenom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      rec.email.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  stats = computed(() => {
    const allEmployes = this.employes();
    const allConges = this.conges();
    const allRecrutements = this.recrutements();
    
    return {
      totalEmployes: allEmployes.length,
      employesActifs: allEmployes.filter(e => e.statut === 'actif').length,
      demandesConges: allConges.filter(c => c.statut === 'en_attente').length,
      congesApprouves: allConges.filter(c => c.statut === 'approuve').length,
      candidaturesEnCours: allRecrutements.filter(r => 
        ['candidat', 'entretien', 'test'].includes(r.statut)
      ).length,
      nouvellesCandidatures: allRecrutements.filter(r => {
        const date = new Date(r.dateCandidature);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return date > thirtyDaysAgo;
      }).length
    };
  });

  // Form groups
  congeForm!: FormGroup;
  recrutementForm!: FormGroup;
  showCongeModal = signal(false);
  showRecrutementModal = signal(false);
  selectedConge = signal<Conge | null>(null);
  selectedRecrutement = signal<Recrutement | null>(null);

  ngOnInit() {
    this.initializeForms();
    this.loadData();
  }

  initializeForms() {
    this.congeForm = this.fb.group({
      employeId: ['', Validators.required],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      motif: ['']
    });

    this.recrutementForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      typeUtilisateurId: ['', Validators.required],
      experience: ['', Validators.required],
      competences: [[], Validators.required],
      statut: ['candidat', Validators.required],
      notes: ['']
    });
  }

  loadData() {
    this.employesService.getEmployes().subscribe();
    this.projetsService.getProjets().subscribe();
  }

  selectTab(tab: any) {
    this.selectedTab.set(tab);
  }

  openCongeModal(conge?: Conge) {
    this.selectedConge.set(conge || null);
    if (conge) {
      this.congeForm.patchValue({
        employeId: conge.employeId,
        type: conge.type,
        dateDebut: conge.dateDebut,
        dateFin: conge.dateFin,
        motif: conge.motif
      });
    } else {
      this.congeForm.reset();
    }
    this.showCongeModal.set(true);
  }

  closeCongeModal() {
    this.showCongeModal.set(false);
    this.selectedConge.set(null);
  }

  openRecrutementModal(recrutement?: Recrutement) {
    this.selectedRecrutement.set(recrutement || null);
    if (recrutement) {
      this.recrutementForm.patchValue({
        nom: recrutement.nom,
        prenom: recrutement.prenom,
        email: recrutement.email,
        telephone: recrutement.telephone,
        typeUtilisateurId: recrutement.typeUtilisateurId,
        experience: recrutement.experience,
        competences: recrutement.competences,
        statut: recrutement.statut,
        notes: recrutement.notes
      });
    } else {
      this.recrutementForm.reset();
    }
    this.showRecrutementModal.set(true);
  }

  closeRecrutementModal() {
    this.showRecrutementModal.set(false);
    this.selectedRecrutement.set(null);
  }

  submitConge() {
    if (this.congeForm.valid) {
      const formData = this.congeForm.value;
      console.log('Conge submitted:', formData);
      this.closeCongeModal();
    }
  }

  submitRecrutement() {
    if (this.recrutementForm.valid) {
      const formData = this.recrutementForm.value;
      console.log('Recrutement submitted:', formData);
      this.closeRecrutementModal();
    }
  }

  approuverConge(conge: Conge) {
    conge.statut = 'approuve';
    conge.approuvePar = this.currentUser()?.nom + ' ' + this.currentUser()?.prenom;
    conge.dateApprobation = new Date().toISOString();
    
    // Mettre à jour la liste
    const currentConges = this.conges();
    const updatedConges = currentConges.map(c => 
      c.id === conge.id ? conge : c
    );
    this.conges.set(updatedConges);
  }

  refuserConge(conge: Conge) {
    conge.statut = 'refuse';
    
    // Mettre à jour la liste
    const currentConges = this.conges();
    const updatedConges = currentConges.map(c => 
      c.id === conge.id ? conge : c
    );
    this.conges.set(updatedConges);
  }

  updateRecrutementStatut(recrutement: Recrutement, nouveauStatut: string) {
    recrutement.statut = nouveauStatut as any;
    
    // Mettre à jour la liste
    const currentRecrutements = this.recrutements();
    const updatedRecrutements = currentRecrutements.map(r => 
      r.id === recrutement.id ? recrutement : r
    );
    this.recrutements.set(updatedRecrutements);
  }

  navigateToEmployes() {
    this.router.navigate(['/rh/employes']);
  }

  navigateToRecrutement() {
    this.router.navigate(['/rh/recrutement']);
  }

  navigateToConges() {
    this.router.navigate(['/rh/conges']);
  }

  navigateToFormations() {
    this.router.navigate(['/rh/formations']);
  }

  navigateToPerformance() {
    this.router.navigate(['/rh/performance']);
  }

  // Helper methods
  getCongeTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'conge_paye': 'Congé Payé',
      'maladie': 'Maladie',
      'personnel': 'Personnel'
    };
    return labels[type] || type;
  }

  getCongeStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'en_attente': 'En Attente',
      'approuve': 'Approuvé',
      'refuse': 'Refusé'
    };
    return labels[statut] || statut;
  }

  getCongeStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'en_attente': 'status-pending',
      'approuve': 'status-approved',
      'refuse': 'status-rejected'
    };
    return classes[statut] || 'status-default';
  }

  getRecrutementStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'candidat': 'Candidat',
      'entretien': 'Entretien',
      'test': 'Test Technique',
      'offre': 'Offre Envoyée',
      'accepte': 'Accepté',
      'refuse': 'Refusé'
    };
    return labels[statut] || statut;
  }

  getRecrutementStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'candidat': 'status-candidate',
      'entretien': 'status-interview',
      'test': 'status-test',
      'offre': 'status-offer',
      'accepte': 'status-accepted',
      'refuse': 'status-rejected'
    };
    return classes[statut] || 'status-default';
  }

  getTypeUtilisateurLabel(typeId: string): string {
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  calculateDuree(dateDebut: string, dateFin: string): number {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diff = fin.getTime() - debut.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
