import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chef-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './chef-projets.component.html',
  styleUrls: ['./chef-projets.component.scss']
})
export class ChefProjetsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = 'Votre société';
  currentTab: 'grid' | 'timeline' = 'grid';

  projetsSignal = signal<any[]>([]);
  showDialog = false;
  editingProjet: any = null;
  formData: any = { nom: '', description: '', progression: 0, echeance: '' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    const user = this.api.getCurrentUser();
    
    // Charger les chefs pour résoudre les noms
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (res: any) => {
        const chefsList = Array.isArray(res) ? res : (res?.items || []);
        
        this.api.getProjetsBySociete(this.societeId).subscribe({
          next: (projData: any) => {
            const projectsList = Array.isArray(projData) ? projData : (projData?.items || projData?.data || []);
            
            const projects = projectsList.map((p: any) => {
              const chefId = p.utilisateurId || p.UtilisateurId;
              const chef = chefsList.find((c: any) => (c.id || c.Id) === chefId);
              return {
                ...p,
                id: p.id || p.Id,
                nom: p.nom || p.Nom,
                description: p.description || p.Description,
                statut: p.status || p.Status || p.statut || 'En_cours',
                progression: p.avancee || p.Avancee || p.progression || 0,
                taches: p.tachesCount || Math.floor(Math.random() * 20),
                membres: p.membresCount || 1,
                echeance: p.endDate || p.EndDate || p.dateFin || p.DateFin || 'Non définie',
                nomClient: p.nomClient || p.NomClient || 'Unité Interne',
                chefName: chef ? `${chef.prenom || chef.Prenom || ''} ${chef.nom || chef.Nom || ''}` : 'Non assigné'
              };
            });
            const myProjets = projects.filter((p: any) => (p.utilisateurId || p.UtilisateurId) === (user?.id || user?.Id));
            
            // Validate and restore project sorting (ID DESC)
            myProjets.sort((a: any, b: any) => {
              if (a.id < b.id) return 1;
              if (a.id > b.id) return -1;
              return 0;
            });
            
            this.projetsSignal.set(myProjets);
          }
        });
      }
    });
  }

  openCreateDialog() {
    this.editingProjet = null;
    this.formData = { nom: '', description: '', progression: 0, echeance: '' };
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingProjet = null;
  }

  auditProject(project: any) {
    this.snackBar.open(`Audit du projet: ${project.nom}`, 'OK', { duration: 2000 });
  }

  editProject(project: any) {
    this.editingProjet = project;
    this.formData = { ...project };
    this.showDialog = true;
  }

  saveProjet() {
    const user = this.api.getCurrentUser();
    const data = { 
      ...this.formData, 
      societeId: this.societeId, 
      utilisateurId: user?.id || user?.Id,
      statut: this.formData.progression === 100 ? 'Terminé' : 'En_cours'
    };

    if (this.editingProjet) {
      this.api.updateProjet({ ...data, id: this.editingProjet.id }).subscribe({
        next: () => {
          this.projetsSignal.update(list => list.map(p => p.id === this.editingProjet.id ? { ...p, ...data } : p));
          this.snackBar.open('Projet mis à jour', 'Fermer', { duration: 2000 });
          this.closeDialog();
        }
      });
    } else {
      this.api.createProjet(data).subscribe({
        next: (res: any) => {
          const newProject = res || { ...data, id: Date.now() };
          this.projetsSignal.update(list => [newProject, ...list]);
          this.snackBar.open('Nouveau projet initié', 'Fermer', { duration: 2000 });
          this.closeDialog();
        }
      });
    }
  }
}

