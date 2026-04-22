import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-super-admin-politique',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `

    <div class="page-container">
      <div class="page-header"><div class="header-icon"><mat-icon>policy</mat-icon></div>
        <div><h1>Politique de Sécurité</h1><p>Règles et politiques de sécurité</p></div>
      </div>
      <div class="politiques">
        <mat-card class="politique-card">
          <mat-icon>lock</mat-icon>
          <h3>Politique de Mot de Passe</h3>
          <ul><li>Minimum 8 caractères</li><li>Majuscules et minuscules</li><li>Chiffres et caractères spéciaux</li><li>Expiration tous les 90 jours</li></ul>
          <button mat-flat-button color="primary">Modifier</button>
        </mat-card>
        <mat-card class="politique-card">
          <mat-icon>wifi</mat-icon>
          <h3>Politique d'Accès IP</h3>
          <ul><li>IPs autorisées configurables</li><li>Blocage après 5 échecs</li><li>Liste blanche/blacklist</li></ul>
          <button mat-flat-button color="primary">Modifier</button>
        </mat-card>
        <mat-card class="politique-card">
          <mat-icon>supervised_user_circle</mat-icon>
          <h3>Politique de Session</h3>
          <ul><li>Timeout après 30 min inactivité</li><li>Connexion unique par compte</li><li>Audit de toutes les actions</li></ul>
          <button mat-flat-button color="primary">Modifier</button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`.page-container { padding: 28px; } .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; } .header-icon { width: 56px; height: 56px; background: linear-gradient(135deg, #673ab7, #512da8); border-radius: 14px; display: flex; align-items: center; justify-content: center; } .header-icon mat-icon { color: #fff; font-size: 28px; } h1 { font-size: 24px; font-weight: 700; margin: 0; } p { color: #666; margin: 4px 0 0; } .politiques { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; } .politique-card { padding: 24px; border-radius: 12px; } .politique-card mat-icon { font-size: 40px; color: #673ab7; } .politique-card h3 { margin: 16px 0; } .politique-card ul { padding-left: 20px; color: #666; } .politique-card li { margin: 8px 0; } .politique-card button { margin-top: 16px; }`]
})
export class SuperAdminPolitiqueComponent {}
