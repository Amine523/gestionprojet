import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiGenericService } from '@core/services/api-generic.service';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-conge-validation',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule],
  templateUrl: './conge-validation.component.html',
  styleUrls: ['./conge-validation.component.scss']
})
export class CongeValidationComponent implements OnInit {
  private api = inject(ApiGenericService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);

  demandes = signal<any[]>([]);

  ngOnInit() {
    this.loadDemandes();
  }

  loadDemandes() {
    const societeId = this.auth.currentUser()?.societeId;
    if (!societeId) return;

    this.api.search('DemandesConge', { societeId, status: 'En_attente' }).subscribe((res: any) => {
      this.demandes.set(res || []);
    });
  }

  validate(demande: any, accepted: boolean) {
    const status = accepted ? 'Validée' : 'Refusée';
    const payload = {
      ...demande,
      status,
      valideParId: this.auth.currentUser()?.id
    };

    this.api.ajouterOuModifier('DemandesConge', payload).subscribe(() => {
      this.notify.showToast(`Demande ${status.toLowerCase()}`, accepted ? 'success' : 'info');
      this.loadDemandes();
    });
  }
}
