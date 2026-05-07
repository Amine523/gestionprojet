import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetsService } from '../service/projets.service';
import { Projet } from '../model/projets.model';

@Component({
  selector: 'app-projets-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projets-list.component.html',
  styleUrls: ['./projets-list.component.scss']
})
export class ProjetsListComponent implements OnInit {
  private projetsService = inject(ProjetsService);

  searchQuery = signal('');
  selectedStatut = signal('all');

  projets = computed(() => {
    const allProjets = this.projetsService.projets$().value || [];
    let filtered = allProjets;

    if (this.searchQuery()) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchQuery().toLowerCase())
      );
    }

    if (this.selectedStatut() !== 'all') {
      filtered = filtered.filter(p => p.statut === this.selectedStatut());
    }

    return filtered;
  });

  stats = computed(() => {
    return this.projetsService.stats().value;
  });

  ngOnInit() {
    this.loadProjets();
  }

  loadProjets() {
    this.projetsService.getProjets().subscribe();
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'en_cours': 'En Cours',
      'termine': 'Terminé',
      'en_pause': 'En Pause',
      'annule': 'Annulé'
    };
    return labels[statut] || statut;
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'en_cours': 'badge-warning',
      'termine': 'badge-success',
      'en_pause': 'badge-info',
      'annule': 'badge-danger'
    };
    return classes[statut] || 'badge-secondary';
  }
}
