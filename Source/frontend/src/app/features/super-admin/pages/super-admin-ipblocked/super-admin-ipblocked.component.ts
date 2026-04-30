import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './super-admin-ipblocked.component.html',
  styleUrls: ['./super-admin-ipblocked.component.scss']
})
export class SuperAdminIpBlockedComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  blockedIps: BlockedIP[] = [];
  newIp = '';
  newRaison = '';

  get activeBlockedCount(): number {
    return this.blockedIps.filter(ip => ip.statut === 'bloqué').length;
  }

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
          this.snackBar.open(`IP ${this.newIp} bloquée`, 'Fermer', { duration: 3000 });
          this.newIp = ''; this.newRaison = '';
        },
        error: () => {
          this.snackBar.open(`Erreur lors du blocage`, 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  debloquerIp(ip: BlockedIP) {
    ip.statut = 'debloqué';
    this.snackBar.open(`IP ${ip.ip} débloquée`, 'Fermer', { duration: 3000 });
  }
}
