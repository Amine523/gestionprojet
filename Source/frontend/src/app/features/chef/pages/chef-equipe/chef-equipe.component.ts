import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-equipe',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './chef-equipe.component.html',
  styleUrls: ['./chef-equipe.component.scss']
})
export class ChefEquipeComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = 'Votre société';
  
  membres: any[] = [];
  projets: any[] = [];

  filteredMembres: any[] = [];
  displayedColumns = ['nom', 'role', 'projet', 'charge', 'taches', 'actions'];

  searchQuery = '';
  activeTab = 'membres';
  showAddForm = false;
  editingMembre: any = null;
  formData: any = { nom: '', role: 'Développeur', projetId: '', email: '' };

  tachesTerminees = 0;
  tachesEnCours = 0;
  productiviteMoyenne = 0;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res?.items || []);
        this.membres = list.map((e: any) => {
          const stats = e.stats || {};
          return {
            id: e.id || e.Id,
            nom: e.nom || e.Nom,
            initials: (e.nom || e.Nom || 'E').charAt(0),
            role: e.poste || e.Poste || 'Collaborateur',
            projet: e.projetNom || 'Aucun',
            charge: stats.charge || 0,
            tachesTerminees: stats.tachesTerminees || 0,
            tachesTotal: stats.tachesTotal || 0,
            tempsMoyen: stats.tempsMoyen || 0,
            productivite: stats.productivite || 0
          };
        });
        this.filteredMembres = [...this.membres];
        this.calculateStats();
      },
      error: () => {}
    });
    
    const user = this.api.getCurrentUser();
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets: any) => {
        const pList = Array.isArray(projets) ? projets : (projets?.items || []);
        this.projets = pList
          .filter((p: any) => (p.utilisateurId || p.UtilisateurId) === (user?.id || user?.Id))
          .map((p: any) => ({ id: p.id || p.Id, nom: p.nom || p.Nom }));
      },
      error: () => {}
    });
  }

  calculateStats() {
    this.tachesTerminees = this.membres.reduce((sum, m) => sum + m.tachesTerminees, 0);
    this.tachesEnCours = this.membres.reduce((sum, m) => sum + (m.tachesTotal - m.tachesTerminees), 0);
    this.productiviteMoyenne = Math.round(this.membres.reduce((sum, m) => sum + m.productivite, 0) / this.membres.length);
  }

  viewDetails(m: any) { this.snackBar.open('Voir détails: ' + m.nom, 'Fermer', { duration: 3000 }); }
  editMembre(m: any) { this.editingMembre = m; this.formData = { ...m }; }
  affecterProjet(m: any) { this.snackBar.open('Affecter projet: ' + m.nom, 'Fermer', { duration: 3000 }); }
  retirerMembre(m: any) {
    if (confirm('Retirer ' + m.nom + ' de l\'équipe?')) {
      // Dans cette plateforme, retirer signifie souvent désactiver ou changer de société
      // Pour l'instant on va simplement désactiver ou notifier l'admin
      this.api.updateUtilisateur(m.id, { ...m, Actif: false }).subscribe({
        next: () => {
          this.membres = this.membres.filter(x => x.id !== m.id);
          this.filteredMembres = [...this.membres];
          this.calculateStats();
          this.snackBar.open('Membre retiré et désactivé', 'Fermer', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors du retrait', 'Fermer', { duration: 3000 })
      });
    }
  }

  openAddMembre() {
    this.formData = { nom: '', role: 'Développeur', projet: '', email: '' };
    this.showAddForm = true;
  }

  closeForm() {
    this.showAddForm = false;
    this.editingMembre = null;
  }

  saveMembre() {
    if (!this.formData.nom) {
      this.snackBar.open('Veuillez entrer un nom', 'Fermer', { duration: 3000 });
      return;
    }

    let roleMap: Record<string, string> = {
      'Développeur': 'T005',
      'Testeur': 'T006',
      'Chef de projet': 'T004',
      'Client Projet': 'T008'
    };
    const tUserId = roleMap[this.formData.role] || 'T005';

    const payload = {
      nom: this.formData.nom,
      email: this.formData.email,
      poste: this.formData.role,
      societeId: this.societeId,
      typeUtilisateurId: tUserId,
      motDePasse: '123456',
      actif: true
    };

    if (this.editingMembre) {
      this.api.updateUtilisateur(this.editingMembre.id, payload).subscribe({
        next: () => {
          this.loadData();
          this.snackBar.open('Membre mis à jour', 'Fermer', { duration: 3000 });
          this.closeForm();
        }
      });
    } else {
      this.api.createUtilisateur(payload).subscribe({
        next: () => {
          this.loadData();
          this.snackBar.open('Nouveau membre créé', 'Fermer', { duration: 3000 });
          this.closeForm();
        }
      });
    }
  }
}

