import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '@core/services/notification.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Conge, CongeStats, FiltreConge, CongeFormData, NotificationConge } from '../model/conges.model';

@Injectable({
  providedIn: 'root'
})
export class CongesService {
  private congesSubject = new BehaviorSubject<Conge[]>([]);
  private statsSubject = new BehaviorSubject<CongeStats>({
    totalEmployes: 0,
    totalConges: 0,
    congesValidesCeMois: 0,
    congesEnAttente: 0,
    soldeConges: 0,
    parType: {},
    parStatut: {}
  });

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  getConges(filtre?: FiltreConge): Observable<Conge[]> {
    return this.apiService.getConges().pipe(
      map((conges: any[]) => {
        let filteredConges = conges.map(conge => this.mapToConge(conge));
        
        if (filtre) {
          filteredConges = this.filtrerConges(filteredConges, filtre);
        }
        
        this.congesSubject.next(filteredConges);
        this.updateStats(filteredConges);
        return filteredConges;
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors du chargement des congés', 'Fermer', { duration: 3000 });
        return of([]);
      })
    );
  }

  getCongeById(id: string): Observable<Conge | null> {
    return this.apiService.getConges().pipe(
      map((conges: any[]) => {
        const conge = conges.find(c => (c.id || c.Id) === id);
        return conge ? this.mapToConge(conge) : null;
      }),
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement du congé', 'Fermer', { duration: 3000 });
        return of(null);
      })
    );
  }

  createConge(formData: CongeFormData): Observable<Conge> {
    return this.apiService.createConge(formData).pipe(
      map((conge: any) => this.mapToConge(conge)),
      tap(() => {
        this.snackBar.open('Congé créé avec succès', 'Fermer', { duration: 3000 });
        this.refreshConges();
        this.notificationService.addNotification({
          type: 'success',
          titre: 'Nouvelle demande de congé',
          message: `La demande de congé pour ${formData.motif} a été soumise avec succès.`,
          congeId: formData.utilisateurId
        });
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la création du congé', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  updateConge(id: string, formData: Partial<CongeFormData>): Observable<Conge> {
    return this.apiService.updateConge(id, formData).pipe(
      map((conge: any) => this.mapToConge(conge)),
      tap(() => {
        this.snackBar.open('Congé mis à jour avec succès', 'Fermer', { duration: 3000 });
        this.refreshConges();
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la mise à jour du congé', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  deleteConge(id: string): Observable<void> {
    return this.apiService.deleteConge(id).pipe(
      tap(() => {
        this.snackBar.open('Congé supprimé avec succès', 'Fermer', { duration: 3000 });
        this.refreshConges();
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la suppression du congé', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  validerConge(id: string): Observable<Conge> {
    return this.apiService.validerConge(id).pipe(
      map((conge: any) => this.mapToConge(conge)),
      tap(() => {
        this.snackBar.open('Congé validé avec succès', 'Fermer', { duration: 3000 });
        this.refreshConges();
        this.notificationService.addNotification({
          type: 'success',
          titre: 'Congé validé',
          message: `Le congé a été validé avec succès.`,
          congeId: id
        });
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors de la validation du congé', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  refuserConge(id: string, motif: string): Observable<Conge> {
    return this.apiService.refuserConge(id, motif).pipe(
      map((conge: any) => this.mapToConge(conge)),
      tap(() => {
        this.snackBar.open('Congé refusé avec succès', 'Fermer', { duration: 3000 });
        this.refreshConges();
        this.notificationService.addNotification({
          type: 'warning',
          titre: 'Congé refusé',
          message: `Le congé a été refusé pour le motif suivant: ${motif}`,
          congeId: id
        });
      }),
      catchError((error) => {
        this.snackBar.open('Erreur lors du refus du congé', 'Fermer', { duration: 3000 });
        throw error;
      })
    );
  }

  // BehaviorSubjects pour les composants
  get conges$() {
    return this.congesSubject.asObservable();
  }

  get stats$() {
    return this.statsSubject.asObservable();
  }

  private mapToConge(data: any): Conge {
    return {
      id: data.id || data.Id,
      utilisateurId: data.utilisateurId || data.UtilisateurId,
      utilisateurNom: data.utilisateurNom || data.UtilisateurNom,
      typeNom: data.typeNom || data.TypeNom,
      typePointageId: data.typePointageId || data.TypePointageId,
      dateDebut: data.dateDebut || data.DateDebut,
      dateFin: data.dateFin || data.DateFin,
      nombreJours: data.nombreJours || data.NombreJours,
      motif: data.motif || data.Motif,
      status: data.status || data.Statut || 'en_attente',
      justificatif: data.justificatif || data.Justificatif,
      dateDemande: data.dateDemande || data.DateDemande,
      dateValidation: data.dateValidation || data.DateValidation
    };
  }

  private filtrerConges(conges: Conge[], filtre: FiltreConge): Conge[] {
    return conges.filter(conge => {
      let matches = true;

      if (filtre.utilisateurId) {
        matches = matches && conge.utilisateurId === filtre.utilisateurId;
      }

      if (filtre.typeConge) {
        matches = matches && conge.typeNom === filtre.typeConge;
      }

      if (filtre.statut) {
        matches = matches && conge.status === filtre.statut;
      }

      if (filtre.recherche) {
        const recherche = filtre.recherche.toLowerCase();
        matches = matches && (
          conge.motif.toLowerCase().includes(recherche) ||
          conge.utilisateurNom.toLowerCase().includes(recherche)
        );
      }

      if (filtre.periode) {
        matches = matches && this.congeDansPeriode(conge, filtre.periode);
      }

      return matches;
    });
  }

  private congeDansPeriode(conge: Conge, periode: { debut: string; fin: string }): boolean {
    const congeDebut = new Date(conge.dateDebut);
    const congeFin = new Date(conge.dateFin);
    const periodeDebut = new Date(periode.debut);
    const periodeFin = new Date(periode.fin);
    
    return congeDebut >= periodeDebut && congeFin <= periodeFin;
  }

  private updateStats(conges: Conge[]): void {
    const stats: CongeStats = {
      totalEmployes: [...new Set(conges.map(c => c.utilisateurId))].length,
      totalConges: conges.length,
      congesValidesCeMois: conges.filter(c => c.status === 'valide').length,
      congesEnAttente: conges.filter(c => c.status === 'en_attente').length,
      soldeConges: this.calculateSoldeConges(conges),
      parType: {},
      parStatut: {}
    };

    // Calcul par type
    conges.forEach(conge => {
      stats.parType[conge.typeNom] = (stats.parType[conge.typeNom] || 0) + 1;
      stats.parStatut[conge.status] = (stats.parStatut[conge.status] || 0) + 1;
    });

    this.statsSubject.next(stats);
  }

  private calculateSoldeConges(conges: Conge[]): number {
    return conges.reduce((total, conge) => {
      if (conge.status === 'valide') {
        return total + conge.nombreJours;
      }
      return total;
    }, 0);
  }

  private refreshConges(): void {
    this.getConges().subscribe();
  }
}
