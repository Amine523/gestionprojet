import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './chef-bugs.component.html',
  styleUrls: ['./chef-bugs.component.scss']
})
export class ChefBugsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = 'Votre société';
  
  activeTab = 'list';
  bugs: any[] = [];

  filteredBugs: any[] = [];
  displayedColumns = ['titre', 'priorite', 'statut', 'assignee', 'projet', 'date', 'actions'];

  searchBug = '';
  filterStatut = '';
  filterPriorite = '';

  projets: any[] = [];
  membres: any[] = [];

  showAddBug = false;
  editingBug: any = null;
  formData: any = { titre: '', description: '', priorite: 'Medium', projetId: '', etapes: '' };

  bugsOuverts = 0;
  bugsEnCours = 0;
  bugsCorriges = 0;
  tauxQualite = 0;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = projets.map((p: any) => ({ nom: p.nom }));
        this.generateBugs();
      },
      error: () => { this.generateBugs(); }
    });
    
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.membres = employes.map((e: any) => e.nom);
      },
      error: () => {}
    });
  }
  
  generateBugs() {
    const priorites = ['Critical', 'High', 'Medium', 'Low'];
    const statuts = ['Ouvert', 'En_cours', 'Corrigé'];
    this.bugs = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      titre: `Bug ${i + 1}`,
      priorite: priorites[Math.floor(Math.random() * 4)],
      statut: statuts[Math.floor(Math.random() * 3)],
      assignee: this.membres.length > 0 ? this.membres[Math.floor(Math.random() * this.membres.length)] : '',
      projet: this.projets.length > 0 ? this.projets[Math.floor(Math.random() * this.projets.length)].nom : 'Projet',
      date: new Date().toLocaleDateString('fr-FR')
    }));
    this.filteredBugs = [...this.bugs];
    this.calculateStats();
  }

  calculateStats() {
    this.bugsOuverts = this.bugs.filter(b => b.statut === 'Ouvert').length;
    this.bugsEnCours = this.bugs.filter(b => b.statut === 'En_cours').length;
    this.bugsCorriges = this.bugs.filter(b => b.statut === 'Corrigé').length;
    this.tauxQualite = Math.round((this.bugsCorriges / this.bugs.length) * 100);
  }

  getCountByPriority(priority: string): number {
    return this.bugs.filter(b => b.priorite === priority).length;
  }

  getCountByProject(projet: string): number {
    return this.bugs.filter(b => b.projet === projet).length;
  }

  getCountByProjectStatus(projet: string, statut: string): number {
    return this.bugs.filter(b => b.projet === projet && b.statut === statut).length;
  }

  getPercentByProject(projet: string, statut: string): number {
    const total = this.getCountByProject(projet);
    if (total === 0) return 0;
    return (this.getCountByProjectStatus(projet, statut) / total) * 100;
  }

  viewBug(b: any) { this.snackBar.open('Voir bug: ' + b.titre, 'Fermer', { duration: 3000 }); }
  editBug(b: any) { this.editingBug = b; this.formData = { ...b }; }
  affecterBug(b: any) { this.snackBar.open('Affecter bug: ' + b.titre, 'Fermer', { duration: 3000 }); }
  corrigerBug(b: any) {
    b.statut = 'Corrigé';
    this.calculateStats();
    this.snackBar.open('Bug marqué comme corrigé', 'Fermer', { duration: 3000 });
  }

  openAddBug() {
    this.formData = { titre: '', description: '', priorite: 'Medium', projet: '', etapes: '' };
    this.showAddBug = true;
  }

  closeForm() {
    this.showAddBug = false;
    this.editingBug = null;
  }

  saveBug() {
    if (!this.formData.titre) {
      this.snackBar.open('Veuillez entrer un titre', 'Fermer', { duration: 3000 });
      return;
    }
    if (this.editingBug) {
      const index = this.bugs.findIndex(b => b.id === this.editingBug.id);
      if (index >= 0) this.bugs[index] = { ...this.formData, id: this.editingBug.id };
    } else {
      this.bugs.push({ ...this.formData, id: Date.now(), statut: 'Ouvert', assignee: '', date: new Date().toLocaleDateString('fr-FR') });
    }
    this.filteredBugs = [...this.bugs];
    this.calculateStats();
    this.snackBar.open('Bug enregistré', 'Fermer', { duration: 3000 });
    this.closeForm();
  }
}

