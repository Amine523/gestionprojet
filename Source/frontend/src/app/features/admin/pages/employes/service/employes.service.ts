import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { Employe, Projet, EmployeStats, FiltreEmploye, EmployeFormData, NotificationEmploye } from '../model/employes.model';

@Injectable({
  providedIn: 'root'
})
export class EmployesService {
  private employesSubject = new BehaviorSubject<Employe[]>([]);
  private clientsSubject = new BehaviorSubject<Employe[]>([]);
  private statsSubject = new BehaviorSubject<EmployeStats>({
    total: 0,
    actifs: 0,
    enConge: 0,
    nouveaux: 0,
    parType: {}
  });

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  getEmployes(filtre?: FiltreEmploye): Observable<Employe[]> {
    return this.apiService.getUtilisateurs().pipe(
      map((utilisateurs: any[]) => {
        // Exclude clients (T008) from the general employee list
        const filteredList = utilisateurs.filter(u => (u.typeUtilisateurId || u.TypeUtilisateurId) !== 'T008');
        let filteredEmployes = filteredList.map(emp => this.mapToEmploye(emp));
        
        if (filtre) {
          filteredEmployes = this.filtrerEmployes(filteredEmployes, filtre);
        }
        
        this.employesSubject.next(filteredEmployes);
        this.updateStats(filteredEmployes);
        return filteredEmployes;
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors du chargement des employés', 'Fermer', { duration: 3000 });
        return of([]);
      })
    );
  }

  getClients(filtre?: FiltreEmploye): Observable<Employe[]> {
    return this.apiService.getUtilisateurs().pipe(
      map((utilisateurs: any[]) => {
        const filteredList = utilisateurs.filter(u => (u.typeUtilisateurId || u.TypeUtilisateurId) === 'T008');
        let filteredClients = filteredList.map(emp => this.mapToEmploye(emp));
        if (filtre) {
          filteredClients = this.filtrerEmployes(filteredClients, filtre);
        }
        this.clientsSubject.next(filteredClients);
        this.updateStats(filteredClients);
        return filteredClients;
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', { duration: 3000 });
        return of([]);
      })
    );
  }

  getEmployeById(id: string | number): Observable<Employe | null> {
    return this.apiService.getUtilisateurs().pipe(
      map((employes: any[]) => {
        const employe = employes.find(e => (e.id || e.Id) === id);
        return employe ? this.mapToEmploye(employe) : null;
      }),
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement de l\'employé', 'Fermer', { duration: 3000 });
        return of(null);
      })
    );
  }

  createEmploye(formData: EmployeFormData): Observable<Employe> {
    return this.apiService.createUtilisateur(formData).pipe(
      map((employe: any) => this.mapToEmploye(employe)),
      tap(() => {
        this.snackBar.open('Employé créé avec succès', 'Fermer', { duration: 3000 });
        this.refreshEmployes();
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la création de l\'employé', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  updateEmploye(id: string | number, formData: Partial<EmployeFormData>): Observable<Employe> {
    return this.apiService.updateUtilisateur(id.toString(), formData).pipe(
      map((employe: any) => this.mapToEmploye(employe)),
      tap(() => {
        this.snackBar.open('Employé mis à jour avec succès', 'Fermer', { duration: 3000 });
        this.refreshEmployes();
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la mise à jour de l\'employé', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  deleteEmploye(id: string | number): Observable<void> {
    return this.apiService.deleteUtilisateur(id.toString()).pipe(
      tap(() => {
        this.snackBar.open('Employé supprimé avec succès', 'Fermer', { duration: 3000 });
        this.refreshEmployes();
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la suppression de l\'employé', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  getEmployesBySociete(societeId: string): Observable<Employe[]> {
    return this.apiService.getEmployesBySociete(societeId).pipe(
      map((employes: any[]) => employes.map(emp => this.mapToEmploye(emp))),
      catchError((error) => {
        this.snackBar.open('Erreur lors du chargement des employés', 'Fermer', { duration: 3000 });
        return of([]);
      })
    );
  }

  getTypesUtilisateurs(): Observable<any[]> {
    return this.apiService.getUtilisateurs().pipe(
      map((utilisateurs: any[]) => {
        const types = [...new Set(utilisateurs.map(u => u.typeUtilisateurId || u.TypeUtilisateurId))];
        return types.map(typeId => ({
          id: typeId,
          label: this.getTypeLabel(typeId)
        }));
      })
    );
  }

  getSocietes(): Observable<any[]> {
    return this.apiService.getSocietes();
  }

  getProjets(): Observable<Projet[]> {
    return this.apiService.getProjets().pipe(
      map((projets: any[]) => projets.map(projet => this.mapToProjet(projet)))
    );
  }

  // BehaviorSubjects pour les composants
  get employes$() {
    return this.employesSubject.asObservable();
  }

  get clients$() {
    return this.clientsSubject.asObservable();
  }

  get stats$() {
    return this.statsSubject.asObservable();
  }

  private mapToEmploye(data: any): Employe {
    return {
      id: data.id || data.Id,
      nom: data.nom || data.Nom,
      prenom: data.prenom || data.Prenom,
      email: data.email || data.Email,
      telephone: data.telephone || data.Telephone,
      typeUtilisateurId: data.typeUtilisateurId || data.TypeUtilisateurId,
      typeUtilisateurLabel: data.typeUtilisateurLabel || this.getTypeLabel(data.typeUtilisateurId || data.TypeUtilisateurId),
      societeId: data.societeId || data.SocieteId,
      dateEmbauche: data.dateEmbauche || data.DateEmbauche,
      salaire: data.salaire || data.Salaire,
      statut: this.determineStatut(data),
      photo: data.photo || data.Photo,
      adresse: data.adresse || data.Adresse,
      competence: data.competence || data.Competence || [],
      projets: data.projets || data.Projets || []
    };
  }

  private mapToProjet(data: any): Projet {
    return {
      id: data.id || data.Id,
      nom: data.nom || data.Nom,
      description: data.description || data.Description,
      statut: data.statut || data.Statut || 'actif',
      dateDebut: data.dateDebut || data.DateDebut,
      dateFin: data.dateFin || data.DateFin,
      budget: data.budget || data.Budget,
      chefId: data.chefId || data.ChefId,
      chefNom: data.chefNom || data.ChefNom,
      equipe: data.equipe || data.Equipe || [],
      progression: data.progression || data.Progression || 0
    };
  }

  private filtrerEmployes(employes: Employe[], filtre: FiltreEmploye): Employe[] {
    return employes.filter(employe => {
      let matches = true;

      if (filtre.recherche) {
        const recherche = filtre.recherche.toLowerCase();
        matches = matches && (
          (employe.nom?.toLowerCase() || '').includes(recherche) ||
          (employe.prenom?.toLowerCase() || '').includes(recherche) ||
          (employe.email?.toLowerCase() || '').includes(recherche)
        );
      }

      if (filtre.typeUtilisateurId) {
        matches = matches && employe.typeUtilisateurId === filtre.typeUtilisateurId;
      }

      if (filtre.statut) {
        matches = matches && employe.statut === filtre.statut;
      }

      if (filtre.societeId) {
        matches = matches && employe.societeId === filtre.societeId;
      }

      return matches;
    });
  }

  private determineStatut(data: any): 'actif' | 'inactif' | 'en_conge' {
    if (data.statut === 'inactif' || data.Statut === 'inactif') {
      return 'inactif';
    } else if (data.enConge || data.EnConge) {
      return 'en_conge';
    }
    return 'actif';
  }

  private getTypeLabel(typeId: string): string {
    const types: { [key: string]: string } = {
      'T001': 'Super Admin',
      'T002': 'Admin Société',
      'T003': 'RH',
      'T004': 'Chef de Projet',
      'T005': 'Développeur',
      'T006': 'Testeur/QA',
      'T007': 'Candidat',
      'T008': 'Client'
    };
    return types[typeId] || typeId;
  }

  private updateStats(employes: Employe[]): void {
    const stats: EmployeStats = {
      total: employes.length,
      actifs: employes.filter(e => e.statut === 'actif').length,
      enConge: employes.filter(e => e.statut === 'en_conge').length,
      nouveaux: employes.filter(e => {
        const dateEmbauche = new Date(e.dateEmbauche || '');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return dateEmbauche > thirtyDaysAgo;
      }).length,
      parType: {}
    };

    // Calcul par type
    employes.forEach(employe => {
      stats.parType[employe.typeUtilisateurId] = (stats.parType[employe.typeUtilisateurId] || 0) + 1;
    });

    this.statsSubject.next(stats);
  }

  private refreshEmployes(): void {
    const current = this.employesSubject.value;
    this.getEmployes().subscribe();
  }

  // Méthodes utilitaires
  exportEmployesToExcel(employes: Employe[]): void {
    const data = employes.map(emp => ({
      'Nom': emp.nom,
      'Prénom': emp.prenom,
      'Email': emp.email,
      'Téléphone': emp.telephone,
      'Type': emp.typeUtilisateurLabel,
      'Statut': emp.statut,
      'Date d\'embauche': emp.dateEmbauche,
      'Salaire': emp.salaire
    }));

    // Créer un blob et télécharger
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employés');
    XLSX.writeFile(workbook, 'employes.xlsx');
  }

  sendNotification(notification: NotificationEmploye): void {
    // Logique pour envoyer une notification à l'employé
    console.log('Notification envoyée:', notification);
  }
}
