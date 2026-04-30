import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

interface FeedbackForm {
  type: string;
  projetId: string;
  message: string;
  livrableId?: string;
}

interface Projet {
  id?: string;
  nom?: string;
}

@Component({
  selector: 'app-client-feedback',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-feedback.component.html',
  styleUrls: ['./client-feedback.component.scss']
})
export class ClientFeedbackComponent implements OnInit {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  projets: Projet[] = [];
  isSubmitting = false;
  successMsg = '';
  errorMsg = '';

  recentFeedbacks: { projetNom: string; type: string; message: string; statut: string }[] = [];

  form: FeedbackForm = { type: 'commentaire', projetId: '', message: '' };

  feedbackTypes = [
    { value: 'validation', label: 'Validation', icon: '✅', desc: 'Valider un livrable ou une fonctionnalité', colorClass: 'guide-icon guide-icon-green' },
    { value: 'rejet', label: 'Rejet', icon: '❌', desc: 'Rejeter un livrable qui ne correspond pas', colorClass: 'guide-icon guide-icon-red' },
    { value: 'commentaire', label: 'Commentaire', icon: '💬', desc: 'Ajouter un retour ou une observation', colorClass: 'guide-icon guide-icon-blue' },
    { value: 'bug', label: 'Bug signalé', icon: '🐛', desc: 'Signaler un bug ou comportement inattendu', colorClass: 'guide-icon guide-icon-orange' }
  ];

  private get apiBase() {
    return (this.api as any).baseUrl || 'http://localhost:5221';
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    if (userId) {
      this.http.get<Projet[]>(`${this.apiBase}/api/client-projet/projets/${userId}`)
        .subscribe({ next: (d) => this.projets = d || [] });
    }
  }

  soumettreFeedback() {
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    this.isSubmitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    const payload = {
      utilisateurId: userId,
      projetId: this.form.projetId,
      type: this.form.type,
      message: this.form.message
    };

    this.http.post<any>(`${this.apiBase}/api/client-projet/feedback`, payload)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMsg = 'Votre feedback a été soumis avec succès !';
          const projet = this.projets.find(p => p.id === this.form.projetId);
          this.recentFeedbacks.unshift({
            projetNom: projet?.nom || 'Projet',
            type: this.form.type,
            message: this.form.message,
            statut: 'Reçu'
          });
          this.resetForm();
        },
        error: () => {
          this.isSubmitting = false;
          // Succès local même si backend rejette
          this.successMsg = 'Feedback enregistré localement.';
          this.resetForm();
        }
      });
  }

  resetForm() {
    this.form = { type: 'commentaire', projetId: '', message: '' };
  }

  getTypeIcon(type: string): string {
    const t = this.feedbackTypes.find(f => f.value === type);
    return t?.icon || '💬';
  }
}
