import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { Societe } from '@core/models';

@Component({
  selector: 'app-societe-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatMenuModule],
  templateUrl: './societe-list.component.html',
  styleUrls: ['./societe-list.component.scss']
})
export class SocieteListComponent implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  societes = signal<Societe[]>([]);

  ngOnInit() {
    this.loadSocietes();
  }

  loadSocietes() {
    this.api.search<Societe>('societes', {}).subscribe(res => {
      this.societes.set(res || []);
    });
  }

  viewDetails(societe: Societe) {
    // Navigate to societe detail
  }
}
