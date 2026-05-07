import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetsService } from '../service/projets.service';
import { AuthService } from '../service/auth.service';
import { Projet } from '../model/projets.model';

interface Ticket {
  id: string;
  titre: string;
  description: string;
  type: 'bug' | 'feature' | 'question';
  priorite: 'basse' | 'moyenne' | 'elevee' | 'critique';
  statut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  projetId: string;
  projetNom: string;
  clientId: string;
  dateCreation: string;
  dateResolution?: string;
  assigneA?: string;
  reponses: TicketReponse[];
}

interface TicketReponse {
  id: string;
  contenu: string;
  auteurId: string;
  auteurNom: string;
  auteurType: 'client' | 'admin' | 'dev';
  dateCreation: string;
}

interface Document {
  id: string;
  nom: string;
  type: 'contrat' | 'facture' | 'rapport' | 'autre';
  projetId?: string;
  projetNom?: string;
  url: string;
  taille: number;
  dateUpload: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  private projetsService = inject(ProjetsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentUser = this.authService.currentUser();
  searchQuery = signal('');
  selectedTab = signal<'overview' | 'projets' | 'tickets' | 'documents'>('overview');

  // Mock data - à remplacer par des vrais appels API
  tickets = signal<Ticket[]>([
    {
      id: '1',
      titre: 'Problème de connexion',
      description: 'Je ne peux pas me connecter à l\'application',
      type: 'bug',
      priorite: 'critique',
      statut: 'en_cours',
      projetId: 'proj1',
      projetNom: 'Application Mobile',
      clientId: 'client1',
      dateCreation: '2024-01-15T10:30:00Z',
      assigneA: 'Dev Team',
      reponses: [
        {
          id: '1',
          contenu: 'Nous travaillons sur le problème. Merci de votre patience.',
          auteurId: 'admin1',
          auteurNom: 'Support Technique',
          auteurType: 'admin',
          dateCreation: '2024-01-15T11:00:00Z'
        }
      ]
    }
  ]);

  documents = signal<Document[]>([
    {
      id: '1',
      nom: 'Contrat de service.pdf',
      type: 'contrat',
      projetId: 'proj1',
      projetNom: 'Application Mobile',
      url: '/documents/contrat.pdf',
      taille: 2048576,
      dateUpload: '2024-01-10T09:00:00Z'
    },
    {
      id: '2',
      nom: 'Facture Q4 2024.pdf',
      type: 'facture',
      projetId: 'proj1',
      projetNom: 'Application Mobile',
      url: '/documents/facture_q4_2024.pdf',
      taille: 1024000,
      dateUpload: '2024-01-05T14:30:00Z'
    }
  ]);

  // Computed properties
  projets = computed(() => {
    const allProjets = this.projetsService.projets$() || [];
    const clientId = this.currentUser()?.id;
    
    return allProjets.filter(projet => projet.clientId === clientId);
  });

  filteredProjets = computed(() => {
    const projets = this.projets();
    if (!this.searchQuery()) return projets;
    
    return projets.filter(projet => 
      projet.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      projet.description.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  filteredTickets = computed(() => {
    const allTickets = this.tickets();
    if (!this.searchQuery()) return allTickets;
    
    return allTickets.filter(ticket => 
      ticket.titre.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      ticket.description.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  filteredDocuments = computed(() => {
    const allDocuments = this.documents();
    if (!this.searchQuery()) return allDocuments;
    
    return allDocuments.filter(doc => 
      doc.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      doc.type.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  stats = computed(() => {
    const projets = this.projets();
    const tickets = this.tickets();
    const documents = this.documents();
    
    return {
      totalProjets: projets.length,
      projetsActifs: projets.filter(p => p.statut === 'en_cours').length,
      projetsTermines: projets.filter(p => p.statut === 'termine').length,
      ticketsOuverts: tickets.filter(t => t.statut === 'ouvert').length,
      ticketsEnCours: tickets.filter(t => t.statut === 'en_cours').length,
      ticketsResolus: tickets.filter(t => t.statut === 'resolu').length,
      totalDocuments: documents.length,
      documentsContrats: documents.filter(d => d.type === 'contrat').length,
      documentsFactures: documents.filter(d => d.type === 'facture').length
    };
  });

  // Form groups
  ticketForm!: FormGroup;
  showTicketModal = signal(false);
  selectedTicket = signal<Ticket | null>(null);

  ngOnInit() {
    this.initializeForms();
    this.loadData();
  }

  initializeForms() {
    this.ticketForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      type: ['question', Validators.required],
      priorite: ['moyenne', Validators.required],
      projetId: ['', Validators.required]
    });
  }

  loadData() {
    this.projetsService.getProjets().subscribe();
  }

  selectTab(tab: any) {
    this.selectedTab.set(tab);
  }

  openTicketModal(ticket?: Ticket) {
    this.selectedTicket.set(ticket || null);
    if (ticket) {
      this.ticketForm.patchValue({
        titre: ticket.titre,
        description: ticket.description,
        type: ticket.type,
        priorite: ticket.priorite,
        projetId: ticket.projetId
      });
    } else {
      this.ticketForm.reset();
    }
    this.showTicketModal.set(true);
  }

  closeTicketModal() {
    this.showTicketModal.set(false);
    this.selectedTicket.set(null);
  }

  submitTicket() {
    if (this.ticketForm.valid) {
      const formData = this.ticketForm.value;
      console.log('Ticket submitted:', formData);
      this.closeTicketModal();
    }
  }

  navigateToProjets() {
    this.router.navigate(['/client/projets']);
  }

  navigateToTickets() {
    this.router.navigate(['/client/tickets']);
  }

  navigateToDocuments() {
    this.router.navigate(['/client/documents']);
  }

  downloadDocument(document: Document) {
    console.log('Downloading document:', document.nom);
    // Logique de téléchargement
  }

  // Helper methods
  getTicketTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'bug': 'Bug',
      'feature': 'Fonctionnalité',
      'question': 'Question'
    };
    return labels[type] || type;
  }

  getTicketTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'bug': 'type-bug',
      'feature': 'type-feature',
      'question': 'type-question'
    };
    return classes[type] || 'type-default';
  }

  getPrioriteLabel(priorite: string): string {
    const labels: { [key: string]: string } = {
      'basse': 'Basse',
      'moyenne': 'Moyenne',
      'elevee': 'Élevée',
      'critique': 'Critique'
    };
    return labels[priorite] || priorite;
  }

  getPrioriteClass(priorite: string): string {
    const classes: { [key: string]: string } = {
      'basse': 'priority-low',
      'moyenne': 'priority-medium',
      'elevee': 'priority-high',
      'critique': 'priority-critical'
    };
    return classes[priorite] || 'priority-medium';
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'ouvert': 'Ouvert',
      'en_cours': 'En Cours',
      'resolu': 'Résolu',
      'ferme': 'Fermé'
    };
    return labels[statut] || statut;
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'ouvert': 'status-open',
      'en_cours': 'status-progress',
      'resolu': 'status-resolved',
      'ferme': 'status-closed'
    };
    return classes[statut] || 'status-default';
  }

  getDocumentTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'contrat': 'Contrat',
      'facture': 'Facture',
      'rapport': 'Rapport',
      'autre': 'Autre'
    };
    return labels[type] || type;
  }

  getDocumentTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'contrat': 'doc-contract',
      'facture': 'doc-invoice',
      'rapport': 'doc-report',
      'autre': 'doc-other'
    };
    return classes[type] || 'doc-default';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getDaysAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine(s)`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  }
}
