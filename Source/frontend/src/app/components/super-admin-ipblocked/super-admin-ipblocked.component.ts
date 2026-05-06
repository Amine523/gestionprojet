import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface BlockedIP {
  id: string;
  ip: string;
  raison: string;
  dateBlocage: string;
  statut: 'bloqué' | 'debloqué';
}

@Component({
  selector: 'app-super-admin-ipblocked',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container p-4">
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="header-icon d-flex align-items-center justify-content-center">
          <i class="bi bi-shield-x text-white" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-1" style="font-size: 24px; color: #1a1a2e;">IPs Bloquées</h1>
          <p class="text-muted mb-0" style="font-size: 14px;">Gestion des adresses IP bloquées</p>
        </div>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex gap-3 mb-4">
            <div class="flex-grow-1">
              <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Nouvelle IP</label>
              <input type="text" class="form-control" [(ngModel)]="newIp" placeholder="192.168.1.100">
            </div>
            <div class="flex-grow-1">
              <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Raison</label>
              <input type="text" class="form-control" [(ngModel)]="newRaison" placeholder="Raison du blocage">
            </div>
            <div class="d-flex align-items-end">
              <button class="btn btn-primary" (click)="bloquerIp()">
                <i class="bi bi-shield-x me-2"></i>Bloquer
              </button>
            </div>
          </div>
          <div class="ips-list">
            @for (ip of blockedIps; track ip.id) {
              <div class="card ip-card border-0 shadow-sm mb-3">
                <div class="card-body d-flex align-items-center gap-3">
                  <i class="bi bi-wifi text-danger" style="font-size: 24px;"></i>
                  <div class="flex-grow-1">
                    <div class="fw-bold" style="font-size: 14px;">{{ip.ip}}</div>
                    <div class="text-muted" style="font-size: 12px;">{{ip.raison}}</div>
                  </div>
                  <span class="badge rounded-pill" [class.bg-danger]="ip.statut === 'bloqué'" [class.bg-success]="ip.statut === 'debloqué'" style="font-size: 11px;">{{ip.statut}}</span>
                  @if (ip.statut === 'bloqué') {
                    <button class="btn btn-sm btn-outline-success" (click)="debloquerIp(ip)">
                      <i class="bi bi-unlock"></i>
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-icon { width: 56px; height: 56px; background: linear-gradient(135deg, #d32f2f, #b71c1c); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .ip-card { background: #fff; }
  `]
})
export class SuperAdminIpBlockedComponent implements OnInit {
  private api = inject(ApiService);
  
  blockedIps: BlockedIP[] = [];
  newIp = '';
  newRaison = '';

  ngOnInit() { this.loadBlockedIps(); }

  loadBlockedIps() {
    this.api.getBlockedIps().subscribe({
      next: (data) => {
        this.blockedIps = (data || []).map((ip: any) => ({
          id: ip.id,
          ip: ip.ipAddress,
          raison: ip.raison,
          dateBlocage: new Date(ip.dateBlocage).toLocaleDateString('fr-FR'),
          statut: ip.statut === 'bloque' ? 'bloqué' as const : 'debloqué' as const
        }));
      },
      error: () => {
        this.blockedIps = [];
      }
    });
  }

  bloquerIp() {
    if (this.newIp) {
      const data = {
        id: 'BLK_' + Date.now().toString(36).toUpperCase(),
        ipAddress: this.newIp,
        raison: this.newRaison,
        dateBlocage: new Date(),
        statut: 'bloque'
      };
      
      this.api.blockIp(data).subscribe({
        next: () => {
          this.blockedIps.unshift({ id: data.id, ip: this.newIp, raison: this.newRaison, dateBlocage: new Date().toLocaleDateString('fr-FR'), statut: 'bloqué' });
          alert(`IP ${this.newIp} bloquée`);
          this.newIp = ''; this.newRaison = '';
        },
        error: () => {
          alert(`Erreur lors du blocage`);
        }
      });
    }
  }

  debloquerIp(ip: BlockedIP) {
    this.api.unblockIp(ip.id).subscribe({
      next: () => {
        ip.statut = 'debloqué';
        alert(`IP ${ip.ip} débloquée`);
      },
      error: () => {
        ip.statut = 'debloqué';
        alert(`IP ${ip.ip} débloquée (local)`);
      }
    });
  }
}
