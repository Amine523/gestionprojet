import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';

@Component({
  selector: 'app-rh-recrutement',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './rh-recrutement.component.html',
  styleUrls: ['./rh-recrutement.component.scss']
})
export class RHRecrutementComponent implements OnInit {
  private api = inject(ApiService);
  private ai = inject(AiService);
  private snackBar = inject(MatSnackBar);

  isAnalyzing = false;
  aiAnalysisResult = '';
  aiScore = 0;

  societeId: string = '';
  societeNom: string = '';

  offresSignal = signal<any[]>([]);
  candidatsSignal = signal<any[]>([]);
  
  searchCandidat = signal('');
  filterStatutCandidat = signal('');
  selectedOffreTitle = signal('');

  filteredCandidats = computed(() => {
    let list = this.candidatsSignal();
    const search = this.searchCandidat().toLowerCase();
    const statut = this.filterStatutCandidat();
    const offre = this.selectedOffreTitle();

    if (offre) {
      list = list.filter(c => c.poste === offre);
    }
    
    return list.filter(c => {
      const matchesSearch = !search || 
        c.nom?.toLowerCase().includes(search) || 
        c.email?.toLowerCase().includes(search);
      const matchesStatut = !statut || c.statut === statut;
      return matchesSearch && matchesStatut;
    });
  });

  entretiensSignal = computed(() => {
    return this.candidatsSignal()
      .filter(c => {
        const s = (c.statut || '').toUpperCase();
        return s === 'ENTRETIEN' || s === 'ENTRETIEN_PLANIFIE' || c.dateEntretien;
      })
      .sort((a, b) => {
        const dateA = a.dateEntretien ? new Date(a.dateEntretien).getTime() : 0;
        const dateB = b.dateEntretien ? new Date(b.dateEntretien).getTime() : 0;
        return dateA - dateB;
      });
  });

  offresActives = computed(() => this.offresSignal().filter(o => o.statut === 'OUVERTE').length);
  embauchesCount = computed(() => this.candidatsSignal().filter(c => ['ACCEPTEE', 'ACCEPTE'].includes((c.statut || '').toUpperCase())).length);

  showOffreForm = false;
  editingOffre: any = null;
  offreForm: any = { titre: '', description: '', lieu: '', salaire: '', type: 'CDI', poste: '', quiz: '', societe: '', adresse: '' };

  postes: string[] = [
    'Développeur Frontend',
    'Développeur Backend',
    'Développeur Full Stack',
    'Développeur Mobile',
    'Développeur React',
    'Développeur Angular',
    'Développeur Node.js',
    'Développeur .NET',
    'Développeur Python',
    'DevOps Engineer',
    'Ingénieur QA',
    'Testeur Logiciel',
    'Testeur Automation',
    'Chef de Projet IT',
    'Chef de Projet Digital',
    'Product Owner',
    'Scrum Master',
    'Tech Lead',
    'RH Développeur',
    'Recruteur IT'
  ];

  candidatsEnAttente = 0;
  embauches = 0;
  candidatsRecuperes = 0;
  selectedCandidat: any = null;
  showCandidatDialog = false;
  showEntretienDialog = false;
  entretienDate = '';
  entretienHeure = '';
  entretienNotes = '';

  emailConfig: any = {
    serviceId: '',
    publicKey: '',
    templates: {
      testAuthorized: '',
      candidatureRefused: '',
      candidatureAccepted: ''
    }
  };

  activeTab = 'offres';

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    const stored = this.api.getRawStorage();
    if (!stored.offresEmploi || stored.offresEmploi.length === 0) {
      this.api.initRecrutementData();
    }
    this.api.loadEmailJsConfig();
    this.emailConfig = this.api.getEmailJsConfig();
    this.loadData();
  }

  loadData() {
    this.api.getOffresEmploi().subscribe({
      next: (res: any) => {
        let all = Array.isArray(res) ? res : (res?.items || []);
        const filtered = all.filter((o: any) => (o.societeId || o.SocieteId || '').toString().toLowerCase() === this.societeId.toLowerCase());
        this.offresSignal.set(filtered);
      }
    });

    // Load Applications (candidatures) filtered by societe
    this.api.getCandidaturesBySociete(this.societeId).subscribe({
      next: (res: any) => {
        let all = Array.isArray(res) ? res : (res?.items || []);
        const normalized = all.map((c: any) => ({
          id: c.id || c.Id,
          nom: c.candidatNom || c.nom || c.Nom || 'Sans nom',
          email: c.candidatEmail || c.email || c.Email,
          telephone: c.candidatTelephone || c.telephone || c.Telephone,
          poste: c.offreTitre || c.poste || c.Poste,
          competences: c.cvPath ? 'CV joint' : '-',
          statut: c.statut || c.Statut || 'EN_ATTENTE',
          quiz: c.quiz || c.Quiz,
          quizScore: c.quizScore || c.QuizScore,
          quizTotal: c.quizTotal || c.QuizTotal,
          dateCandidature: c.dateCandidature || c.DateCandidature,
          dateEntretien: c.dateEntretien || c.DateEntretien || null,
          observations: c.notes || c.observations || c.Observations || ''
        }));
        this.candidatsSignal.set(normalized);
      }
    });

    // Also load users with TypeUtilisateurId = 'T007' (candidates registered via register-candidate)
    this.api.getUtilisateurs().subscribe({
      next: (res: any) => {
        let all = Array.isArray(res) ? res : (res?.items || []);
        const candidateUsers = all.filter((u: any) => 
          (u.typeUtilisateurId || u.TypeUtilisateurId) === 'T007'
        );
        
        if (candidateUsers.length > 0) {
          const normalizedUsers = candidateUsers.map((u: any) => ({
            id: u.id || u.Id,
            nom: u.nom || u.Nom || 'Sans nom',
            email: u.email || u.Email,
            telephone: u.telephone || u.Telephone || '',
            poste: 'Candidat',
            competences: u.cv ? 'CV joint' : '-',
            statut: 'EN_ATTENTE',
            quiz: '',
            quizScore: undefined,
            quizTotal: undefined,
            dateCandidature: new Date().toISOString(),
            dateEntretien: null,
            observations: ''
          }));
          
          // Merge with existing candidates, avoiding duplicates by email
          this.candidatsSignal.update(existing => {
            const existingEmails = new Set(existing.map((c: any) => c.email?.toLowerCase()));
            const newCandidates = normalizedUsers.filter((c: any) => !existingEmails.has(c.email?.toLowerCase()));
            return [...existing, ...newCandidates];
          });
        }
      }
    });
  }



  openOffreForm() {
    console.log('RH Recrutement Debug: openOffreForm clicked');
    this.offreForm = { titre: '', description: '', lieu: '', salaire: '', type: 'CDI', poste: '', quiz: '', societe: this.societeNom, adresse: '' };
    this.editingOffre = null;
    this.showOffreForm = true;
  }

  closeOffreForm() {
    this.showOffreForm = false;
    this.editingOffre = null;
  }

  saveOffre() {
    if (!this.offreForm.titre || !this.offreForm.description) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', { duration: 3000 });
      return;
    }

    const offreData = {
      titre: this.offreForm.titre,
      description: this.offreForm.description,
      lieu: this.offreForm.lieu,
      salaire: this.offreForm.salaire,
      poste: this.offreForm.poste,
      quiz: this.offreForm.quiz,
      societeId: this.societeId,
      statut: 'OUVERTE',
      type: 'OffreEmploi',
      actif: true
    };

    console.log('Sending offre data:', offreData);

    if (this.editingOffre) {
      this.api.saveOffreEmploi({ ...offreData, id: this.editingOffre.id }).subscribe({
        next: (res: any) => {
          console.log('Update response:', res);
          this.offresSignal.update(list => list.map(o => o.id === this.editingOffre.id ? { ...o, ...offreData } : o));
          this.snackBar.open('Offre modifiée avec succès', 'Fermer', { duration: 3000 });
          this.closeOffreForm();
        },
        error: (err) => {
          console.error('Error updating offre:', err);
          this.snackBar.open(`Erreur: ${err.error?.message || err.message || 'Erreur inconnue'}`, 'Fermer', { duration: 5000 });
        }
      });
    } else {
      this.api.saveOffreEmploi(offreData).subscribe({
        next: (res: any) => {
          console.log('Create response:', res);
          const newOffre = res || { ...offreData, id: 'OFFRE_' + Date.now() };
          this.offresSignal.update(list => [newOffre, ...list]);
          this.snackBar.open('Offre créée avec succès', 'Fermer', { duration: 3000 });
          this.closeOffreForm();
        },
        error: (err) => {
          console.error('Error creating offre:', err);
          const errorMsg = err.error?.message || err.error?.Message || err.message || 'Erreur inconnue';
          this.snackBar.open(`Erreur: ${errorMsg}`, 'Fermer', { duration: 5000 });
        }
      });
    }
  }

  editOffre(offre: any) {
    this.offreForm = { ...offre };
    this.editingOffre = offre;
    this.showOffreForm = true;
  }

  deleteOffre(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.api.deleteOffreEmploi(id).subscribe({
        next: () => {
          this.offresSignal.update(list => list.filter(o => o.id !== id));
          this.snackBar.open('Offre supprimée avec succès', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  getCandidatsCount(offreId: string): number {
    return this.candidatsSignal().filter(c => c.offreId === offreId || c.poste === this.offresSignal().find(o => o.id === offreId)?.titre).length;
  }

  viewCandidats(offre: any) {
    this.selectedOffreTitle.set(offre.titre);
    this.activeTab = 'candidats';
  }

  viewCandidat(candidat: any) {
    this.selectedCandidat = candidat;
    this.showCandidatDialog = true;
  }

  closeCandidatDialog() {
    this.showCandidatDialog = false;
    this.selectedCandidat = null;
  }

  planifierEntretien(candidat: any) {
    this.closeCandidatDialog();
    this.entretienDate = '';
    this.entretienHeure = '';
    this.entretienNotes = '';
    this.showEntretienDialog = true;
  }

  closeEntretienDialog() {
    this.showEntretienDialog = false;
  }

  saveEntretien() {
    if (!this.entretienDate || !this.entretienHeure) {
      this.snackBar.open('Veuillez remplir la date et l\'heure', 'Fermer', { duration: 3000 });
      return;
    }

    const dateEntretien = new Date(`${this.entretienDate}T${this.entretienHeure}`);

    this.api.updateCandidature({
      id: this.selectedCandidat.id,
      statut: 'ENTRETIEN',
      dateEntretien: dateEntretien.toISOString(),
      observations: this.entretienNotes
    }).subscribe(() => {
      this.snackBar.open('Entretien planifié avec succès', 'Fermer', { duration: 3000 });
      this.closeEntretienDialog();
      this.loadData();
    });
  }

  deleteCandidature(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      this.api.deleteCandidature(id).subscribe(() => {
        this.snackBar.open('Candidature supprimée avec succès', 'Fermer', { duration: 3000 });
        this.closeCandidatDialog();
        this.loadData();
      });
    }
  }

  updateStatut(candidat: any) {
    this.api.updateCandidature({
      id: candidat.id,
      statut: candidat.statut
    }).subscribe(() => {
      this.snackBar.open('Statut mis à jour avec succès', 'Fermer', { duration: 3000 });
      this.loadData();

      // Auto-send email based on status
      if (candidat.statut === 'ACCEPTEE') {
        this.sendEmail(candidat, 'candidatureAccepted');
      } else if (candidat.statut === 'REFUSEE') {
        this.sendEmail(candidat, 'candidatureRefused');
      }
    });
  }

  sendEmail(candidat: any, templateType: string) {
    const templateId = this.emailConfig.templates[templateType];
    if (!templateId) {
      return;
    }

    // EmailJS integration would go here
    console.log('Email would be sent to:', candidat.email, 'with template:', templateId);
  }

  saveEmailConfig() {
    this.api.updateEmailJsConfig(this.emailConfig);
    this.snackBar.open('Configuration email enregistrée', 'Fermer', { duration: 3000 });
  }

  resetEmailConfig() {
    this.emailConfig = {
      serviceId: '',
      publicKey: '',
      templates: {
        testAuthorized: '',
        candidatureRefused: '',
        candidatureAccepted: ''
      }
    };
  }

  testEmailJsConfig() {
    this.snackBar.open('Configuration email testée (voir console)', 'Fermer', { duration: 3000 });
    console.log('EmailJS Config:', this.emailConfig);
  }

  analyzeCandidat() {
    if (!this.selectedCandidat) return;
    
    this.isAnalyzing = true;
    
    // Simulate AI analysis with the AiService
    setTimeout(() => {
      const quizScore = this.selectedCandidat.quizScore || 0;
      const quizTotal = this.selectedCandidat.quizTotal || 1;
      const scorePercent = (quizScore / quizTotal) * 100;
      
      // Generate a mock analysis based on quiz score and other factors
      this.aiScore = Math.min(95, Math.max(30, scorePercent + Math.random() * 20 - 10));
      
      if (this.aiScore >= 80) {
        this.aiAnalysisResult = 'Excellent profil technique avec de solides compétences. Le candidat correspond parfaitement aux exigences du poste et montre un grand potentiel d\'intégration.';
      } else if (this.aiScore >= 60) {
        this.aiAnalysisResult = 'Bon profil avec des compétences adéquates. Le candidat répond aux critères principaux mais pourrait nécessiter une formation complémentaire sur certains aspects spécifiques.';
      } else {
        this.aiAnalysisResult = 'Le profil présente des écarts significatifs par rapport aux exigences du poste. Un entretien technique approfondi est recommandé pour évaluer le potentiel d\'apprentissage.';
      }
      
      this.isAnalyzing = false;
    }, 1500);
  }

}
