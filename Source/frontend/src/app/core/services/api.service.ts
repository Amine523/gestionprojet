import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import emailjs from '@emailjs/browser';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public baseUrl = 'http://localhost:5221/api';
  private tokenKey = 'app_token';
  private permissionsKey = 'app_permissions';

  constructor(private http: HttpClient) { }

  getRawStorage(): any {

    const data = localStorage.getItem("app_data");
    return data ? JSON.parse(data) : {};
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };
    if (token && token.split('.').length === 3) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, { headers: this.getHeaders() });
  }

  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, data, { headers: this.getHeaders() });
  }

  put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, data, { headers: this.getHeaders() });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, { headers: this.getHeaders() });
  }

  setToken(token: string): void { localStorage.setItem(this.tokenKey, token); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('utilisateur');
    localStorage.removeItem(this.permissionsKey);
    localStorage.removeItem('selectedOffre');
  }
  isLoggedIn(): boolean { return !!this.getToken(); }
  getCurrentUser(): any { 
    const userJson = localStorage.getItem('utilisateur'); 
    if (!userJson) return null;
    try {
      const user = JSON.parse(userJson);
      // Normalisation globale pour éviter les problèmes de casse
      if (user) {
        if (user.Id && !user.id) user.id = user.Id;
        if (user.id && !user.Id) user.Id = user.id;
        if (user.SocieteId && !user.societeId) user.societeId = user.SocieteId;
        if (user.societeId && !user.SocieteId) user.SocieteId = user.societeId;
        if (user.TypeUtilisateurId && !user.typeUtilisateurId) user.typeUtilisateurId = user.TypeUtilisateurId;
        if (user.typeUtilisateurId && !user.TypeUtilisateurId) user.TypeUtilisateurId = user.typeUtilisateurId;
      }
      return user;
    } catch (e) {
      console.error('ApiService - Erreur parsing utilisateur:', e);
      return null;
    }
  }

  getCurrentUserId(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    return user.id || user.Id || user.utilisateurId || user.UtilisateurId || '';
  }

  getCurrentSocieteId(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    return user.societeId || user.SocieteId || '';
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    const role = (user?.typeUtilisateurId || user?.TypeUtilisateurId || user?.typeUtilisateur?.id || 'candidat').toLowerCase();
    console.log('ApiService.getUserRole - Rôle détecté:', role, 'User:', user);
    return role;
  }
  setPermissions(perms: string[]): void { localStorage.setItem(this.permissionsKey, JSON.stringify(perms)); }
  getPermissions(): string[] { const perms = localStorage.getItem(this.permissionsKey); return perms ? JSON.parse(perms) : []; }
  hasPermission(perm: string): boolean { return this.getPermissions().includes(perm); }

  setUserPreference(key: string, value: any): void {
    const user = this.getCurrentUser();
    if (user) localStorage.setItem(`pref_${user.id || user.utilisateurId}_${key}`, JSON.stringify(value));
  }

  getUserPreference(key: string): Observable<any> {
    const user = this.getCurrentUser();
    if (user) {
      const val = localStorage.getItem(`pref_${user.id || user.utilisateurId}_${key}`);
      return of(val ? JSON.parse(val) : null);
    }
    return of(null);
  }

  getPermissionsByRole(typeUtilisateurId: string): string[] {
    const rolePermissions: { [key: string]: string[] } = {
      'superadmin': ['all'], 't001': ['all'],
      'admin_societe': ['admin', 'users', 'projets', 'rh', 'paiements', 'parametres'], 't002': ['admin', 'users', 'projets', 'rh', 'paiements', 'parametres'],
      'rh': ['rh', 'employes', 'conges', 'recrutement', 'pointage'], 't003': ['rh', 'employes', 'conges', 'recrutement', 'pointage'],
      'chef_projet': ['chef', 'projets', 'taches', 'equipe', 'suivi', 'rapports'], 't004': ['chef', 'projets', 'taches', 'equipe', 'suivi', 'rapports'],
      'developpeur': ['dev', 'taches', 'projets', 'time', 'docs'], 't005': ['dev', 'taches', 'projets', 'time', 'docs'],
      'testeur': ['qa', 'tests', 'bugs', 'plans', 'rapports'], 't006': ['qa', 'tests', 'bugs', 'plans', 'rapports'],
      'candidat': ['user'], 't007': ['user']
    };
    return rolePermissions[typeUtilisateurId.toLowerCase()] || ['user'];
  }

  // Dashboard & Stats
  getDashboardStats(): Observable<any> { return this.http.get(`${this.baseUrl}/dashboard/stats`, { headers: this.getHeaders() }); }
  getSocieteStats(societeId: string): Observable<any> { return this.http.get(`${this.baseUrl}/dashboard/stats/societe/${societeId}`, { headers: this.getHeaders() }); }
  getProjectsProgress(societeId: string): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/projects/progress/${societeId}`, { headers: this.getHeaders() }); }
  getTachesDistribution(societeId: string): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/taches/distribution/${societeId}`, { headers: this.getHeaders() }); }
  getAttendanceTrends(societeId: string): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/attendance/trends/${societeId}`, { headers: this.getHeaders() }); }
  getRevenus(filter = 'month'): Observable<any> { return this.http.get(`${this.baseUrl}/dashboard/revenus?filter=${filter}`, { headers: this.getHeaders() }); }
  getUtilisateursParType(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/utilisateurs-par-type`, { headers: this.getHeaders() }); }
  getSocietesParMois(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/societes-par-mois`, { headers: this.getHeaders() }); }
  getSocietesRecentes(limit = 5): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/societes-recentes?limit=${limit}`, { headers: this.getHeaders() }); }
  getAbonnementsStats(): Observable<any> { return this.http.get(`${this.baseUrl}/dashboard/abonnements-stats`, { headers: this.getHeaders() }); }
  getActiviteRecente(limit = 10, societeId?: string): Observable<any[]> {
    let url = `${this.baseUrl}/dashboard/activite-recente?limit=${limit}`;
    if (societeId) url += `&societeId=${societeId}`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }
  getUptime(): Observable<any> { return this.http.get(`${this.baseUrl}/dashboard/uptime`, { headers: this.getHeaders() }); }
  getAlertes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/alertes`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }

  // Societes
  getSocietes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/societes`, { headers: this.getHeaders() }); }
  getSocieteById(id: string): Observable<any> { return this.http.get(`${this.baseUrl}/societes/obtenir/id/${id}`, { headers: this.getHeaders() }); }
  getSocietesPage(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/societes/ListeParPage?pageNumero=${page}&pageTaille=${size}`, { headers: this.getHeaders() });
  }
  createSociete(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Adresse: data.adresse || data.Adresse || '',
      Email: data.email || data.Email || '',
      Telephone: data.telephone || data.Telephone || '',
      Logo: data.logo || data.Logo || '',
      PlanAbonnement: data.planAbonnement || data.PlanAbonnement || '',
      Actif: data.actif !== undefined ? data.actif : data.Actif
    };
    return this.http.post(`${this.baseUrl}/societes/ajouter`, payload, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  updateSociete(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Adresse: data.adresse || data.Adresse || '',
      Email: data.email || data.Email || '',
      Ville: data.ville || data.Ville || '',
      Pays: data.pays || data.Pays || '',
      PlanAbonnement: data.planAbonnement || data.PlanAbonnement || '',
      Actif: data.actif !== undefined ? data.actif : data.Actif
    };
    return this.http.put(`${this.baseUrl}/societes/modifier`, payload, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  deleteSociete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/societes/supprimer/id/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  updateSocieteModules(id: string, modules: string): Observable<any> { return this.http.put(`${this.baseUrl}/societes/${id}/modules`, { enabledModules: modules }, { headers: this.getHeaders() }); }

  // Utilisateurs
  getUtilisateurs(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/utilisateurs/liste`, { headers: this.getHeaders() }); }
  getUtilisateursPage(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/utilisateurs/liste-par-page/${page}/${size}`, { headers: this.getHeaders() });
  }
  getUtilisateursByConditionPage(page: number, size: number, condition: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/utilisateurs/liste-par-condition-par-page/${page}/${size}`, condition, { headers: this.getHeaders() });
  }
  createUtilisateur(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Email: data.email || data.Email || '',
      MotDePasse: data.motDePasse || data.MotDePasse || data.password || '123456',
      Cv: data.cv || data.Cv || '',
      TypeUtilisateurId: data.typeUtilisateurId || data.TypeUtilisateurId || 'T005',
      SocieteId: data.societeId || data.SocieteId || '',
      RoleId: data.roleId || data.RoleId || 'R001',
      Actif: data.actif !== undefined ? data.actif : (data.Actif !== undefined ? data.Actif : true)
    };
    return this.http.post(`${this.baseUrl}/utilisateurs/ajouter`, payload, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  updateUtilisateur(id: string, data: any): Observable<any> {
    const payload = {
      Id: id || data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Email: data.email || data.Email || '',
      MotDePasse: data.motDePasse || data.MotDePasse || '',
      Telephone: data.telephone || data.Telephone || '',
      Poste: data.poste || data.Poste || '',
      Departement: data.departement || data.Departement || '',
      Contrat: data.contrat || data.Contrat || '',
      TypeUtilisateurId: data.typeUtilisateurId || data.TypeUtilisateurId || 'T005',
      SocieteId: data.societeId || data.SocieteId || '',
      Actif: data.actif !== undefined ? data.actif : (data.Actif !== undefined ? data.Actif : true),
      RoleId: data.roleId || data.RoleId || 'R001'
    };
    return this.http.put(`${this.baseUrl}/utilisateurs/modifier`, payload, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  deleteUtilisateur(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/utilisateurs/supprimer/id/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  getEmployesBySociete(societeId: string): Observable<any[]> {
    const critere = { Criteres: { 'SocieteId': societeId.toString() } };
    return this.http.post<any>(`${this.baseUrl}/utilisateurs/liste-par-condition`, critere, { headers: this.getHeaders() })
      .pipe(map(res => res?.value ? res.value : (Array.isArray(res) ? res : [])));
  }

  // Projets & Taches
  getProjets(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/projets`, { headers: this.getHeaders() }); }
  getProjetsPage(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/projets/liste-par-page/${page}/${size}`, { headers: this.getHeaders() });
  }
  getProjetsByConditionPage(page: number, size: number, condition: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/projets/liste-par-condition-par-page/${page}/${size}`, condition, { headers: this.getHeaders() });
  }
  private normalizeProjet(data: any): any {
    return {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Description: data.description || data.Description || '',
      Status: data.status || data.Status || data.statut || 'En attente',
      StartDate: data.startDate || data.StartDate || data.dateDebut || null,
      EndDate: data.endDate || data.EndDate || data.dateFin || null,
      SocieteId: data.societeId || data.SocieteId || '',
      UtilisateurId: data.utilisateurId || data.UtilisateurId || data.chef || '',
      NomClient: data.nomClient || data.NomClient || '',
      Avancee: data.avancee ?? data.Avancee ?? 0
    };
  }
  saveProjet(data: any): Observable<any> {
    const payload = this.normalizeProjet(data);
    return payload.Id
      ? this.http.put(`${this.baseUrl}/projets/modifier`, payload, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      : this.http.post(`${this.baseUrl}/projets/ajouter`, payload, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }
  createProjet(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/projets/ajouter`, this.normalizeProjet(data), {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  updateProjet(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/projets/modifier`, this.normalizeProjet(data), {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  deleteProjet(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projets/supprimer/id/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  addMembreAuProjet(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/membresdeprojet`, data, { headers: this.getHeaders() }); }
  getBurndown(id: string): Observable<any> { return this.http.get(`${this.baseUrl}/projets/${id}/burndown`, { headers: this.getHeaders() }); }
  getProjetsBySociete(societeId: string): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/projets/ParSociete/${societeId}`, { headers: this.getHeaders() }); }
  getTaches(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/taches/liste`, { headers: this.getHeaders() }); }
  getTachesBySociete(societeId: string): Observable<any[]> {
    const critere = { Criteres: { 'SocieteId': societeId } };
    return this.http.post<any[]>(`${this.baseUrl}/taches/liste-par-condition`, critere, { headers: this.getHeaders() });
  }
  saveTache(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Titre: data.titre || data.Titre || data.nom || '',
      Description: data.description || data.Description || '',
      Statut: data.statut || data.Statut || data.status || data.Status || 'To Do',
      Priorite: data.priorite || data.Priorite || 'Medium',
      ProjetId: data.projetId || data.ProjetId || '',
      // UtilisateurId: handled separately via TacheAssignation — stored proc doesn't accept it
      DevComment: data.devComment || data.DevComment || '',
      TestComment: data.testComment || data.TestComment || '',
      DateLimite: data.dateFin || data.DateFin || data.dateLimite || data.DateLimite || null,
      TempsEstime: data.tempsEstime || data.TempsEstime || null,
      TempsReel: data.tempsReel || data.TempsReel || null,
      Actif: true
    };
    const isUpdate = !!payload.Id;
    return isUpdate
      ? this.http.put(`${this.baseUrl}/taches/modifier`, payload, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      : this.http.post(`${this.baseUrl}/taches/ajouter`, payload, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }

  /** Assigner une tâche à un utilisateur via la table TacheAssignation */
  assignerTache(tacheId: string, utilisateurId: string): Observable<any> {
    const payload = {
      Id: '',
      TacheId: tacheId,
      UtilisateurId: utilisateurId,
      Actif: true
    };
    return this.http.post(`${this.baseUrl}/taches/assigner`, payload, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }

  /** Récupérer les tâches assignées à un utilisateur spécifique */
  getTachesParUtilisateur(utilisateurId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/taches/par-utilisateur/${utilisateurId}`, { headers: this.getHeaders() }).pipe(catchError(() => of([])));
  }

  // RH & Pointage
  clockIn(uId: string, sId: string, type = 'NORMAL', note?: string): Observable<any> {
    const payload = {
      utilisateurId: uId,
      societeId: sId,
      date: new Date().toISOString(),
      typeId: type,
      note: note || ''
    };
    return this.http.post(`${this.baseUrl}/rh/enhanced/clock-in`, payload, { headers: this.getHeaders() });
  }

  clockOut(uId: string, sId: string, note?: string, id?: string): Observable<any> {
    const payload = {
      utilisateurId: uId,
      societeId: sId,
      pointageId: id,
      note: note || ''
    };
    return this.http.post(`${this.baseUrl}/rh/enhanced/clock-out`, payload, { headers: this.getHeaders() });
  }
  getPointages(uId?: string): Observable<any[]> {
    if (uId) {
      const critere = { Criteres: { 'UtilisateurId': uId } };
      return this.http.post<any[]>(`${this.baseUrl}/pointage/liste-par-condition`, critere, { headers: this.getHeaders() }).pipe(catchError(() => of([])));
    }
    return this.http.get<any[]>(`${this.baseUrl}/pointage`, { headers: this.getHeaders() }).pipe(catchError(() => of([])));
  }
  updatePointage(data: any): Observable<any> {
    let he = data.heureEntree || data.HeureEntree || null;
    if (he && he.length === 5) he += ':00';
    let hs = data.heureSortie || data.HeureSortie || null;
    if (hs && hs.length === 5) hs += ':00';

    const payload = {
      Id: data.id || data.Id || '',
      UtilisateurId: data.utilisateurId || data.UtilisateurId || '',
      TypeId: data.typePointageId || data.TypePointageId || data.typeId || data.TypeId || '',
      Date: data.date || data.Date || data.dateEntree || data.DateEntree || null,
      HeureEntree: he,
      HeureSortie: hs,
      Duree: data.duree || data.Duree || null,
      Note: data.note || data.Note || ''
    };
    return this.http.put(`${this.baseUrl}/pointage/modifier`, payload, { headers: this.getHeaders() });
  }
  createPointage(data: any): Observable<any> {
    const now = new Date();
    const payload = {
      UtilisateurId: data.utilisateurId || data.UtilisateurId || '',
      TypeId: data.typePointageId || data.TypePointageId || data.typeId || data.TypeId || 'NORMAL',
      Date: data.date || data.Date || data.dateEntree || data.DateEntree || now.toISOString().split('T')[0],
      HeureEntree: data.heureEntree || data.HeureEntree || `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
      HeureSortie: data.heureSortie || data.HeureSortie || null,
      Duree: data.duree || data.Duree || null,
      Note: data.note || data.Note || '',
      Actif: true
    };
    console.log('Pointage payload:', payload);
    return this.http.post(`${this.baseUrl}/pointage/ajouter`, payload, { headers: this.getHeaders() });
  }

  // RH & Monitoring
  getRHStats(sId: string, date?: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Dashboard/rh-stats/${sId}?date=${date || ''}`, { headers: this.getHeaders() }).pipe(catchError(() => of({ totalEmployes: 0, employesActifs: 0, employesAbsents: 0, tauxPresence: 0, congesValidesCeMois: 0, demandesCongesEnAttente: 0 })));
  }
  getDemandesEnAttenteReal(sId: string): Observable<any[]> {
    const targetSocieteId = (sId || this.getCurrentSocieteId() || '').toString();
    
    return forkJoin({
      demandes: this.getDemandesConge(),
      employes: targetSocieteId ? this.getEmployesBySociete(targetSocieteId) : of([])
    }).pipe(
      map(({ demandes, employes }) => {
        const employeMap = new Map(employes.map((e: any) => [e.id || e.Id, e]));
        return demandes.filter((d: any) => {
          const uId = d.utilisateurId || d.UtilisateurId;
          const dSocieteId = (d.societeId || d.SocieteId || '').toString();

          // Since SocieteId is missing from DemandeConge DB table, we rely on the employee list
          const matchesSociete = !targetSocieteId || (dSocieteId === targetSocieteId) || (dSocieteId.toLowerCase() === targetSocieteId.toLowerCase()) || employeMap.has(uId);

          return matchesSociete;
        }).map((d: any) => {
          const uId = d.utilisateurId || d.UtilisateurId;
          const emp = employeMap.get(uId);
          if (emp) {
            d.utilisateurNom = `${emp.prenom || ''} ${emp.nom || ''}`.trim() || emp.Nom;
          }
          const dDebut = new Date(d.dateDebut || d.DateDebut);
          const dFin = new Date(d.dateFin || d.DateFin);
          if (!d.jours && !d.Jours && !isNaN(dDebut.getTime()) && !isNaN(dFin.getTime())) {
            const diffTime = Math.abs(dFin.getTime() - dDebut.getTime());
            d.jours = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
          }
          return d;
        });
      }),
      catchError(err => {
        console.error('ApiService - Erreur getDemandesEnAttenteReal:', err);
        return of([]);
      })
    );
  }
  validerDemandeCongeReal(id: string, adminId: string, accepted: boolean): Observable<any> {
    const status = accepted ? 'Validée' : 'Refusée';
    return this.updateDemandeConge({ id, status, valideParId: adminId });
  }
  getRapportPresenceUrl(sId: string, m: number, a: number, f: string = 'pdf'): string { return `${this.baseUrl}/pointage/rapport?societeId=${sId}&mois=${m}&annee=${a}&format=${f}`; }
  getRapportPresence(sId: string, m: number, a: number): Observable<Blob> { return this.http.get(`${this.baseUrl}/pointage/rapport-file?societeId=${sId}&mois=${m}&annee=${a}`, { responseType: 'blob', headers: this.getHeaders() }); }
  getWorkedHoursReal(uId: string, date?: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rh/enhanced/utilisateur/${uId}/heures-travaillees?date=${date || ''}`, { headers: this.getHeaders() });
  }
  getSoldeConge(uId: string): Observable<any> { return this.http.get(`${this.baseUrl}/DemandesConge/solde/${uId}`, { headers: this.getHeaders() }); }
  createDemandeCongeReal(data: any): Observable<any> {
    const payload = {
      UtilisateurId: data.utilisateurId || data.UtilisateurId || this.getCurrentUserId(),
      SocieteId: data.societeId || data.SocieteId || this.getCurrentSocieteId(),
      TypePointageId: data.typePointageId || data.TypePointageId || 'NORMAL',
      DateDebut: data.dateDebut || data.DateDebut,
      DateFin: data.dateFin || data.DateFin,
      Status: data.status || data.Status || 'En_attente',
      Motif: data.motif || data.Motif || '',
      AvecCertificat: data.avecCertificat || data.AvecCertificat || false,
      Jours: data.jours || data.Jours || 0,
      DateCreation: new Date().toISOString()
    };
    return this.http.post(`${this.baseUrl}/DemandesConge`, payload, { headers: this.getHeaders() });
  }
  private getHeadersWithMultipart(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    const headers: { [key: string]: string } = {}; // No Content-Type for FormData
    if (token && token.split('.').length === 3) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  uploadJustificatif(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('referenceId', id);
    formData.append('type', 'JustificatifConge');
    return this.http.post(`${this.baseUrl}/attachement/upload`, formData, { headers: this.getHeadersWithMultipart() });
  }

  // Demandes de Congé
  getDemandesConge(): Observable<any[]> { return this.http.get<any>(`${this.baseUrl}/DemandesConge`, { headers: this.getHeaders() }).pipe(map(res => res?.value ? res.value : (Array.isArray(res) ? res : [])), catchError(() => of([]))); }
  getDemandesCongeBySociete(sId: string): Observable<any[]> { return this.http.get<any>(`${this.baseUrl}/DemandesConge/societe/${sId}`, { headers: this.getHeaders() }).pipe(map(res => res?.value ? res.value : (Array.isArray(res) ? res : [])), catchError(() => of([]))); }
  getDemandesCongeByUtilisateur(uId: string): Observable<any[]> { return this.http.get<any>(`${this.baseUrl}/DemandesConge/utilisateur/${uId}`, { headers: this.getHeaders() }).pipe(map(res => res?.value ? res.value : (Array.isArray(res) ? res : [])), catchError(() => of([]))); }
  createDemandeConge(data: any): Observable<any> {
    const payload = {
      UtilisateurId: data.utilisateurId || data.UtilisateurId || '',
      SocieteId: data.societeId || data.SocieteId || '',
      TypePointageId: data.typePointageId || data.TypePointageId || '',
      DateDebut: data.dateDebut || data.DateDebut || null,
      DateFin: data.dateFin || data.DateFin || null,
      Status: data.status || data.Status || 'En_attente',
      Motif: data.motif || data.Motif || '',
      AvecCertificat: data.avecCertificat ?? data.AvecCertificat ?? false,
      Jours: data.jours || data.Jours || 0
    };
    return this.http.post(`${this.baseUrl}/DemandesConge`, payload, { headers: this.getHeaders() });
  }
  updateDemandeConge(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      UtilisateurId: data.utilisateurId || data.UtilisateurId || '',
      SocieteId: data.societeId || data.SocieteId || '',
      TypePointageId: data.typePointageId || data.TypePointageId || '',
      DateDebut: data.dateDebut || data.DateDebut || null,
      DateFin: data.dateFin || data.DateFin || null,
      Status: data.status || data.Status || 'En_attente',
      Motif: data.motif || data.Motif || '',
      AvecCertificat: data.avecCertificat ?? data.AvecCertificat ?? false,
      Jours: data.jours || data.Jours || 0,
      ValideParId: data.valideParId || data.ValideParId || ''
    };
    return this.http.put(`${this.baseUrl}/DemandesConge`, payload, { headers: this.getHeaders() });
  }
  deleteDemandeConge(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/DemandesConge/${id}`, { headers: this.getHeaders() }); }

  // Recrutement
  getOffresEmploi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/OffreEmploI/liste`, { headers: this.getHeaders() }).pipe(catchError(() => of([])));
  }
  saveOffreEmploi(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Titre: data.titre || data.Titre || '',
      Description: data.description || data.Description || '',
      Poste: data.poste || data.Poste || '',
      Lieu: data.lieu || data.Lieu || '',
      Salaire: data.salaire || data.Salaire || '',
      Quiz: data.quiz || data.Quiz || '',
      SocieteId: data.societeId || data.SocieteId || '',
      Statut: data.statut || data.Statut || 'Ouvert',
      Actif: data.actif !== undefined ? data.actif : true
    };

    if (!payload.Id) {
      return this.http.post(`${this.baseUrl}/OffreEmploI/ajouter`, payload, { headers: this.getHeaders() });
    }
    return this.http.put(`${this.baseUrl}/OffreEmploI/modifier`, payload, { headers: this.getHeaders() });
  }
  deleteOffreEmploi(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/OffreEmploI/supprimer/id/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  getCandidatures(): Observable<any[]> {
    const critere = { Criteres: { 'Type': 'Candidature' } };
    return this.http.post<any[]>(`${this.baseUrl}/application/liste-par-condition`, critere, { headers: this.getHeaders() }).pipe(catchError(() => of([])));
  }
  getCandidaturesBySociete(societeId: string): Observable<any[]> {
    const critere = { Criteres: { 'SocieteId': societeId, 'Type': 'Candidature' } };
    return this.http.post<any[]>(`${this.baseUrl}/application/liste-par-condition`, critere, { headers: this.getHeaders() }).pipe(catchError(() => of([])));
  }
  deleteCandidature(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/application/supprimer/id/${id}`, { headers: this.getHeaders() }); }
  clearCandidatures(): void {
    const critere = { Criteres: { 'Type': 'Candidature' } };
    this.http.post(`${this.baseUrl}/application/supprimer-par-condition`, critere, { headers: this.getHeaders() }).subscribe();
  }
  convertCandidatToEmploye(id: string): Observable<any> {
    // This might need a specialized endpoint or a sequence of calls
    return this.http.post(`${this.baseUrl}/utilisateurs/ajouter`, { fromCandidatId: id }, { headers: this.getHeaders() });
  }
  setOffreEmploiTemp(o: any): void { localStorage.setItem('selectedOffre', JSON.stringify(o)); }
  getOffreEmploiTemp(): any { const d = localStorage.getItem('selectedOffre'); return d ? JSON.parse(d) : null; }
  saveCandidature(c: any): Observable<any> {
    const payload = {
      Id: c.id || c.Id || '',
      UtilisateurId: c.utilisateurId || c.UtilisateurId || '',
      SocieteId: c.societeId || c.SocieteId || '',
      OffreId: c.offreId || c.OffreId || '',
      Titre: c.titre || c.Titre || '',
      Statut: c.statut || c.Statut || 'Nouveau',
      Type: 'Candidature',
      Actif: true
    };
    return this.http.post(`${this.baseUrl}/application/ajouter`, payload, { headers: this.getHeaders() });
  }
  updateCandidature(c: any): Observable<any> {
    const payload = {
      Id: c.id || c.Id || '',
      Statut: c.statut || c.Statut || '',
      Quiz: c.quiz || c.Quiz || '',
      // ... other fields
    };
    return this.http.put(`${this.baseUrl}/application/modifier`, payload, { headers: this.getHeaders() });
  }
  getCandidaturesByCandidat(id: string): Observable<any[]> {
    const critere = { Criteres: { 'UtilisateurId': id } };
    return this.http.post<any[]>(`${this.baseUrl}/application/liste-par-condition`, critere, { headers: this.getHeaders() });
  }
  updateCandidatureStatus(id: string, status: string, score?: number, total?: number): Observable<any> {
    const payload = { Id: id, Statut: status, Quiz: score !== undefined ? `${score}/${total}` : '' };
    return this.http.put(`${this.baseUrl}/application/modifier`, payload, { headers: this.getHeaders() });
  }

  // New Recrutement Methods
  postulerForm(formData: FormData): Observable<any> {
    let headers = new HttpHeaders();
    const token = this.getToken();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/recrutement/postuler`, formData, { headers });
  }

  getQuizQuestionsBackend(quizName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recrutement/questions/${quizName}`, { headers: this.getHeaders() });
  }

  validateQuizBackend(applicationId: string, quizName: string, reponses: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/recrutement/valider-quiz`, { applicationId, quizName, reponses }, { headers: this.getHeaders() });
  }

  // Security & Logs
  getConnectionLogs(limit = 50): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/logs/connexions?limit=${limit}`, { headers: this.getHeaders() }); }
  getApiLogs(limit = 100): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/logs/api?limit=${limit}`, { headers: this.getHeaders() }); }
  getAnomalies(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/logs/anomalies`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  getBlockedIps(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/blocked-ips`, { headers: this.getHeaders() }); }
  blockIp(d: any): Observable<any> { return this.http.post(`${this.baseUrl}/blocked-ips`, d, { headers: this.getHeaders() }); }
  unblockIp(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/blocked-ips/${id}`, { headers: this.getHeaders() }); }

  // Auth
  login(e: string, p: string): Observable<any> { return this.http.post(`${this.baseUrl}/auth/login`, { email: e, password: p }); }
  registerCandidate(d: any): Observable<any> { return this.http.post(`${this.baseUrl}/auth/register-candidate`, d); }

  // Email & Notifications
  getNotifications(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/notifications`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  createNotification(sId: string, type: string, titre: string, msg: string, uId?: string): void {
    const url = uId ? `${this.baseUrl}/notifications/send-to-user` : `${this.baseUrl}/notifications/send-to-societe`;
    const payload = uId
      ? { userId: uId, title: titre, message: msg, type: type }
      : { societeId: sId, title: titre, message: msg, type: type };

    this.http.post(url, payload, { headers: this.getHeaders() }).subscribe({
      error: (err) => console.error('Failed to create notification', err)
    });
  }
  sendTestEmail(e: string): Observable<any> { return this.http.post(`${this.baseUrl}/email/test`, { toEmail: e }, { headers: this.getHeaders() }); }
  sendEmailNotification(type: string, data: any): void { this.http.post(`${this.baseUrl}/email/${type}`, data, { headers: this.getHeaders() }).subscribe(); }

  // Others
  getRoles(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/typeutilisateurs`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  getAbonnements(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/abonnements`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  createAbonnement(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      SocieteId: data.societeId || data.SocieteId || '',
      TypeAbonnement: data.typeAbonnement || data.TypeAbonnement || '',
      DateDebut: data.dateDebut || data.DateDebut || null,
      DateFin: data.dateFin || data.DateFin || null,
      Actif: data.actif ?? data.Actif ?? true
    };
    return this.http.post(`${this.baseUrl}/abonnements`, payload, { headers: this.getHeaders() });
  }
  getPaiements(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/paiements`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  createPaiement(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      SocieteId: data.societeId || data.SocieteId || '',
      SocieteNom: data.societeNom || data.SocieteNom || '',
      Description: data.description || data.Description || '',
      Montant: data.montant || data.Montant || 0,
      Date: data.date || data.Date || null,
      Statut: data.statut || data.Statut || 'En_attente',
      Type: data.type || data.Type || ''
    };
    return this.http.post(`${this.baseUrl}/paiements`, payload, { headers: this.getHeaders() });
  }
  getExpiringSubscriptions(days: number): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/abonnements/expiring?days=${days}`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  sendNotification(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/notifications`, data, { headers: this.getHeaders() }); }
  getModules(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/module/liste`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  saveModule(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Description: data.description || data.Description || '',
      Icon: data.icon || data.Icon || '',
      Actif: data.actif ?? data.Actif ?? true
    };
    return payload.Id ? this.http.put(`${this.baseUrl}/module/modifier`, payload, { headers: this.getHeaders() }) : this.http.post(`${this.baseUrl}/module/ajouter`, payload, { headers: this.getHeaders() });
  }
  deleteModule(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/module/supprimer/id/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
  sendTestAuthorizationEmail(data: any): Observable<any> {
    const config = this.getEmailJsConfig();
    if (!config || !config.serviceId || !config.publicKey || !config.templates.testAuthorized) {
      return of({ success: false, error: { error: 'Configuration EmailJS incomplète ou manquante' } });
    }
    const params = {
      to_name: data.nom || data.candidatNom,
      to_email: data.email || data.candidatEmail,
      poste: data.poste || 'Candidat',
      societe: data.societe || 'Notre Société',
      lien_test: `http://localhost:4200/applicant/test?token=${data.id}`
    };
    return from(emailjs.send(config.serviceId, config.templates.testAuthorized, params, config.publicKey)
      .then(res => ({ success: true, response: res }))
      .catch(err => ({ success: false, error: err }))
    );
  }

  sendCandidatureRefusedEmail(c: any): Observable<any> {
    const config = this.getEmailJsConfig();
    if (!config || !config.serviceId || !config.publicKey || !config.templates.candidatureRefused) {
      return of({ success: false, error: { error: 'Configuration EmailJS incomplète' } });
    }
    const params = {
      to_name: c.nom || c.candidatNom,
      to_email: c.email || c.candidatEmail,
      poste: c.poste || 'Candidat',
      societe: c.societe || 'Notre Société'
    };
    return from(emailjs.send(config.serviceId, config.templates.candidatureRefused, params, config.publicKey)
      .then(res => ({ success: true, response: res }))
      .catch(err => ({ success: false, error: err }))
    );
  }

  sendCandidatureAcceptedEmail(c: any): Observable<any> {
    const config = this.getEmailJsConfig();
    if (!config || !config.serviceId || !config.publicKey || !config.templates.testAuthorized /* fallback */) {
      return of({ success: false, error: { error: 'Configuration EmailJS incomplète' } });
    }
    const params = {
      to_name: c.nom || c.candidatNom,
      to_email: c.email || c.candidatEmail,
      poste: c.poste || 'Candidat',
      societe: c.societe || 'Notre Société',
      message: 'Félicitations, votre candidature a été acceptée !'
    };
    const template = config.templates.candidatureAccepted || config.templates.testAuthorized;
    return from(emailjs.send(config.serviceId, template, params, config.publicKey)
      .then(res => ({ success: true, response: res }))
      .catch(err => ({ success: false, error: err }))
    );
  }

  initRecrutementData(): void { console.log('[Mock] initRecrutementData - backend endpoint absent'); }
  loadEmailJsConfig(): void { /* Optional: fetch from backend if persisted */ }
  getEmailJsConfig(): any { const c = localStorage.getItem('emailjs_config'); return c ? JSON.parse(c) : { serviceId: '', publicKey: '', templates: { testAuthorized: '', candidatureRefused: '', candidatureAccepted: '' } }; }
  updateEmailJsConfig(c: any): void { localStorage.setItem('emailjs_config', JSON.stringify(c)); }

  chatWithAI(message: string, context: string = ''): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/chat`, { message, context }, { headers: this.getHeaders() });
  }

  // Notifications
  sendNotificationToUser(userId: string, title: string, message: string, type: string = 'info'): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications/send-to-user`, { UserId: userId, Title: title, Message: message, Type: type }, { headers: this.getHeaders() });
  }
  sendNotificationToSociete(societeId: string, title: string, message: string, type: string = 'info'): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications/send-to-societe`, { SocieteId: societeId, Title: title, Message: message, Type: type }, { headers: this.getHeaders() });
  }
  sendNotificationToProject(projectId: string, title: string, message: string, type: string = 'info'): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications/send-to-project`, { ProjectId: projectId, Title: title, Message: message, Type: type }, { headers: this.getHeaders() });
  }
  // Demandes de création de société
  soumettreDemandeSociete(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/DemandeSociete/soumettre`, data);
  }

  getDemandesSociete(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/DemandeSociete/liste`, { headers: this.getHeaders() });
  }

  traiterDemandeSociete(demandeId: string, approuver: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/DemandeSociete/traiter`, { demandeId, approuver }, { headers: this.getHeaders() });
  }
}

