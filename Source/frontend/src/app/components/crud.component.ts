import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatChipsModule, MatTooltipModule, MatMenuModule],
  template: `
    <div class="crud-page">
      <div class="header">
        <h1>{{ title }}</h1>
        <div class="actions">
          <mat-form-field *ngIf="filters.length" appearance="outline" class="filter-field">
            <mat-label>Filtrer</mat-label>
            <mat-select [(ngModel)]="filterValue" (selectionChange)="applyFilter()">
              <mat-option *ngFor="let f of filters" [value]="f.value">{{ f.label }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-flat-button class="add-btn" (click)="openForm()"><mat-icon>add</mat-icon> {{ addButtonLabel }}</button>
        </div>
      </div>

      <mat-card class="table-card">
        <table mat-table [dataSource]="data" class="full-width">
          <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
            <th mat-header-cell *matHeaderCellDef>{{ col.label }}</th>
            <td mat-cell *matCellDef="let row">
              <mat-icon *ngIf="col.type === 'boolean'" [class.active-icon]="row[col.key]" [class.inactive-icon]="!row[col.key]">{{ row[col.key] ? 'check_circle' : 'cancel' }}</mat-icon>
              <mat-chip *ngIf="col.type === 'chip'" [class]="row[col.key]">{{ row[col.key] }}</mat-chip>
              <span *ngIf="!col.type || (col.type !== 'boolean' && col.type !== 'chip')">{{ row[col.key] }}</span>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary" (click)="openForm(row)" matTooltip="Modifier"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="accent" *ngIf="canApprove && row.status === 'En_attente'" (click)="approve(row)" matTooltip="Approuver"><mat-icon>check_circle</mat-icon></button>
              <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Supprimer"><mat-icon>delete</mat-icon></button>
              <button mat-icon-button [matMenuTriggerFor]="menu" *ngIf="hasMenu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewDetails(row)"><mat-icon>visibility</mat-icon><span>Détails</span></button>
                <button mat-menu-item (click)="toggleStatus(row)"><mat-icon>{{ row.actif ? 'pause_circle' : 'play_circle' }}</mat-icon><span>{{ row.actif ? 'Désactiver' : 'Activer' }}</span></button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <p *ngIf="data.length === 0" class="empty">Aucune donnée disponible</p>
      </mat-card>

      <div class="form-overlay" *ngIf="showForm">
        <mat-card class="form-card">
          <h2>{{ editing ? 'Modifier' : 'Ajouter' }} {{ title }}</h2>
          <form (ngSubmit)="save()">
            <div class="form-grid">
              <mat-form-field *ngFor="let col of formColumns" appearance="outline">
                <mat-label>{{ col.label }}</mat-label>
                <input matInput [(ngModel)]="formData[col.key]" [name]="col.key" *ngIf="!col.type || (col.type !== 'boolean' && col.type !== 'select')">
                <mat-select [(ngModel)]="formData[col.key]" [name]="col.key" *ngIf="col.type === 'select'">
                  <mat-option *ngFor="let opt of col.options" [value]="opt.value">{{ opt.label }}</mat-option>
                </mat-select>
                <mat-checkbox [(ngModel)]="formData[col.key]" [name]="col.key" *ngIf="col.type === 'boolean'">{{ col.label }}</mat-checkbox>
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-button type="button" (click)="showForm = false">Annuler</button>
              <button mat-flat-button class="save-btn" type="submit">Enregistrer</button>
            </div>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .crud-page { position: relative; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h1 { color: #1a1a2e; font-weight: 600; margin: 0; }
    .actions { display: flex; align-items: center; gap: 16px; }
    .filter-field { width: 200px; }
    .add-btn, .save-btn { background: #d32f2f; color: #fff; }
    .table-card { padding: 0; border-radius: 12px; }
    .full-width { width: 100%; }
    .empty { padding: 40px; text-align: center; color: #999; }
    .active-icon { color: #4caf50; }
    .inactive-icon { color: #d32f2f; }
    th { background: #f5f7fa; font-weight: 600; color: #333; }
    td, th { padding: 16px; }
    .form-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .form-card { padding: 32px; width: 600px; max-width: 90vw; border-radius: 16px; max-height: 80vh; overflow-y: auto; }
    .form-card h2 { margin: 0 0 24px; color: #1a1a2e; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
    .EnCours, .En_attente { background: #d32f2f !important; color: #fff !important; }
    .Terminé, .Approuvé { background: #4caf50 !important; color: #fff !important; }
    .Refusé { background: #666 !important; color: #fff !important; }
  `]
})
export class CrudComponent implements OnInit {
  title = ''; endpoint = ''; addButtonLabel = 'Ajouter';
  columns: { key: string; label: string; type?: string }[] = [];
  formColumns: { key: string; label: string; type?: string; options?: { value: string; label: string }[] }[] = [];
  filters: { label: string; value: string }[] = [];
  canApprove = false; hasMenu = false;
  data: any[] = []; displayedColumns: string[] = []; filterValue = '';
  showForm = false; editing = false; formData: any = {};
  
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  ngOnInit() {
    const data = this.route.snapshot.data['data'];
    if (data) {
      this.title = data.title; this.endpoint = data.endpoint;
      this.addButtonLabel = data.addButtonLabel || 'Ajouter';
      this.columns = data.columns || [];
      this.formColumns = data.formColumns || this.columns;
      this.filters = data.filters || [];
      this.canApprove = data.canApprove || false;
      this.hasMenu = data.hasMenu || false;
      this.displayedColumns = [...this.columns.map(c => c.key), 'actions'];
      this.loadData();
    }
  }

  loadData() { const method = 'get' + this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1) + 's'; (this.api as any)[method]().subscribe({ next: (d: any[]) => this.data = d, error: () => this.data = [] }); }
  applyFilter() {}
  openForm(item?: any) { this.editing = !!item; this.formData = item ? { ...item } : {}; this.formColumns.forEach(c => { if (this.formData[c.key] === undefined) this.formData[c.key] = c.type === 'boolean' ? true : ''; }); if (!this.editing) this.formData.id = crypto.randomUUID(); this.showForm = true; }
  save() { const method = (this.editing ? 'update' : 'create') + this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1); (this.api as any)[method](this.formData).subscribe({ next: () => { this.showForm = false; this.loadData(); } }); }
  delete(id: string) { if (confirm('Voulez-vous supprimer cet élément?')) { const method = 'delete' + this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1); (this.api as any)[method](id).subscribe({ next: () => this.loadData() }); } }
  approve(item: any) { item.status = 'Approuvé'; this.api.updateDemandeConge(item).subscribe({ next: () => this.loadData() }); }
  toggleStatus(item: any) { item.actif = !item.actif; const method = 'update' + this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1); (this.api as any)[method](item).subscribe({ next: () => this.loadData() }); }
  viewDetails(item: any) { alert('Détails: ' + JSON.stringify(item)); }
}
