import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetsService } from '../service/projets.service';
import { AuthService } from '../service/auth.service';
import { Projet } from '../model/projets.model';

@Component({
  selector: 'app-dev-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.scss']
})
export class DevDashboardComponent implements OnInit {
  private projetsService = inject(ProjetsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser();
  searchQuery = signal('');

  // Computed properties
  mesProjets = computed(() => {
    const allProjets = this.projetsService.projets$() || [];
    const userId = this.currentUser()?.id;
    
    return allProjets.filter(projet => {
      // Logique pour déterminer si le développeur est assigné à ce projet
      // Cela dépendra de votre structure de données réelle
      return projet.chefProjetId === userId || this.isDevAssignedToProjet(projet, userId);
    });
  });

  projetsActifs = computed(() => {
    return this.mesProjets().filter(p => p.statut === 'en_cours');
  });

  projetsTermines = computed(() => {
    return this.mesProjets().filter(p => p.statut === 'termine');
  });

  stats = computed(() => {
    const projets = this.mesProjets();
    return {
      total: projets.length,
      actifs: projets.filter(p => p.statut === 'en_cours').length,
      termines: projets.filter(p => p.statut === 'termine').length,
      enPause: projets.filter(p => p.statut === 'en_pause').length
    };
  });

  recentActivities = signal([
    {
      id: '1',
      type: 'commit',
      message: 'Push de nouvelles fonctionnalités',
      projet: 'Application Mobile',
      time: 'Il y a 2 heures',
      icon: 'code'
    },
    {
      id: '2',
      type: 'task',
      message: 'Tâche terminée: Authentification',
      projet: 'API Backend',
      time: 'Il y a 4 heures',
      icon: 'check'
    },
    {
      id: '3',
      type: 'bug',
      message: 'Bug résolu: Login redirect',
      projet: 'Frontend Web',
      time: 'Il y a 6 heures',
      icon: 'bug'
    }
  ]);

  filteredProjets = computed(() => {
    const projets = this.mesProjets();
    if (!this.searchQuery()) return projets;
    
    return projets.filter(p => 
      p.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      p.description.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  ngOnInit() {
    this.loadProjets();
  }

  loadProjets() {
    this.projetsService.getProjets().subscribe();
  }

  navigateToProjet(projet: Projet) {
    this.router.navigate(['/dev/projets', projet.id]);
  }

  navigateToTasks() {
    this.router.navigate(['/dev/taches']);
  }

  navigateToBugs() {
    this.router.navigate(['/dev/bugs']);
  }

  navigateToApi() {
    this.router.navigate(['/dev/api']);
  }

  navigateToDocs() {
    this.router.navigate(['/dev/docs']);
  }

  navigateToDiagrams() {
    this.router.navigate(['/dev/diagrams']);
  }

  navigateToPointage() {
    this.router.navigate(['/dev/pointage']);
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

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'commit': '💻',
      'task': '✅',
      'bug': '🐛',
      'review': '👀',
      'deploy': '🚀'
    };
    return icons[type] || '📝';
  }

  getActivityClass(type: string): string {
    const classes: { [key: string]: string } = {
      'commit': 'activity-commit',
      'task': 'activity-task',
      'bug': 'activity-bug',
      'review': 'activity-review',
      'deploy': 'activity-deploy'
    };
    return classes[type] || 'activity-default';
  }

  // Helper method - à adapter selon votre structure de données
  private isDevAssignedToProjet(projet: Projet, userId?: string): boolean {
    // Logique à implémenter selon votre modèle de données
    // Par exemple, vérifier si l'utilisateur est dans la liste des développeurs du projet
    return false; // Placeholder
  }
}
