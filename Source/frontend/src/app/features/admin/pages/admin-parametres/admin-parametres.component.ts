import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './admin-parametres.component.html',
  styleUrls: ['./admin-parametres.component.scss']
})
export class AdminParametresComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societe: any = { nom: '', email: '', telephone: '', adresse: '', description: '' };
  config: any = { heureDebut: '08:00', heureFin: '17:00' };
  isDarkMode = false;
  societeNom = '';

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const societeId = user?.societeId || '';
    if (societeId) {
      this.api.getSocieteById(societeId).subscribe(s => {
        this.societe = s;
        this.societeNom = s.nom;
      });
    }
    this.api.getUserPreference('apparence').subscribe((p: any) => this.isDarkMode = p === true);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.api.setUserPreference('apparence', this.isDarkMode);
    if (this.isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }

  saveAll() {
    this.api.updateSociete(this.societe).subscribe(() => {
      this.snackBar.open('System Nexus Updated Successfully', 'OK', { duration: 3000 });
    });
  }
}
