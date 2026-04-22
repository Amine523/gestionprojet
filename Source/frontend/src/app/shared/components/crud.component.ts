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
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatChipsModule, MatTooltipModule, MatMenuModule],
  template: `

    <div class="space-y-8 animate-in">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{{ title }}</h1>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Management Workspace</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative group" *ngIf="filters.length">
            <i class="bi bi-funnel absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors"></i>
            <select [(ngModel)]="filterValue" (change)="applyFilter()"
              class="h-12 pl-11 pr-10 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-primary-600/20 focus:ring-4 focus:ring-primary-600/5 font-bold text-sm text-slate-700 dark:text-slate-300 appearance-none transition-all cursor-pointer">
              <option value="">Tous les filtres</option>
              <option *ngFor="let f of filters" [value]="f.value">{{ f.label }}</option>
            </select>
          </div>
          <button (click)="openForm()" 
            class="h-12 px-8 bg-slate-900 dark:bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10">
            <i class="bi bi-plus-lg text-lg"></i> {{ addButtonLabel }}
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="data" class="w-full">
            <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
              <th mat-header-cell *matHeaderCellDef class="px-8 py-6">{{ col.label }}</th>
              <td mat-cell *matCellDef="let row" class="px-8 py-6">
                <ng-container [ngSwitch]="col.type">
                  <div *ngSwitchCase="'boolean'" class="flex items-center gap-2">
                    <div [class]="row[col.key] ? 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' : 'w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700'"></div>
                    <span class="text-sm font-bold" [class.text-emerald-600]="row[col.key]" [class.text-slate-400]="!row[col.key]">
                      {{ row[col.key] ? 'Actif' : 'Inactif' }}
                    </span>
                  </div>
                  <div *ngSwitchCase="'chip'">
                    <span [class]="getStatusClass(row[col.key])">
                      {{ row[col.key] }}
                    </span>
                  </div>
                  <span *ngSwitchDefault class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ row[col.key] }}</span>
                </ng-container>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="px-8 py-6">Control</th>
              <td mat-cell *matCellDef="let row" class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <button (click)="openForm(row)" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100">
                    <i class="bi bi-pencil-square text-lg"></i>
                  </button>
                  <button *ngIf="canApprove && row.status === 'En_attente'" (click)="approve(row)" class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all">
                    <i class="bi bi-check-lg text-lg"></i>
                  </button>
                  <button (click)="delete(row)" class="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                    <i class="bi bi-trash3 text-lg"></i>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-slate-50/50 dark:bg-slate-800/30"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors"></tr>
          </table>
        </div>
        <div *ngIf="data.length === 0" class="py-20 text-center space-y-4">
           <div class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
             <i class="bi bi-folder-x text-4xl"></i>
           </div>
           <p class="text-slate-400 font-bold text-sm tracking-widest uppercase">No Records Identified</p>
        </div>
      </div>

      <!-- Modal Form -->
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in" *ngIf="showForm">
        <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800">
          <div class="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ editing ? 'Modify' : 'Initialize' }} {{ title }}</h2>
              <p class="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">Ecosystem Configuration</p>
            </div>
            <button (click)="showForm = false" class="w-12 h-12 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all flex items-center justify-center">
              <i class="bi bi-x-lg text-xl"></i>
            </button>
          </div>
          
          <form (ngSubmit)="save()" class="p-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              @for (col of formColumns; track col.key) {
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">{{ col.label }}</label>
                  
                  @if (col.type === 'select') {
                    <select [(ngModel)]="formData[col.key]" [name]="col.key"
                      class="w-full h-14 px-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-50 dark:border-slate-800 rounded-2xl outline-none focus:border-primary-600/20 focus:ring-4 focus:ring-primary-600/5 font-bold text-sm text-slate-700 dark:text-slate-300 appearance-none transition-all">
                      <option *ngFor="let opt of col.options" [value]="opt.value">{{ opt.label }}</option>
                    </select>
                  } @else if (col.type === 'boolean') {
                    <label class="flex items-center gap-4 h-14 px-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-50 dark:border-slate-800 cursor-pointer group">
                      <input type="checkbox" [(ngModel)]="formData[col.key]" [name]="col.key"
                        class="w-6 h-6 rounded-lg border-2 border-slate-200 text-primary-600 focus:ring-primary-600 transition-all">
                      <span class="text-sm font-bold text-slate-600 dark:text-slate-400">{{ col.label }} Active</span>
                    </label>
                  } @else {
                    <input [(ngModel)]="formData[col.key]" [name]="col.key"
                      class="w-full h-14 px-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-50 dark:border-slate-800 rounded-2xl outline-none focus:border-primary-600/20 focus:ring-4 focus:ring-primary-600/5 font-bold text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-300 transition-all"
                      [placeholder]="'Enter ' + col.label">
                  }
                </div>
              }
            </div>

            <div class="flex items-center justify-end gap-4 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <button type="button" (click)="showForm = false" 
                class="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                Cancel
              </button>
              <button type="submit" 
                class="h-14 px-10 bg-slate-900 dark:bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
                Commit Changes <i class="bi bi-arrow-right text-lg"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { @apply block; }
    .status-badge {
      @apply px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest border shadow-sm;
    }
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

  getStatusClass(status: string) {
    const base = "px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest border shadow-sm inline-block ";
    switch(status) {
      case 'EnCours':
      case 'En_attente':
        return base + "bg-amber-50 text-amber-600 border-amber-100";
      case 'Terminé':
      case 'Approuvé':
      case 'Actif':
        return base + "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'Refusé':
      case 'Inactif':
        return base + "bg-red-50 text-red-600 border-red-100";
      default:
        return base + "bg-slate-50 text-slate-600 border-slate-100";
    }
  }

  loadData() { const method = 'get' + this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1) + 's'; (this.api as any)[method]().subscribe({ next: (d: any[]) => this.data = d, error: () => this.data = [] }); }
  applyFilter() {}
  openForm(item?: any) { this.editing = !!item; this.formData = item ? { ...item } : {}; this.formColumns.forEach(c => { if (this.formData[c.key] === undefined) this.formData[c.key] = c.type === 'boolean' ? true : ''; }); if (!this.editing) this.formData.id = crypto.randomUUID(); this.showForm = true; }
  save() { const method = (this.editing ? 'update' : 'create') + this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1); (this.api as any)[method](this.formData).subscribe({ next: () => { this.showForm = false; this.loadData(); } }); }
  delete(item: any) { if (confirm('Voulez-vous supprimer cet élément?')) { const method = 'delete' + this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1); (this.api as any)[method](item.id).subscribe({ next: () => this.loadData() }); } }
  approve(item: any) { item.status = 'Approuvé'; this.api.updateDemandeConge(item).subscribe({ next: () => this.loadData() }); }
  toggleStatus(item: any) { item.actif = !item.actif; const method = 'update' + this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1); (this.api as any)[method](item).subscribe({ next: () => this.loadData() }); }
  viewDetails(item: any) { alert('Détails: ' + JSON.stringify(item)); }
}
