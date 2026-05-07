import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-dev-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './dev-pointage.component.html',
  styleUrls: ['./dev-pointage.component.scss']
})
export class DevPointageComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  societeId = '';
  societeNom = '';
  currentDateDisplay = '';
  
  pointagesSignal = signal<any[]>([]);
  searchQuery = signal('');
  filterDate = signal(new Date().toISOString().split('T')[0]);
  
  filteredPointages = computed(() => {
    const list = this.pointagesSignal();
    const q = this.searchQuery().toLowerCase();
    const date = this.filterDate();
    
    return list.filter(p => {
      const matchesSearch = !q || p.utilisateurNom?.toLowerCase().includes(q);
      
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

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
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
}
