import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dev-conges',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, 
    MatNativeDateModule, MatSnackBarModule, MatProgressBarModule
  ],
  template: `
    <div class="container premium-layout">
      <div class="page-header">
        <div class="header-content">
          <h1 class="gradient-text">Espace Absences</h1>
          <p class="subtitle">Gérez vos demandes de congés en toute simplicité</p>
        </div>
      </div>

      <div class="stats-row">
        <div class="premium-card balance-card shadow-premium">
           <div class="balance-header">
              <div class="b-info">
                 <span class="b-label">Solde Restant</span>
                 <h2 class="b-val">{{solde.soldeRestant}} <span>jours</span></h2>
              </div>
              <div class="b-icon"><mat-icon>beach_access</mat-icon></div>
           </div>
           <div class="balance-progress">
              <mat-progress-bar mode="determinate" [value]="(solde.soldeRestant / solde.soldeTotal) * 100"></mat-progress-bar>
              <div class="p-labels">
                 <span>Consommé: {{solde.soldeUtilise}}j</span>
                 <span>Total: {{solde.soldeTotal}}j</span>
              </div>
           </div>
        </div>

        <div class="premium-card quick-stats shadow-premium">
           <div class="mini-tile">
              <mat-icon class="amber">pending</mat-icon>
              <div class="mt-info">
                 <span class="mt-val">{{solde.congesEnAttente}}</span>
                 <span class="mt-label">En attente</span>
              </div>
           </div>
           <div class="mini-tile">
              <mat-icon class="emerald">check_circle</mat-icon>
              <div class="mt-info">
                 <span class="mt-val">{{solde.congesValides}}</span>
                 <span class="mt-label">Approuvés</span>
              </div>
           </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="premium-card form-widget shadow-premium">
          <div class="widget-header">
            <h3><mat-icon>add_task</mat-icon> Nouvelle Demande</h3>
          </div>
          <form (submit)="soumettreDemande()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Type de congé</mat-label>
                <mat-select [(ngModel)]="nouvelleDemande.typePointageId" name="type" required>
                  <mat-option value="NORMAL">Congé Annuel</mat-option>
                  <mat-option value="MALADIE">Maladie</mat-option>
                  <mat-option value="EXCEP">Exceptionnel</mat-option>
                  <mat-option value="HALFDAY">Demi-journée</mat-option>
                  <mat-option value="AUTORISATION">Autorisation (Heures)</mat-option>
                  <mat-option value="VACATION">Vacances / Vacation</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            @if (nouvelleDemande.typePointageId === 'HALFDAY' || nouvelleDemande.typePointageId === 'AUTORISATION') {
              <div class="form-row grid-2">
                <mat-form-field appearance="outline">
                  <mat-label>Date</mat-label>
                  <input matInput [matDatepicker]="singlePicker" [(ngModel)]="nouvelleDemande.dateDebut" name="start" required>
                  <mat-datepicker-toggle matSuffix [for]="singlePicker"></mat-datepicker-toggle>
                  <mat-datepicker #singlePicker></mat-datepicker>
                </mat-form-field>

                @if (nouvelleDemande.typePointageId === 'HALFDAY') {
                  <mat-form-field appearance="outline">
                    <mat-label>Période</mat-label>
                    <mat-select [(ngModel)]="nouvelleDemande.periode" name="periode" required>
                      <mat-option value="Matin">Matin</mat-option>
                      <mat-option value="Après-midi">Après-midi</mat-option>
                    </mat-select>
                  </mat-form-field>
                }
                @if (nouvelleDemande.typePointageId === 'AUTORISATION') {
                  <mat-form-field appearance="outline">
                    <mat-label>Nombre d'heures</mat-label>
                    <input matInput type="number" [(ngModel)]="nouvelleDemande.heures" name="heures" required min="1" max="8">
                  </mat-form-field>
                }
              </div>
            } @else {
              <div class="form-row grid-2">
                <mat-form-field appearance="outline">
                  <mat-label>Date de début</mat-label>
                  <input matInput [matDatepicker]="startPicker" [(ngModel)]="nouvelleDemande.dateDebut" name="start" required>
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Date de fin</mat-label>
                  <input matInput [matDatepicker]="endPicker" [(ngModel)]="nouvelleDemande.dateFin" name="end" required>
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>
              </div>
            }

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Motif / Justification</mat-label>
              <textarea matInput [(ngModel)]="nouvelleDemande.motif" name="motif" rows="3" placeholder="Ex: Vacances d'été, Rendez-vous médical..."></textarea>
            </mat-form-field>

            @if (nouvelleDemande.typePointageId === 'MALADIE') {
              <div class="upload-zone" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onFileDrop($event)" [class.has-file]="justificatifFile">
                <mat-icon>{{justificatifFile ? 'description' : 'upload_file'}}</mat-icon>
                <span class="uz-text" *ngIf="!justificatifFile">Joindre un justificatif médical<br><small>PDF, JPG, PNG · max 5MB</small></span>
                <span class="uz-text" *ngIf="justificatifFile">{{justificatifFile.name}}<br><small>{{(justificatifFile.size / 1024 / 1024).toFixed(2)}} MB · Cliquer pour changer</small></span>
                <input #fileInput type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileSelect($event)" style="display:none">
              </div>
            }

            <button mat-flat-button class="p-btn p-btn-primary full-width submit-btn" type="submit" [disabled]="loading">
              <mat-icon *ngIf="!loading">send</mat-icon>
              {{loading ? 'Traitement...' : 'Envoyer la demande'}}
            </button>
          </form>
        </div>

        <div class="premium-card history-widget shadow-premium">
          <div class="widget-header">
            <h3><mat-icon>history</mat-icon> Mes Demandes Récentes</h3>
          </div>
          <div class="history-list custom-scroll">
            @for (c of conges; track c.id) {
              <div class="history-item">
                <div class="h-date-icon">
                   <mat-icon>{{c.status === 'Validée' ? 'event_available' : 'event_note'}}</mat-icon>
                </div>
                <div class="h-main">
                  <div class="h-top">
                    <span class="h-type">{{c.typeNom}}</span>
                    <span class="h-status-badge" [class]="c.status?.toLowerCase().replace(' ', '-')">
                       {{c.status}}
                    </span>
                  </div>
                  <div class="h-bottom">
                    <span class="h-range">{{c.dateDebut | date:'dd MMM'}} - {{c.dateFin | date:'dd MMM yyyy'}}</span>
                    <span class="h-days">• {{c.nombreJours}} jours</span>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-state">
                <mat-icon>info_outline</mat-icon>
                <p>Aucune demande enregistrée</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 40px; max-width: 1300px; margin: 0 auto; background: #fcfcfd; min-height: 100vh; }
    .page-header { margin-bottom: 40px; }
    .subtitle { color: #64748b; font-size: 15px; margin: 8px 0 0; }

    .stats-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; margin-bottom: 32px; }
    .balance-card { padding: 32px; background: white; border-radius: 24px; }
    .balance-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .b-label { font-size: 14px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .b-val { font-size: 40px; font-weight: 900; color: #1e293b; margin: 4px 0 0; line-height: 1; }
    .b-val span { font-size: 18px; font-weight: 600; color: #64748b; }
    .b-icon { width: 56px; height: 56px; background: #eff6ff; color: #3b82f6; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
    .b-icon mat-icon { font-size: 30px; width: 30px; height: 30px; }

    .balance-progress { margin-top: 24px; }
    ::ng-deep .balance-progress .mat-mdc-progress-bar { height: 8px; border-radius: 4px; }
    .p-labels { display: flex; justify-content: space-between; margin-top: 12px; font-size: 12px; font-weight: 700; color: #64748b; }

    .quick-stats { display: grid; grid-template-rows: 1fr 1fr; gap: 16px; background: transparent; box-shadow: none !important; padding: 0 !important; }
    .mini-tile { background: white; padding: 24px; border-radius: 20px; display: flex; align-items: center; gap: 20px; box-shadow: var(--p-shadow); }
    .mini-tile mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .mini-tile .amber { color: #f59e0b; }
    .mini-tile .emerald { color: #10b981; }
    .mt-val { font-size: 24px; font-weight: 800; color: #1e293b; display: block; line-height: 1; }
    .mt-label { font-size: 12px; font-weight: 600; color: #64748b; }

    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
    .form-widget, .history-widget { padding: 32px; background: white; border-radius: 24px; }
    .widget-header { margin-bottom: 28px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }
    .widget-header h3 { margin: 0; font-size: 18px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 12px; }
    .widget-header mat-icon { color: #3b82f6; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }
    .submit-btn { height: 54px; border-radius: 14px; font-weight: 700; font-size: 15px; margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 10px; }

    .history-list { display: flex; flex-direction: column; gap: 16px; max-height: 480px; overflow-y: auto; padding-right: 8px; }
    .history-item { 
      display: flex; align-items: center; gap: 16px; padding: 20px; 
      background: #f8fafc; border-radius: 18px; border: 1px solid transparent; transition: all 0.2s;
    }
    .history-item:hover { transform: scale(1.02); background: white; border-color: #e2e8f0; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
    
    .h-date-icon { width: 44px; height: 44px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; color: #94a3b8; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .h-main { flex: 1; }
    .h-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .h-type { font-size: 14px; font-weight: 800; color: #1e293b; }
    .h-status-badge { font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 4px 10px; border-radius: 10px; letter-spacing: 0.5px; }
    .h-status-badge.validée { background: #ecfdf5; color: #059669; }
    .h-status-badge.refusée { background: #fef2f2; color: #dc2626; }
    .h-status-badge.en-attente { background: #fffbeb; color: #d97706; }
    
    .h-bottom { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; font-weight: 500; }
    .h-days { color: #3b82f6; font-weight: 700; }

    .empty-state { padding: 40px; text-align: center; color: #94a3b8; }
    .empty-state mat-icon { font-size: 40px; width: 40px; height: 40px; margin-bottom: 12px; }

    .upload-zone {
      display: flex; align-items: center; gap: 16px;
      padding: 20px 24px; border: 2px dashed #e2e8f0; border-radius: 16px;
      cursor: pointer; transition: all 0.2s; margin-bottom: 16px;
      background: #f8fafc; color: #94a3b8;
    }
    .upload-zone:hover { border-color: #3b82f6; background: #eff6ff; color: #3b82f6; }
    .upload-zone.has-file { border-color: #10b981; background: #ecfdf5; color: #059669; }
    .upload-zone mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .uz-text { font-size: 14px; font-weight: 700; line-height: 1.6; }
    .uz-text small { font-weight: 500; font-size: 11px; opacity: 0.8; }
  `]
})
export class DevCongesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  solde = { soldeTotal: 30, soldeUtilise: 0, soldeRestant: 30, congesEnAttente: 0, congesValides: 0 };
  conges: any[] = [];
  nouvelleDemande = { typePointageId: 'NORMAL', dateDebut: null, dateFin: null, motif: '', periode: 'Matin', heures: 2 };
  loading = false;
  justificatifFile: File | null = null;
  lastDemandeId: string | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const user = this.api.getCurrentUser();
    this.api.getSoldeConge(user.id).subscribe(res => {
      this.solde = res;
    });
    
    // Get all requests for history
    this.api.getDemandesConge().subscribe(data => {
      this.conges = data.filter((d: any) => d.utilisateurId === user.id)
        .sort((a: any, b: any) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime());
    });
  }

  soumettreDemande() {
    if (this.nouvelleDemande.typePointageId === 'HALFDAY' || this.nouvelleDemande.typePointageId === 'AUTORISATION') {
      if (!this.nouvelleDemande.dateDebut) {
        this.snackBar.open('Veuillez remplir la date', 'Fermer', { duration: 3000 });
        return;
      }
      this.nouvelleDemande.dateFin = this.nouvelleDemande.dateDebut; // Same date for single day
    } else {
      if (!this.nouvelleDemande.dateDebut || !this.nouvelleDemande.dateFin) {
        this.snackBar.open('Veuillez remplir les dates', 'Fermer', { duration: 3000 });
        return;
      }
    }

    this.loading = true;
    const user = this.api.getCurrentUser();
    
    let finalMotif = this.nouvelleDemande.motif;
    if (this.nouvelleDemande.typePointageId === 'HALFDAY') {
      finalMotif = `[Demi-journée : ${this.nouvelleDemande.periode}] ` + finalMotif;
    } else if (this.nouvelleDemande.typePointageId === 'AUTORISATION') {
      finalMotif = `[Autorisation : ${this.nouvelleDemande.heures}h] ` + finalMotif;
    }
    
    const dto = {
      utilisateurId: user.id,
      typePointageId: this.nouvelleDemande.typePointageId,
      dateDebut: this.nouvelleDemande.dateDebut,
      dateFin: this.nouvelleDemande.dateFin,
      motif: finalMotif
    };

    this.api.createDemandeCongeReal(dto).subscribe({
      next: (res: any) => {
        const demandeId = res?.id;
        this.lastDemandeId = demandeId;

        // If sick leave and a file is selected, upload it right after
        if (this.nouvelleDemande.typePointageId === 'MALADIE' && this.justificatifFile && demandeId) {
          this.api.uploadJustificatif(demandeId, this.justificatifFile).subscribe({
            next: () => {
              this.snackBar.open('Demande envoyée avec justificatif ✓', 'Fermer', { duration: 4000 });
            },
            error: () => {
              this.snackBar.open('Demande envoyée, échec upload justificatif', 'Fermer', { duration: 4000 });
            }
          });
        } else {
          this.snackBar.open('Votre demande a été envoyée au service RH 📎', 'Fermer', { duration: 4000 });
        }

        this.nouvelleDemande = { typePointageId: 'NORMAL', dateDebut: null, dateFin: null, motif: '', periode: 'Matin', heures: 2 };
        this.justificatifFile = null;
        this.loadData();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi de la demande', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.justificatifFile = input.files[0];
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.justificatifFile = file;
  }
}
