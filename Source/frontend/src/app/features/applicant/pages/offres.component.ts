import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-applicant-offres',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.scss']
})
export class ApplicantOffresComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  offres: any[] = [];
  constructor() {
    this.api.getOffresEmploi().subscribe(allOffres => {
      this.offres = allOffres.filter((o: any) =>
        o.statut?.toUpperCase() === 'OUVERTE'
      );
    });
  }
  postuler(offre: any) {
    this.api.setOffreEmploiTemp(offre);
    this.router.navigate(['/applicant/postuler']);
  }
}
