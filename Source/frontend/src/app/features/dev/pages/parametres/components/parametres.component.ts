import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService, Language } from '@core/services/language.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ParametresService } from '../service/parametres.service';
import { Profil, Notifications, Preferences } from '../model/parametres.model';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent implements OnInit {
  private parametresService = inject(ParametresService);
  public lang = inject(LanguageService);
  private snackBar = inject(MatSnackBar);

  societeNom = '';
  profil: Profil = { nom: '', email: '', role: '', initials: '', photo: '' };
  notifications: Notifications = { taches: true, bugs: true, commentaires: true, mentions: true };
  preferences: Preferences = { darkMode: false, compactKanban: false };

  ngOnInit() {
    const user = this.parametresService.getCurrentUser();
    this.societeNom = this.parametresService.getSocieteNom(user);
    this.profil = this.parametresService.createProfil(user);
    this.loadFromStorage();
    this.applyDarkMode();
  }

  changeLang(l: Language) {
    this.lang.setLanguage(l);
    this.snackBar.open(this.lang.translate('language') + ' : ' + (l === 'fr' ? 'Français' : 'English'), '', { duration: 2000 });
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profil.photo = e.target.result;
        this.saveProfil();
      };
      reader.readAsDataURL(file);
    }
  }

  applyDarkMode() {
    this.parametresService.applyDarkMode(this.preferences.darkMode);
  }

  loadFromStorage() {
    this.notifications = this.parametresService.loadNotifications();
    this.preferences = this.parametresService.loadPreferences();
  }

  saveProfil() {
    this.parametresService.updateCurrentUser({ 
      nom: this.profil.nom, 
      email: this.profil.email,
      photo: this.profil.photo 
    });
    this.snackBar.open(this.lang.translate('success_save'), 'OK', { duration: 3000 });
  }

  saveNotifications() {
    this.parametresService.saveNotifications(this.notifications);
    this.snackBar.open(this.lang.translate('success_notif'), 'OK', { duration: 2000 });
  }

  savePreferences() {
    this.parametresService.savePreferences(this.preferences);
    this.applyDarkMode();
    this.snackBar.open(this.lang.translate('success_prefs'), 'OK', { duration: 2000 });
  }
}
