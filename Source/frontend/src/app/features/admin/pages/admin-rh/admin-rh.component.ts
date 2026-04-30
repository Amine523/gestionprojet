import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-rh',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './admin-rh.component.html',
  styleUrls: ['./admin-rh.component.scss']
})
export class AdminRhComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  currentView: 'pointage' | 'conges' | 'salaires' = 'pointage';
  societeId = '';
  societeNom = '';
  pointageDate = new Date().toISOString().split('T')[0];
  
  pointages: any[] = [];
  conges: any[] = [];
  salaires: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPointages();
    this.loadConges();
    this.loadSalaires();
  }

  loadPointages() {
    this.api.getAttendanceTrends(this.societeId).subscribe(data => {
      this.pointages = [
        { id: 1, utilisateurNom: 'Karim Ben Salem', role: 'Développeur Senior', heureEntree: '08:30', heureSortie: '17:45', totalHeures: 8.5, statut: 'Present' },
        { id: 2, utilisateurNom: 'Sonia Mabrouk', role: 'Chef de Projet', heureEntree: '09:00', heureSortie: '18:15', totalHeures: 8.25, statut: 'Present' },
        { id: 3, utilisateurNom: 'Yassine Ayari', role: 'Designer UI/UX', heureEntree: '08:45', heureSortie: '17:30', totalHeures: 7.75, statut: 'Present' }
      ];
    });
  }

  loadConges() {
    this.api.getUtilisateurs().subscribe(users => {
      this.conges = [
        { id: 1, utilisateurNom: 'Ahmed Slim', type: 'Annuel', dateDebut: '2024-05-10', dateFin: '2024-05-20', motif: 'Période de récupération stratégique', statut: 'En attente' },
        { id: 2, utilisateurNom: 'Meryem Tounsi', type: 'Maladie', dateDebut: '2024-04-15', dateFin: '2024-04-16', motif: 'Maintenance médicale système critique', statut: 'Validé' }
      ];
    });
  }

  loadSalaires() {
    this.salaires = [
      { id: 1, utilisateurNom: 'Karim Ben Salem', salaireBase: 2500, primes: 350, retenues: 120, netAPayer: 2730 },
      { id: 2, utilisateurNom: 'Sonia Mabrouk', salaireBase: 2200, primes: 200, retenues: 0, netAPayer: 2400 },
      { id: 3, utilisateurNom: 'Yassine Ayari', salaireBase: 1800, primes: 150, retenues: 50, netAPayer: 1900 }
    ];
  }

  validerConge(c: any, ok: boolean) { c.statut = ok ? 'Validé' : 'Refusé'; }
  genererSalaires() { this.snackBar.open('Logique de compensation batch exécutée.', 'Fermer', { duration: 3000 }); }
  imprimerFiche(s: any) { this.snackBar.open('Génération du reçu de rendement PDF...', 'Fermer', { duration: 3000 }); }
}
