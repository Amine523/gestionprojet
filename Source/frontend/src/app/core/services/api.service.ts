import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from, forkJoin } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import emailjs from '@emailjs/browser';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public userUpdate$ = new Subject<void>();
  public baseUrl = '/api';
  private tokenKey = 'app_token';
  private permissionsKey = 'app_permissions';

  public static readonly ROLES = {
    SUPER_ADMIN: 'T001',
    ADMIN_SOCIETE: 'T002',
    RH: 'T003',
    CHEF_PROJET: 'T004',
    DEVELOPPEUR: 'T005',
    TESTEUR: 'T006',
    QA: 'T006', // Alias
    CANDIDAT: 'T007',
    CLIENT: 'T008'
  };

  static getRoleLabel(id: string): string {
    const roles: any = {
      'T001': 'Super Admin',
      'T002': 'Admin Société',
      'T003': 'RH',
      'T004': 'Chef de Projet',
      'T005': 'Développeur',
      'T006': 'Testeur/QA',
      'T007': 'Candidat',
      'T008': 'Client'
    };
    return roles[id] || id;
  }

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
    return this.http.get<T>(`${this.baseUrl}/${url}`, { headers: this.getHeaders() }).pipe(
      map(data => this.applyPatches(url, data)),
      catchError(err => {
        console.warn(`ApiService.get(${url}) failed, returning local patches only.`, err);
        return of(this.applyPatches(url, []));
      })
    );
  }

  post<T>(url: string, data: any, options: any = {}): Observable<T> {
    this.addPatch(url, data, 'POST');
    return this.http.post<T>(`${this.baseUrl}/${url}`, data, { ...options, headers: this.getHeaders() }) as any;
  }

  put<T>(url: string, data: any, options: any = {}): Observable<T> {
    this.addPatch(url, data, 'PUT');
    return this.http.put<T>(`${this.baseUrl}/${url}`, data, { ...options, headers: this.getHeaders() }) as any;
  }

  delete<T>(url: string, options: any = {}): Observable<T> {
    this.addPatch(url, null, 'DELETE');
    return this.http.delete<T>(`${this.baseUrl}/${url}`, { ...options, headers: this.getHeaders() }) as any;
  }

  private extractEntity(url: string): string {
    if (!url) return 'unknown';
    const entity = url.split('/')[0].toLowerCase();
    // Normalisation des alias pour le système de patch local
    if (entity === 'application') return 'candidatures';
    return entity;
  }

  private addPatch(url: string, data: any, method: 'POST' | 'PUT' | 'DELETE') {
    try {
      const patches = JSON.parse(localStorage.getItem('api_patches') || '{}');
      const entity = this.extractEntity(url);
      if (!patches[entity]) patches[entity] = { upserts: [], deletions: [] };
      
      if (method === 'POST' || method === 'PUT') {
        const id = data?.id || data?.Id;
        if (id) {
          const idx = patches[entity].upserts.findIndex((x: any) => (x.id || x.Id) === id);
          if (idx !== -1) patches[entity].upserts[idx] = { ...patches[entity].upserts[idx], ...data };
          else patches[entity].upserts.push(data);
        }
      } else if (method === 'DELETE') {
        const id = url.split('/').pop();
        if (id) {
          patches[entity].deletions.push(id);
          patches[entity].upserts = patches[entity].upserts.filter((x: any) => (x.id || x.Id) !== id);
        }
      }
      localStorage.setItem('api_patches', JSON.stringify(patches));
    } catch (e) {
      console.warn('ApiService - Erreur lors de la sauvegarde du patch local:', e);
    }
  }

  applyPatches(url: string, serverData: any): any {
    try {
      const patches = JSON.parse(localStorage.getItem('api_patches') || '{}');
      const entity = this.extractEntity(url);
      
      if (!patches[entity]) return serverData;
      
      const applyToArray = (arr: any[]) => {
        let result = [...arr];
        if (patches[entity].upserts) {
          patches[entity].upserts.forEach((u: any) => {
            const idx = result.findIndex(x => (x.id || x.Id) === (u.id || u.Id));
            if (idx !== -1) result[idx] = { ...result[idx], ...u };
            else result.push(u);
          });
        }
        if (patches[entity].deletions) {
          result = result.filter(x => !patches[entity].deletions.includes(x.id || x.Id));
        }
        return result;
      };

      if (Array.isArray(serverData)) {
        return applyToArray(serverData);
      } else if (serverData && typeof serverData === 'object') {
        // Handle paginated results
        if (serverData.items && Array.isArray(serverData.items)) {
          serverData.items = applyToArray(serverData.items);
          if (serverData.totalCount !== undefined) serverData.totalCount = serverData.items.length;
          return serverData;
        }
        if (serverData.value && Array.isArray(serverData.value)) {
          serverData.value = applyToArray(serverData.value);
          return serverData;
        }

        // Single object check
        const id = serverData.id || serverData.Id;
        const patch = patches[entity].upserts.find((x: any) => (x.id || x.Id) === id);
        return patch ? { ...serverData, ...patch } : serverData;
      }
    } catch (e) {
      console.warn('ApiService - Erreur lors de l\'application des patchs locaux:', e);
    }
    return serverData;
  }

  setToken(token: string): void { localStorage.setItem(this.tokenKey, token); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('utilisateur');
    localStorage.removeItem(this.permissionsKey);
    localStorage.removeItem('selectedOffre');
  }
  isLoggedIn(): boolean { 
    const hasToken = !!this.getToken();
    if (!hasToken) return false;

    // Blocage si la société est suspendue (exigence utilisateur)
    const user = this.getCurrentUser();
    if (user && user.typeUtilisateurId !== 'T001') { // Le Super Admin n'est pas bloqué
      const societeId = user.societeId || user.SocieteId;
      if (societeId) {
        try {
          const patches = JSON.parse(localStorage.getItem('api_patches') || '{}');
          if (patches.societes && patches.societes.upserts) {
            const societePatch = patches.societes.upserts.find((s: any) => (s.id || s.Id) === societeId);
            if (societePatch && (societePatch.actif === false || societePatch.Actif === false)) {
              return false;
            }
          }
        } catch (e) {}
      }
    }
    // Blocage si le rôle est désactivé (exigence utilisateur)
    const roleId = user.typeUtilisateurId || user.TypeUtilisateurId;
    if (roleId && roleId !== 'T001') {
      try {
        const patches = JSON.parse(localStorage.getItem('api_patches') || '{}');
        // Les rôles sont stockés sous l'entité 'typeutilisateurs' dans l'API
        if (patches.typeutilisateurs && patches.typeutilisateurs.upserts) {
          const rolePatch = patches.typeutilisateurs.upserts.find((r: any) => (r.id || r.Id) === roleId);
          if (rolePatch && (rolePatch.actif === false || rolePatch.Actif === false)) {
            return false;
          }
        }
      } catch (e) {}
    }

    return true;
  }
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

  updateCurrentUser(data: any): void {
    const user = this.getCurrentUser();
    if (user) {
      const updated = { ...user, ...data };
      localStorage.setItem('utilisateur', JSON.stringify(updated));
      this.userUpdate$.next();
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
  getDashboardStats(): Observable<any> {
    return this.get<any>(`dashboard/stats`);
  }

  getSocieteStats(societeId: string): Observable<any> { return this.get(`dashboard/stats/societe/${societeId}`); }
  getProjectsProgress(societeId: string): Observable<any[]> { return this.get<any[]>(`dashboard/projects/progress/${societeId}`); }
  getTachesDistribution(societeId: string): Observable<any[]> { return this.get<any[]>(`dashboard/taches/distribution/${societeId}`); }
  getAttendanceTrends(societeId: string): Observable<any[]> { return this.get<any[]>(`dashboard/attendance/trends/${societeId}`); }
  getRevenus(filter = 'month'): Observable<any> { return this.get(`dashboard/revenus?filter=${filter}`); }
  
  getUtilisateursParType(): Observable<any[]> {
    return this.getUtilisateurs().pipe(
      map(users => {
        const dist: any = {};
        users.forEach(u => {
          const role = ApiService.getRoleLabel(u.typeUtilisateurId || u.TypeUtilisateurId);
          dist[role] = (dist[role] || 0) + 1;
        });
        return Object.keys(dist).map(k => ({ type: k, count: dist[k] }));
      })
    );
  }

  getSocietesParMois(): Observable<any[]> {
    return this.getSocietes().pipe(
      map(list => {
        // Simuler une croissance basée sur les 5 derniers mois
        return [
          { name: 'Jan', count: Math.max(2, list.length - 8) },
          { name: 'Fev', count: Math.max(5, list.length - 5) },
          { name: 'Mar', count: Math.max(8, list.length - 3) },
          { name: 'Avr', count: Math.max(10, list.length - 1) },
          { name: 'Mai', count: list.length }
        ];
      })
    );
  }
  
  getSocietesRecentes(limit = 5): Observable<any[]> { return this.get<any[]>(`dashboard/societes-recentes?limit=${limit}`); }
  getAbonnementsStats(): Observable<any> { return this.get(`dashboard/abonnements-stats`); }
  getActiviteRecente(limit = 10, societeId?: string): Observable<any[]> {
    let url = `dashboard/activite-recente?limit=${limit}`;
    if (societeId) url += `&societeId=${societeId}`;
    return this.get<any[]>(url);
  }
  getUptime(): Observable<any> { return this.get(`dashboard/uptime`); }
  getAlertes(): Observable<any[]> { return this.get<any[]>(`dashboard/alertes`).pipe(catchError(() => of([]))); }

  // Societes
  getSocietes(): Observable<any[]> { return this.get<any[]>(`societes`); }
  getSocieteById(id: string): Observable<any> { return this.get(`societes/obtenir/id/${id}`); }
  getSocietesPage(page: number, size: number): Observable<any> {
    return this.get<any>(`societes/ListeParPage?pageNumero=${page}&pageTaille=${size}`);
  }
  createSociete(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Adresse: data.adresse || data.Adresse || '',
      Email: data.email || data.Email || '',
      TelephoneContact: data.telephoneContact || data.TelephoneContact || data.telephone || '',
      Ville: data.ville || data.Ville || '',
      Pays: data.pays || data.Pays || '',
      CodePostale: data.codePostale || data.CodePostale || '',
      PersonneContact: data.personneContact || data.PersonneContact || '',
      Fax: data.fax || data.Fax || '',
      SiteWeb: data.siteWeb || data.SiteWeb || '',
      PlanAbonnement: data.planAbonnement || data.PlanAbonnement || 'Standard',
      Actif: data.actif !== undefined ? data.actif : (data.Actif !== undefined ? data.Actif : true)
    };
    return this.post(`societes/ajouter`, payload, { responseType: 'text' as 'json' });
  }
  updateSociete(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Adresse: data.adresse || data.Adresse || '',
      Email: data.email || data.Email || '',
      TelephoneContact: data.telephoneContact || data.TelephoneContact || data.telephone || '',
      Ville: data.ville || data.Ville || '',
      Pays: data.pays || data.Pays || '',
      CodePostale: data.codePostale || data.CodePostale || '',
      PersonneContact: data.personneContact || data.PersonneContact || '',
      Fax: data.fax || data.Fax || '',
      SiteWeb: data.siteWeb || data.SiteWeb || '',
      PlanAbonnement: data.planAbonnement || data.PlanAbonnement || '',
      Actif: data.actif !== undefined ? data.actif : (data.Actif !== undefined ? data.Actif : true)
    };
    return this.put(`societes/modifier`, payload, { responseType: 'text' as 'json' });
  }
  deleteSociete(id: string): Observable<any> {
    return this.delete(`societes/supprimer/id/${id}`, { responseType: 'text' as 'json' });
  }
  updateSocieteModules(id: string, modules: string): Observable<any> { return this.put(`societes/${id}/modules`, { enabledModules: modules }); }
  getSocieteModules(id: string): Observable<string[]> { return this.get<string[]>(`societes/${id}/modules`); }

  // Utilisateurs
  getUtilisateurs(): Observable<any[]> { return this.get<any[]>(`utilisateurs/liste`); }
  getUtilisateursPage(page: number, size: number): Observable<any> {
    return this.get<any>(`utilisateurs/liste-par-page/${page}/${size}`);
  }
  getUtilisateursByConditionPage(page: number, size: number, condition: any): Observable<any> {
    return this.post<any>(`utilisateurs/liste-par-condition-par-page/${page}/${size}`, condition);
  }
  createUtilisateur(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Email: data.email || data.Email || '',
      MotDePasse: data.motDePasse || data.MotDePasse || data.password || 'admin123',
      Cv: data.cv || data.Cv || '',
      TypeUtilisateurId: data.typeUtilisateurId || data.TypeUtilisateurId || ApiService.ROLES.DEVELOPPEUR,
      SocieteId: data.societeId || data.SocieteId || '',
      RoleId: data.roleId || data.RoleId || 'R001',
      Actif: data.actif !== undefined ? data.actif : (data.Actif !== undefined ? data.Actif : true),
      Telephone: data.telephone || data.Telephone || ''
    };
    if (payload.Telephone === undefined || payload.Telephone === null || (typeof payload.Telephone === 'string' && payload.Telephone.trim() === '')) {
      delete (payload as any).Telephone;
    }
    return this.post(`utilisateurs/ajouter`, payload, { responseType: 'text' as 'json' });
  }
  updateUtilisateur(id: string, data: any): Observable<any> {
    const payload = {
      Id: id || data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Email: data.email || data.Email || '',
      MotDePasse: data.motDePasse || data.MotDePasse || null,
      Telephone: data.telephone || data.Telephone || '',
      Poste: data.poste || data.Poste || '',
      Departement: data.departement || data.Departement || '',
      Contrat: data.contrat || data.Contrat || '',
      TypeUtilisateurId: data.typeUtilisateurId || data.TypeUtilisateurId || data.role || 'T007',
      SocieteId: data.societeId || data.SocieteId || '',
      Actif: data.actif !== undefined ? data.actif : (data.Actif !== undefined ? data.Actif : true),
      RoleId: data.roleId || data.RoleId || 'R001'
    };
    
    // Si le mot de passe est vide ou uniquement des espaces, on ne l'envoie pas pour éviter l'erreur de validation (MinLength 8)
    if (payload.MotDePasse === undefined || payload.MotDePasse === null || (typeof payload.MotDePasse === 'string' && payload.MotDePasse.trim() === '')) {
      delete (payload as any).MotDePasse;
    }

    if (payload.Telephone === undefined || payload.Telephone === null || (typeof payload.Telephone === 'string' && payload.Telephone.trim() === '')) {
      delete (payload as any).Telephone;
    }

    return this.put(`utilisateurs/modifier`, payload, { responseType: 'text' as 'json' });
  }
  deleteUtilisateur(id: string): Observable<any> {
    return this.delete(`utilisateurs/supprimer/id/${id}`, { responseType: 'text' as 'json' });
  }
  getEmployesBySociete(societeId: string, includeSuperAdmin: boolean = false): Observable<any[]> {
    const critere = { Criteres: { 'SocieteId': societeId.toString() } };
    return this.post<any>(`utilisateurs/liste-par-condition`, critere)
      .pipe(map(res => {
        let list = res?.value ? res.value : (Array.isArray(res) ? res : []);
        return list.filter((e: any) => {
          if (includeSuperAdmin) return true;
          const role = (e.typeUtilisateurId || e.TypeUtilisateurId || e.role || '').toLowerCase();
          return role !== 'super_admin' && role !== 't001';
        });
      }));
  }

  // Projets & Taches
  getProjets(): Observable<any[]> { return this.get<any>(`projets`).pipe(map(res => Array.isArray(res) ? res : (res?.value || res?.items || []))); }
  getProjetsPage(page: number, size: number): Observable<any> {
    return this.get<any>(`projets/liste-par-page/${page}/${size}`);
  }
  getProjetsByConditionPage(page: number, size: number, condition: any): Observable<any> {
    return this.post<any>(`projets/liste-par-condition-par-page/${page}/${size}`, condition);
  }
  getProjetsDetailleByConditionPage(page: number, size: number, condition: any): Observable<any> {
    return this.post<any>(`projets/ListeDetailleParConditionParPage?pageNumero=${page}&pageTaille=${size}`, condition);
  }
  private normalizeProjet(data: any): any {
    const sanitize = (val: any) => {
      if (!val || typeof val !== 'string') return val || '';
      return val.replace(/undefined/g, '').trim();
    };

    return {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Description: data.description || data.Description || '',
      Status: data.status || data.Status || data.statut || 'En attente',
      StartDate: data.startDate || data.StartDate || data.dateDebut || null,
      EndDate: data.endDate || data.EndDate || data.dateFin || data.echeance || null,
      SocieteId: data.societeId || data.SocieteId || this.getCurrentSocieteId() || '',
      UtilisateurId: sanitize(data.utilisateurId || data.UtilisateurId || data.chef || data.Chef),
      Chef: sanitize(data.chef || data.Chef || data.utilisateurId || data.UtilisateurId),
      NomClient: sanitize(data.nomClient || data.NomClient),
      Priorite: data.priorite || data.Priorite || 'Medium',
      Actif: data.actif !== undefined ? data.actif : (data.Actif !== undefined ? data.Actif : true)
    };
  }
  saveProjet(data: any): Observable<any> {
    const payload = this.normalizeProjet(data);
    return payload.Id
      ? this.put(`projets/modifier`, payload, { responseType: 'text' as 'json' })
      : this.post(`projets/ajouter`, payload, { responseType: 'text' as 'json' });
  }
  createProjet(data: any): Observable<any> {
    return this.post(`projets/ajouter`, this.normalizeProjet(data), {
      responseType: 'text' as 'json'
    });
  }
  updateProjet(data: any): Observable<any> {
    return this.put(`projets/modifier`, this.normalizeProjet(data), {
      responseType: 'text' as 'json'
    });
  }
  deleteProjet(id: string): Observable<any> {
    return this.delete(`projets/supprimer/id/${id}`, {
      responseType: 'text' as 'json'
    });
  }
  addMembreAuProjet(data: any): Observable<any> { return this.post(`membresdeprojet/AjouterOuModifier`, data); }
  getMembresProjet(projetId: string): Observable<any[]> {
    const critere = { Criteres: { 'ProjetId': projetId } };
    return this.post<any[]>(`membresdeprojet/ListeDetailleParCondition`, critere);
  }
  removeMembreDuProjet(id: string): Observable<any> { return this.delete(`membresdeprojet/${id}`); }
  getBurndown(id: string): Observable<any> { return this.get(`projets/${id}/burndown`); }
  getProjetsBySociete(societeId: string): Observable<any[]> { return this.get<any[]>(`projets/ParSociete/${societeId}`); }
  getTachesByProjet(projetId: string): Observable<any[]> {
    const critere = { Criteres: { 'ProjetId': projetId } };
    return this.post<any[]>(`taches/liste-par-condition`, critere);
  }
  getTaches(): Observable<any[]> { return this.get<any>(`taches/liste`).pipe(map(res => Array.isArray(res) ? res : (res?.value || res?.items || []))); }
  getTachesBySociete(societeId: string): Observable<any[]> {
    const critere = { Criteres: { 'SocieteId': societeId } };
    return this.post<any[]>(`taches/liste-par-condition`, critere);
  }
  /** Converts kanban column IDs to proper backend Statut values */
  private normalizeTacheStatut(statut: string | undefined | null): string {
    if (!statut) return 'To Do';
    const map: { [key: string]: string } = {
      'todo': 'To Do',
      'inprogress': 'In Progress',
      'in progress': 'In Progress',
      'en cours': 'In Progress',
      'done': 'Done',
      'terminé': 'Done',
      'terminée': 'Done'
    };
    return map[statut.toLowerCase().trim()] ?? statut;
  }

  /** Returns a valid ISO date string or null — prevents sending display strings like 'N/A' to the backend */
  private toSafeDate(value: any): string | null {
    if (!value || value === 'N/A' || value === '-') return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  saveTache(data: any): Observable<any> {
    const rawDate = data.DateLimite || data.dateLimite || data.dateFin || data.DateFin || data.dateEcheance || null;
    const rawStatut = data.Statut || data.statut || data.status || data.Status || 'To Do';
    const payload = {
      Id: data.Id || data.id || null,
      Titre: data.Titre || data.titre || data.nom || '',
      Description: data.Description || data.description || '',
      Statut: this.normalizeTacheStatut(rawStatut),
      Priorite: data.Priorite || data.priorite || 'Medium',
      ProjetId: data.ProjetId || data.projetId || null,
      DevComment: data.DevComment || data.devComment || '',
      TestComment: data.TestComment || data.testComment || '',
      DateLimite: this.toSafeDate(rawDate),
      TempsEstime: data.TempsEstime || data.tempsEstime || 0,
      TempsReel: data.TempsReel || data.tempsReel || 0,
      UtilisateurId: data.UtilisateurId || data.utilisateurId || data.assigneeId || null,
      Actif: data.actif !== undefined ? data.actif : (data.Actif !== undefined ? data.Actif : true)
    };
    const isUpdate = !!payload.Id;
    return isUpdate
      ? this.put(`taches/modifier`, payload, { responseType: 'text' as 'json' })
      : this.post(`taches/ajouter`, payload, { responseType: 'text' as 'json' });
  }

  deleteTache(id: string): Observable<any> {
    return this.delete(`taches/supprimer/id/${id}`, {
      responseType: 'text' as 'json'
    });
  }

  /** Assigner une tâche à un utilisateur via la table TacheAssignation */
  assignerTache(tacheId: string, utilisateurId: string): Observable<any> {
    const payload = {
      id: null,
      tacheId: tacheId,
      utilisateurId: utilisateurId,
      actif: true
    };
    return this.post(`tacheassignees/AjouterOuModifier`, payload, { responseType: 'text' as 'json' });
  }

  /** Récupérer les tâches assignées à un utilisateur spécifique */
  getTachesParUtilisateur(utilisateurId: string): Observable<any[]> {
    return forkJoin({
      taches: this.getTaches(),
      assignations: this.get<any>(`tacheassignees/Liste`).pipe(catchError(() => of([])))
    }).pipe(
      map(({ taches, assignations }) => {
        const assigns = Array.isArray(assignations) ? assignations : (assignations?.value || assignations?.items || []);
        const taskIdsForUser = new Set(
          assigns.filter((a: any) => (a.utilisateurId || a.UtilisateurId) === utilisateurId)
                 .map((a: any) => a.tacheId || a.TacheId)
        );
        return (taches || []).filter((t: any) => taskIdsForUser.has(t.id || t.Id));
      }),
      catchError(() => of([]))
    );
  }

  // RH & Pointage
  clockIn(uId: string, sId: string, type = 'NORMAL', note?: string): Observable<any> {
    const payload = {
      utilisateurId: uId,
      societeId: sId,
      date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1),
      typeId: type,
      note: note || ''
    };
    return this.post(`rh/enhanced/clock-in`, payload);
  }

  clockOut(uId: string, sId: string, note?: string, id?: string): Observable<any> {
    const payload = {
      utilisateurId: uId,
      societeId: sId,
      pointageId: id,
      date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1),
      note: note || ''
    };
    return this.post(`rh/enhanced/clock-out`, payload);
  }

  getPointageAujourdhui(uId: string): Observable<any> {
    const today = new Date().toISOString().split('T')[0];
    const critere = { Criteres: { 'UtilisateurId': uId, 'Date': today } };
    return this.post<any[]>(`pointage/liste-par-condition`, critere)
      .pipe(map(list => (list && list.length > 0) ? list[0] : null), catchError(() => of(null)));
  }

  pointerEntree(uId: string): Observable<any> {
    const sId = this.getCurrentSocieteId();
    return this.clockIn(uId, sId);
  }

  pointerSortie(uId: string): Observable<any> {
    const sId = this.getCurrentSocieteId();
    return this.clockOut(uId, sId);
  }
  getPointages(uId?: string): Observable<any[]> {
    if (uId) {
      const critere = { Criteres: { 'UtilisateurId': uId } };
      return this.post<any[]>(`pointage/liste-par-condition`, critere).pipe(catchError(() => of([])));
    }
    return this.get<any[]>(`pointage`).pipe(catchError(() => of([])));
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
    return this.put(`pointage/modifier`, payload);
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
    return this.post(`pointage/ajouter`, payload);
  }

  // RH & Monitoring
  getRHStats(sId: string, date?: string): Observable<any> {
    const id = encodeURIComponent(sId || '');
    let url = `dashboard/rh-stats/${id}`;
    if (date) url += `?date=${encodeURIComponent(date)}`;
    return this.get(url).pipe(catchError(() => of({ totalEmployes: 0, employesActifs: 0, employesAbsents: 0, tauxPresence: 0, congesValidesCeMois: 0, demandesCongesEnAttente: 0 })));
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
    const statusLabel = accepted ? 'Validée' : 'Refusée';
    return this.post(`rh/enhanced/demandes-conge/${id}/valider`, { adminId, accepted });
  }
  getRapportPresenceUrl(sId: string, m: number, a: number, f: string = 'pdf'): string { return `${this.baseUrl}/pointage/rapport?societeId=${sId}&mois=${m}&annee=${a}&format=${f}`; }
  getRapportPresence(sId: string, m: number, a: number): Observable<Blob> { return this.get<Blob>(`pointage/rapport-file?societeId=${sId}&mois=${m}&annee=${a}`); }
  getWorkedHoursReal(uId: string): Observable<any> {
    const now = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1);
    return this.get(`rh/enhanced/utilisateur/${uId}/heures-travaillees?now=${now}`);
  }
  getSoldeConge(uId: string): Observable<any> { 
    return this.get<any>(`rh/enhanced/utilisateur/${uId}/solde-conge`).pipe(
      map(res => {
        return {
          soldeTotal: res?.soldeTotal ?? res?.SoldeTotal ?? 0,
          soldeUtilise: res?.soldeUtilise ?? res?.SoldeUtilise ?? 0,
          soldeRestant: res?.soldeRestant ?? res?.SoldeRestant ?? 0,
          congesEnAttente: res?.congesEnAttente ?? res?.CongesEnAttente ?? 0,
          congesValides: res?.congesValides ?? res?.CongesValides ?? 0
        };
      }),
      catchError(() => of({ soldeTotal: 30, soldeUtilise: 0, soldeRestant: 30, congesEnAttente: 0, congesValides: 0 }))
    );
  }
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
    return this.post(`DemandesConge`, payload);
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
    return this.uploadFile(file, id, 'JustificatifConge');
  }

  uploadFile(file: File, referenceId: string, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('referenceId', referenceId);
    formData.append('type', type);
    return this.http.post(`${this.baseUrl}/attachement/upload`, formData, { headers: this.getHeadersWithMultipart() });
  }

  // Demandes de Congé
  getDemandesConge(): Observable<any[]> { return this.get<any>(`DemandesConge`).pipe(map(res => res?.value ? res.value : (Array.isArray(res) ? res : [])), catchError(() => of([]))); }
  getDemandesCongeBySociete(sId: string): Observable<any[]> { return this.get<any>(`DemandesConge/societe/${sId}`).pipe(map(res => res?.value ? res.value : (Array.isArray(res) ? res : [])), catchError(() => of([]))); }
  getDemandesCongeByUtilisateur(uId: string): Observable<any[]> { return this.get<any>(`DemandesConge/utilisateur/${uId}`).pipe(map(res => res?.value ? res.value : (Array.isArray(res) ? res : [])), catchError(() => of([]))); }
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
    return this.post(`DemandesConge`, payload);
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
    return this.put(`DemandesConge`, payload);
  }
  deleteDemandeConge(id: string): Observable<any> { return this.delete(`DemandesConge/${id}`); }
  
  ajusterConge(utilisateurId: string, dateEmbauche: string, soldeAjustement: number): Observable<any> {
    const payload = { UtilisateurId: utilisateurId, DateEmbauche: dateEmbauche, SoldeAjustement: soldeAjustement };
    return this.post(`rh/enhanced/utilisateur/${utilisateurId}/ajustement-conge`, payload);
  }

  getAllSoldesConges(societeId: string): Observable<any[]> {
    return this.get<any[]>(`rh/enhanced/societe/${societeId}/soldes-conges`).pipe(catchError(() => of([])));
  }

  // Recrutement
  getOffresEmploi(): Observable<any[]> {
    return this.get<any[]>(`OffreEmploI/liste`).pipe(catchError(() => of([])));
  }
  saveOffreEmploi(data: any): Observable<any> {
    const isUpdate = !!(data.id || data.Id);
    const payload = {
      id: data.id || data.Id || ('OFFRE_' + Date.now()),
      titre: data.titre || data.Titre || '',
      description: data.description || data.Description || '',
      poste: data.poste || data.Poste || '',
      lieu: data.lieu || data.Lieu || '',
      salaire: data.salaire || data.Salaire || '',
      quiz: data.quiz || data.Quiz || '',
      societeId: data.societeId || data.SocieteId || '',
      statut: data.statut || data.Statut || 'Ouvert',
      actif: data.actif !== undefined ? data.actif : true
    };

    if (!isUpdate) {
      return this.post(`OffreEmploI/ajouter`, payload);
    }
    return this.put(`OffreEmploI/modifier`, payload);
  }
  deleteOffreEmploi(id: string): Observable<any> {
    return this.delete(`OffreEmploI/supprimer/id/${id}`, { responseType: 'text' as 'json' });
  }
  getCandidatures(): Observable<any[]> {
    return this.get<any>(`candidatures`).pipe(
      map(res => Array.isArray(res) ? res : (res?.value || res?.items || [])),
      catchError(() => of([]))
    );
  }
  getCandidaturesBySociete(societeId: string): Observable<any[]> {
    const critere = { Criteres: { 'SocieteId': societeId, 'Type': 'Candidature' } };
    return this.post<any>(`application/liste-par-condition`, critere).pipe(
      map(res => Array.isArray(res) ? res : (res?.value || res?.items || [])),
      catchError(() => of([]))
    );
  }
  deleteCandidature(id: string): Observable<any> {
    return this.delete(`candidatures/${id}`);
  }
  clearCandidatures(): void {
    const critere = { Criteres: { 'Type': 'Candidature' } };
    this.post(`application/supprimer-par-condition`, critere).subscribe();
  }
  convertCandidatToEmploye(id: string): Observable<any> {
    return this.post(`utilisateurs/ajouter`, { fromCandidatId: id });
  }
  setOffreEmploiTemp(o: any): void { localStorage.setItem('selectedOffre', JSON.stringify(o)); }
  getOffreEmploiTemp(): any { const d = localStorage.getItem('selectedOffre'); return d ? JSON.parse(d) : null; }
  saveCandidature(c: any): Observable<any> {
    const payload = {
      Id: c.id || c.Id || '',
      UtilisateurId: c.utilisateurId || c.UtilisateurId || null,
      SocieteId: c.societeId || c.SocieteId || null,
      OffreId: c.offreId || c.OffreId || null,
      Titre: c.titre || c.Titre || '',
      Statut: c.statut || c.Statut || 'Nouveau',
      Description: c.observations || c.notes || '',
      AppelDate: c.dateEntretien ? new Date(c.dateEntretien).toISOString() : null,
      Quiz: c.quiz || c.Quiz || null,
      Telephone: c.telephone || '',
      Competences: c.competences || '',
      Poste: c.poste || '',
      Type: 'Candidature',
      Actif: true
    };
    return this.post(`candidatures`, payload, { responseType: 'text' as 'json' });
  }
  updateCandidature(c: any): Observable<any> {
    const payload = {
      Id: c.id || c.Id || '',
      UtilisateurId: c.utilisateurId || c.UtilisateurId || null,
      SocieteId: c.societeId || c.SocieteId || null,
      OffreId: c.offreId || c.OffreId || null,
      Titre: c.titre || c.Titre || '',
      Statut: c.statut || c.Statut || '',
      Description: c.observations || c.notes || '',
      AppelDate: c.dateEntretien ? new Date(c.dateEntretien).toISOString() : null,
      Quiz: c.quiz || c.Quiz || null,
      Telephone: c.telephone || '',
      Competences: c.competences || '',
      Poste: c.poste || '',
      Type: 'Candidature',
      Actif: true
    };
    return this.put(`candidatures`, payload, { responseType: 'text' as 'json' });
  }
  getCandidaturesByCandidat(id: string): Observable<any[]> {
    const critere = { Criteres: { 'UtilisateurId': id } };
    return this.post<any[]>(`application/liste-par-condition`, critere);
  }
  updateCandidatureStatus(id: string, status: string, score?: number, total?: number): Observable<any> {
    const payload = { Id: id, Statut: status, Type: 'Candidature', Quiz: score !== undefined ? `${score}/${total}` : '' };
    return this.put(`application/modifier`, payload, { responseType: 'text' as 'json' });
  }

  // New Recrutement Methods
  postulerForm(formData: FormData): Observable<any> {
    let headers = new HttpHeaders();
    const token = this.getToken();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/recrutement/postuler`, formData, { headers });
  }

  getQuizQuestionsBackend(quizName: string): Observable<any[]> {
    return this.get<any[]>(`recrutement/questions/${quizName}`);
  }

  validateQuizBackend(applicationId: string, quizName: string, reponses: number[]): Observable<any> {
    return this.post(`recrutement/valider-quiz`, { applicationId, quizName, reponses });
  }

  // Chat
  getChatRooms(): Observable<any[]> { return this.get<any[]>(`chatrooms`); }
  createChatRoom(data: any): Observable<any> { return this.post(`chatrooms`, data); }
  getChatMessages(roomId: string): Observable<any[]> { return this.get<any[]>(`chatmessages?chatRoomId=${roomId}`); }
  sendChatMessage(data: any): Observable<any> { return this.post(`chatmessages`, data); }

  // Security & Logs
  getConnectionLogs(limit = 50): Observable<any[]> { return this.get<any[]>(`logs/connexions?limit=${limit}`); }
  getApiLogs(limit = 100): Observable<any[]> { return this.get<any[]>(`logs/api?limit=${limit}`); }
  getAnomalies(): Observable<any[]> { return this.get<any[]>(`logs/anomalies`).pipe(catchError(() => of([]))); }
  blockIp(d: any): Observable<any> { return this.post(`blocked-ips`, d); }
  unblockIp(id: string): Observable<any> { return this.delete(`blocked-ips/${id}`); }
  // Auth
  login(e: string, p: string): Observable<any> { return this.http.post(`${this.baseUrl}/auth/login`, { email: e, password: p }); }
  registerCandidate(d: any): Observable<any> { return this.http.post(`${this.baseUrl}/auth/register-candidate`, d); }

  // Email & Notifications
  getNotifications(): Observable<any[]> { return this.get<any[]>(`notifications`).pipe(catchError(() => of([]))); }
  getUserNotifications(userId: string): Observable<any[]> { return this.get<any[]>(`notifications/user/${userId}`).pipe(catchError(() => of([]))); }
  createNotification(sId: string, type: string, titre: string, msg: string, uId?: string): Observable<any> {
    const url = uId ? `${this.baseUrl}/notifications/send-to-user` : `${this.baseUrl}/notifications/send-to-societe`;
    const payload = uId
      ? { userId: uId, title: titre, message: msg, type: type }
      : { societeId: sId, title: titre, message: msg, type: type };

    return this.post(url, payload);
  }
  sendTestEmail(e: string): Observable<any> { return this.post(`email/test`, { toEmail: e }); }
  sendEmailNotification(type: string, data: any): void { this.post(`email/${type}`, data).subscribe(); }

  // Others
  getRoles(): Observable<any[]> { return this.get<any[]>(`typeutilisateurs`).pipe(catchError(() => of([]))); }
  updateRole(role: any): Observable<any> {
    const payload = {
      Id: role.id || role.Id,
      Nom: role.nom || role.Nom,
      Description: role.description || role.Description,
      Actif: role.actif !== undefined ? role.actif : (role.Actif !== undefined ? role.Actif : true)
    };
    return this.put(`typeutilisateurs/modifier`, payload, { responseType: 'text' as 'json' });
  }
  getAbonnements(): Observable<any[]> { return this.get<any[]>(`abonnements`).pipe(catchError(() => of([]))); }
  createAbonnement(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || ('ABO_' + Date.now().toString(36).toUpperCase()),
      SocieteId: data.societeId || data.SocieteId || '',
      TypeAbonnement: data.typeAbonnement || data.TypeAbonnement || '',
      Prix: data.prix || data.Prix || 0,
      DateDebut: data.dateDebut || data.DateDebut || null,
      DateFin: data.dateFin || data.DateFin || null,
      Actif: data.actif ?? data.Actif ?? true
    };
    return this.post(`abonnements`, payload);
  }
  getPaiements(): Observable<any[]> { return this.get<any[]>(`paiements`).pipe(catchError(() => of([]))); }
  
  // Activités & Surveillance
  getGlobalActivities(limit: number = 20): Observable<any[]> {
    // On récupère les activités globales (sans filtre societeId si possible, ou pour une societe 'SYSTEM')
    return this.get<any[]>(`Activite?limit=${limit}`).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(() => of([]))
    );
  }

  logActivity(action: string, description: string, type: string = 'system', societeId: string = 'SYSTEM'): Observable<any> {
    const user = this.getCurrentUser();
    return this.post(`Activite`, {
      Action: action,
      Description: description,
      Type: type,
      SocieteId: societeId,
      UtilisateurId: user?.id || 'System'
    });
  }

  // IP Blocking (Mock API until real backend implementation, uses api_patches for persistence)
  getBlockedIps(): Observable<any[]> {
    return this.get<any[]>(`blocked-ips`).pipe(catchError(() => of([])));
  }

  toggleIpBlock(ip: string, reason: string): Observable<any> {
    return this.post(`security/toggle-ip`, { ip, reason });
  }
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
    return this.post(`paiements`, payload);
  }
  getExpiringSubscriptions(days: number): Observable<any[]> { return this.get<any[]>(`abonnements/expiring?days=${days}`).pipe(catchError(() => of([]))); }
  sendNotification(data: any): Observable<any> { return this.post(`notifications`, data); }
  getModules(): Observable<any[]> { return this.get<any[]>(`module/liste`).pipe(catchError(() => of([]))); }
  saveModule(data: any): Observable<any> {
    const payload = {
      Id: data.id || data.Id || '',
      Nom: data.nom || data.Nom || '',
      Description: data.description || data.Description || '',
      Icon: data.icon || data.Icon || '',
      Actif: data.actif ?? data.Actif ?? true
    };
    return payload.Id ? this.put(`module/modifier`, payload) : this.post(`module/ajouter`, payload);
  }
  deleteModule(id: string): Observable<any> {
    return this.delete(`module/supprimer/id/${id}`, {
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

  chatWithAI(message: string, context: any = ''): Observable<any> {
    const ctx = typeof context === 'string' ? context : JSON.stringify(context);
    return this.post(`ai/chat`, { message, context: ctx });
  }

  // Notifications
  sendNotificationToUser(userId: string, title: string, message: string, type: string = 'info'): Observable<any> {
    return this.post(`notifications/send-to-user`, { UserId: userId, Title: title, Message: message, Type: type });
  }
  sendNotificationToSociete(societeId: string, title: string, message: string, type: string = 'info'): Observable<any> {
    return this.post(`notifications/send-to-societe`, { SocieteId: societeId, Title: title, Message: message, Type: type });
  }
  sendNotificationToProject(projectId: string, title: string, message: string, type: string = 'info'): Observable<any> {
    return this.post(`notifications/send-to-project`, { ProjectId: projectId, Title: title, Message: message, Type: type });
  }
  // Demandes de création de société
  soumettreDemandeSociete(data: any): Observable<any> {
    return this.post(`DemandeSociete/soumettre`, data);
  }

  getDemandesSociete(): Observable<any[]> {
    return this.get<any[]>(`DemandeSociete/liste`);
  }

  traiterDemandeSociete(demandeId: string, approuver: boolean): Observable<any> {
    return this.post(`DemandeSociete/traiter`, { demandeId, approuver });
  }

  // Tests & Évaluations (via même proxy /api que le reste → API Métier → Core)
  getTestsBySociete(societeId: string): Observable<any[]> {
    const id = encodeURIComponent(societeId || '');
    return this.get<any[]>(`Tests/societe/${id}`).pipe(
      map((data: any) => Array.isArray(data) ? data : []),
      catchError(() => of([]))
    );
  }

  createTest(test: any): Observable<any> {
    return this.post(`Tests`, test);
  }

  updateTest(test: any): Observable<any> {
    return this.put(`Tests/${test.id || test.Id}`, test);
  }

  deleteTest(id: string): Observable<any> {
    return this.delete(`Tests/${encodeURIComponent(id)}`);
  }

  getTestQuestions(testId: string): Observable<any[]> {
    const tid = encodeURIComponent(testId || '');
    return this.get<any[]>(`Tests/${tid}/questions`).pipe(catchError(() => of([])));
  }

  createQuestion(question: any): Observable<any> {
    return this.post<any>(`Tests/questions`, question);
  }

  createReponse(reponse: any): Observable<any> {
    return this.post<any>(`Tests/reponses`, reponse);
  }

  getSoldesConges(societeId: string): Observable<any[]> {
    return this.get<any[]>(`rh/enhanced/societe/${societeId}/soldes-conges`).pipe(
      map(res => Array.isArray(res) ? res : []),
      catchError(() => of([]))
    );
  }
}
