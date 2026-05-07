import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Politique {
  id: string;
  titre: string;
  icon: string;
  description: string;
  regles: string[];
  active: boolean;
}

@Component({
  selector: 'app-super-admin-politique',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './super-admin-politique.component.html',
  styleUrls: ['./super-admin-politique.component.scss']
})
export class SuperAdminPolitiqueComponent {
  private snackBar = inject(MatSnackBar);
  
  showEditDialog = false;
  editingPolitique: Politique | null = null;
  editForm = { titre: '', description: '', regles: '' };
  
  politiques: Politique[] = [
    {
      id: 'pwd',
      titre: 'Politique de Mot de Passe',
      icon: 'lock',
      description: 'Regles de confidentialite et robustesse des mots de passe',
      regles: ['Minimum 8 caracteres', 'Majuscules et minuscules', 'Chiffres et caracteres speciaux', 'Expiration tous les 90 jours'],
      active: true
    },
    {
      id: 'ip',
      titre: 'Politique d\'Acces IP',
      icon: 'wifi',
      description: 'Controle des acces par adresse IP',
      regles: ['IPs autorisees configurables', 'Blocage apres 5 echecs', 'Liste blanche/blacklist'],
      active: true
    },
    {
      id: 'session',
      titre: 'Politique de Session',
      icon: 'supervised_user_circle',
      description: 'Gestion des sessions utilisateur',
      regles: ['Timeout apres 30 min inactivite', 'Connexion unique par compte', 'Audit de toutes les actions'],
      active: true
    },
    {
      id: 'auth',
      titre: 'Politique d\'Authentification',
      icon: 'verified_user',
      description: 'Regles d\'authentification multi-facteur',
      regles: ['MFA obligatoire pour Admin', 'Verification par email', 'Code SMS 2FA'],
      active: false
    },
    {
      id: 'data',
      titre: 'Politique de Protection Donnees',
      icon: 'storage',
      description: 'Chiffrement et protection des donnees',
      regles: ['Chiffrement AES-256', 'Sauvegarde quotidienne', 'Retention 30 jours'],
      active: true
    }
  ];

  modifierPolitique(politique: Politique) {
    this.editingPolitique = politique;
    this.editForm = {
      titre: politique.titre,
      description: politique.description,
      regles: politique.regles.join('\n')
    };
    this.showEditDialog = true;
  }

  savePolitique() {
    if (this.editingPolitique) {
      this.editingPolitique.titre = this.editForm.titre;
      this.editingPolitique.description = this.editForm.description;
      this.editingPolitique.regles = this.editForm.regles.split('\n').filter(r => r.trim());
      this.snackBar.open(`${this.editingPolitique.titre} modifiée avec succès`, 'Fermer', { duration: 3000 });
      this.showEditDialog = false;
    }
  }

  togglePolitique(politique: Politique) {
    politique.active = !politique.active;
    this.snackBar.open(`${politique.titre} ${politique.active ? 'activée' : 'désactivée'}`, 'Fermer', { duration: 3000 });
  }
}
