import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-rh-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './rh-pointage.component.html',
  styleUrls: ['./rh-pointage.component.scss']
})
export class RhPointageComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = '';
  currentDateDisplay = '';
  rapportMois = new Date().getMonth() + 1;
  rapportAnnee = new Date().getFullYear();
  
  pointagesSignal = signal<any[]>([]);
  searchQuery = signal('');
  filterUtilisateur = signal('');
  filterDate = signal(new Date().toISOString().split('T')[0]);
  
  filteredPointages = computed(() => {
    const list = this.pointagesSignal();
    const q = this.searchQuery().toLowerCase();
    const date = this.filterDate();
    
    return list.filter(p => {
      const matchesSearch = !q || p.utilisateurNom?.toLowerCase().includes(q);
      
      // Robust date matching
      let matchesDate = !date;
      if (date && p.date) {
        const pDateStr = typeof p.date === 'string' ? p.date : '';
        matchesDate = pDateStr.startsWith(date);
      }
      
      return matchesSearch && matchesDate;
    });
  });

  isLoading = false;
  stats = { totalEmployes: 0, employesActifs: 0, employesPresents: 0, employesAbsents: 0, tauxPresence: 0 };
  employesMap: { [id: string]: string } = {};
  
  showEditDialog = false;
  editingPointage: any = null;
  editForm: any = { entre: '', sortie: '' };

  ngOnInit() {
    this.societeId = this.api.getCurrentSocieteId();
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.currentDateDisplay = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.loadStats();

    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.employesMap = {};
        employes.forEach((e: any) => {
          this.employesMap[e.id || e.Id] = e.nom || e.Nom;
        });

        this.api.getPointages().subscribe({
          next: (allPointages) => {
            const list = (allPointages || [])
              .filter((p: any) => {
                const uId = p.utilisateurId || p.UtilisateurId;
                return !!this.employesMap[uId];
              })
              .map((p: any) => {
                const uId = p.utilisateurId || p.UtilisateurId;
                const uNom = p.utilisateurNom || p.UtilisateurNom || this.employesMap[uId] || 'Utilisateur ' + uId;
              return {
                id: p.id || p.Id,
                utilisateurId: uId,
                utilisateurNom: uNom,
                date: p.date || p.Date,
                heureDebut: p.heureEntree || p.HeureEntree,
                heureFin: p.heureSortie || p.HeureSortie,
                heuresTravaillees: p.duree || p.Duree || 0,
                note: p.note || p.Note,
                typeId: p.typeId || p.TypeId
              };
            });
            this.pointagesSignal.set(list);
            this.isLoading = false;
          },
          error: () => {
            this.pointagesSignal.set([]);
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadStats() {
    this.api.getRHStats(this.societeId, this.filterDate()).subscribe(res => {
       this.stats = res;
    });
  }

  editPointage(p: any) {
     this.editingPointage = p;
     this.editForm = {
        entre: p.heureDebut ? p.heureDebut.substring(0, 5) : '',
        sortie: p.heureFin ? p.heureFin.substring(0, 5) : ''
     };
     this.showEditDialog = true;
  }

  closeEditDialog() {
     this.showEditDialog = false;
     this.editingPointage = null;
  }

  savePointageEdit() {
    if (!this.editingPointage) return;
    const data = { 
      ...this.editingPointage, 
      heureDebut: this.editForm.entre, 
      heureFin: this.editForm.sortie,
      societeId: this.societeId 
    };
    
    this.api.updatePointage(data).subscribe({
      next: () => {
        this.pointagesSignal.update(list => list.map(p => 
          (p.id === data.id) ? { ...p, heureDebut: data.heureDebut, heureFin: data.heureFin } : p
        ));
        this.snackBar.open('Pointage mis à jour avec succès', 'Fermer', { duration: 2000 });
        this.showEditDialog = false;
        this.loadStats(); // Update stats since status might change
      },
      error: (err) => this.snackBar.open('Erreur: ' + (err.message || 'Échec'), 'Fermer', { duration: 3000 })
    });
  }

  exportRapportHTML() {
    const url = this.api.getRapportPresenceUrl(this.societeId, this.rapportMois, this.rapportAnnee, 'html');
    window.open(url, '_blank');
  }

  exportRapportCSV() {
    this.api.getRapportPresence(this.societeId, this.rapportMois, this.rapportAnnee).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presence_${this.societeNom}_${this.rapportAnnee}_${String(this.rapportMois).padStart(2,'0')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.snackBar.open('Export CSV téléchargé ✓', 'Fermer', { duration: 3000 });
    });
  }
}
