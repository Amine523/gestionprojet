import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-paiement-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './paiement-list.component.html',
  styleUrls: ['./paiement-list.component.scss']
})
export class PaiementListComponent implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  displayedColumns: string[] = ['id', 'societe', 'montant', 'methode', 'date', 'statut'];
  paiements = signal<any[]>([]);

  ngOnInit() {
    this.loadPaiements();
  }

  loadPaiements() {
    this.api.search('paiements', {}).subscribe(res => {
      this.paiements.set(res || this.getMockPaiements());
    });
  }

  private getMockPaiements() {
    return [
      { id: 'TXN12345678', societeNom: 'Tech Solutions', emailClient: 'billing@techsol.com', montant: 499, methode: 'Stripe', datePaiement: new Date(), statut: 'Réussi' },
      { id: 'TXN87654321', societeNom: 'Creative Agency', emailClient: 'finance@creative.fr', montant: 299, methode: 'PayPal', datePaiement: new Date(Date.now() - 86400000), statut: 'Réussi' },
      { id: 'TXN11223344', societeNom: 'StartUp Inc', emailClient: 'admin@startup.com', montant: 99, methode: 'Stripe', datePaiement: new Date(Date.now() - 172800000), statut: 'Échoué' }
    ];
  }
}
