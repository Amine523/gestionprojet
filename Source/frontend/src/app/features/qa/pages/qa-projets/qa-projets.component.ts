import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './qa-projets.component.html',
  styleUrls: ['./qa-projets.component.scss']
})
export class QaProjetsComponent implements OnInit {
  private api = inject(ApiService);
  projets: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const societeId = user?.societeId || '';
    this.api.getProjetsBySociete(societeId).subscribe(data => {
      this.projets = (data || []).map(p => ({
        ...p,
        tests: Math.floor(Math.random() * 40) + 10,
        bugs: Math.floor(Math.random() * 8)
      }));
    });
  }
}
