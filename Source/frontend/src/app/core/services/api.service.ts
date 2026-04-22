import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import emailjs from '@emailjs/browser';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:5221/api';
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

  setToken(token: string): void { localStorage.setItem(this.tokenKey, token); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  logout(): void { 
    localStorage.removeItem(this.tokenKey); 
    localStorage.removeItem('utilisateur'); 
    localStorage.removeItem(this.permissionsKey); 
    localStorage.removeItem('selectedOffre');
  }
  isLoggedIn(): boolean { return !!this.getToken(); }
  getCurrentUser(): any { const user = localStorage.getItem('utilisateur'); return user ? JSON.parse(user) : null; }
  getUserRole(): string { const user = this.getCurrentUser(); return (user?.typeUtilisateurId || user?.typeUtilisateur?.id || 'candidat').toLowerCase(); }
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
  getActiviteRecente(limit = 10): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/activite-recente?limit=${limit}`, { headers: this.getHeaders() }); }
  getUptime(): Observable<any> { return this.http.get(`${this.baseUrl}/dashboard/uptime`, { headers: this.getHeaders() }); }
  getAlertes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/dashboard/alertes`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }

  // Societes
  getSocietes(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/societes`, { headers: this.getHeaders() }); }
  getSocieteById(id: string): Observable<any> { return this.http.get(`${this.baseUrl}/societes/${id}`, { headers: this.getHeaders() }); }
  getSocietesPage(page: number, size: number): Observable<any> { 
    return this.http.get<any>(`${this.baseUrl}/societes/ListeParPage?pageNumero=${page}&pageTaille=${size}`, { headers: this.getHeaders() }); 
  }
  createSociete(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/societes`, data, { headers: this.getHeaders() }); }
  updateSociete(data: any): Observable<any> { return this.http.put(`${this.baseUrl}/societes`, data, { headers: this.getHeaders() }); }
  deleteSociete(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/societes/${id}`, { headers: this.getHeaders() }); }
  updateSocieteModules(id: string, modules: string): Observable<any> { return this.http.put(`${this.baseUrl}/societes/${id}/modules`, { enabledModules: modules }, { headers: this.getHeaders() }); }

  // Utilisateurs
  getUtilisateurs(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/utilisateurs`, { headers: this.getHeaders() }); }
  getUtilisateursPage(page: number, size: number): Observable<any> { 
    return this.http.get<any>(`${this.baseUrl}/utilisateurs/ListeParPage?pageNumero=${page}&pageTaille=${size}`, { headers: this.getHeaders() }); 
  }
  getUtilisateursByConditionPage(page: number, size: number, condition: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/utilisateurs/ListeParConditionParPage?pageNumero=${page}&pageTaille=${size}`, condition, { headers: this.getHeaders() });
  }
  createUtilisateur(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/utilisateurs`, data, { headers: this.getHeaders() }); }
  updateUtilisateur(id: string, data: any): Observable<any> { return this.http.put(`${this.baseUrl}/utilisateurs`, data, { headers: this.getHeaders() }); }
  deleteUtilisateur(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/utilisateurs/${id}`, { headers: this.getHeaders() }); }
  getEmployesBySociete(societeId: string): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/Utilisateur/ParSociete/${societeId}`, { headers: this.getHeaders() }); }

  // Projets & Taches
  getProjets(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/projets`, { headers: this.getHeaders() }); }
  getProjetsPage(page: number, size: number): Observable<any> { 
    return this.http.get<any>(`${this.baseUrl}/projets/ListeParPage?pageNumero=${page}&pageTaille=${size}`, { headers: this.getHeaders() }); 
  }
  getProjetsByConditionPage(page: number, size: number, condition: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/projets/ListeParConditionParPage?pageNumero=${page}&pageTaille=${size}`, condition, { headers: this.getHeaders() });
  }
  saveProjet(data: any): Observable<any> { return data.id ? this.http.put(`${this.baseUrl}/projets`, data, { headers: this.getHeaders() }) : this.http.post(`${this.baseUrl}/projets`, data, { headers: this.getHeaders() }); }
  createProjet(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/projets`, data, { headers: this.getHeaders() }); }
  updateProjet(data: any): Observable<any> { return this.http.put(`${this.baseUrl}/projets`, data, { headers: this.getHeaders() }); }
  deleteProjet(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/projets/${id}`, { headers: this.getHeaders() }); }
  addMembreAuProjet(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/projetutilisateurs`, data, { headers: this.getHeaders() }); }
  getBurndown(id: string): Observable<any> { return this.http.get(`${this.baseUrl}/projets/${id}/burndown`, { headers: this.getHeaders() }); }
  getProjetsBySociete(societeId: string): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/Projet/ParSociete/${societeId}`, { headers: this.getHeaders() }); }
  getTaches(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/taches`, { headers: this.getHeaders() }); }
  saveTache(data: any): Observable<any> { return data.id ? this.http.put(`${this.baseUrl}/taches`, data, { headers: this.getHeaders() }) : this.http.post(`${this.baseUrl}/taches`, data, { headers: this.getHeaders() }); }

  // RH
  clockIn(uId: string, sId: string, type = 'NORMAL', note?: string): Observable<any> { return this.http.post(`${this.baseUrl}/rh/enhanced/clock-in`, { utilisateurId: uId, societeId: sId, typeId: type, date: new Date().toISOString(), note }, { headers: this.getHeaders() }); }
  clockOut(uId: string, sId: string, note?: string): Observable<any> { return this.http.post(`${this.baseUrl}/rh/enhanced/clock-out`, { utilisateurId: uId, societeId: sId, note }, { headers: this.getHeaders() }); }
  getRHStats(sId: string, date?: string): Observable<any> { return this.http.get(`${this.baseUrl}/rh/enhanced/societe/${sId}/stats?date=${date || ''}`, { headers: this.getHeaders() }); }
  getWorkedHoursReal(uId: string, date?: string): Observable<any> { return this.http.get(`${this.baseUrl}/rh/enhanced/user/${uId}/worked-hours?date=${date || ''}`, { headers: this.getHeaders() }); }
  updateDemandeConge(data: any): Observable<any> { return this.http.put(`${this.baseUrl}/demandesconge`, data, { headers: this.getHeaders() }); }
  getPointages(uId?: string): Observable<any[]> { 
    const url = uId ? `${this.baseUrl}/pointages/user/${uId}` : `${this.baseUrl}/pointages`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); 
  }
  getDemandesConge(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/demandesconge`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  getDemandesEnAttenteReal(sId: string): Observable<any[]> { 
    return this.getDemandesConge().pipe(
      map(demandes => demandes.filter((d: any) => d.societeId === sId && d.statut === 'En_attente'))
    );
  }
  validerDemandeCongeReal(id: string, adminId: string, accepted: boolean): Observable<any> { return this.http.post(`${this.baseUrl}/rh/enhanced/demandes-conge/${id}/valider`, { adminId, accepted }, { headers: this.getHeaders() }); }
  getSoldeConge(uId: string): Observable<any> { return this.http.get(`${this.baseUrl}/rh/enhanced/user/${uId}/solde-conge`, { headers: this.getHeaders() }); }
  createDemandeCongeReal(dto: any): Observable<any> { return this.http.post(`${this.baseUrl}/rh/enhanced/demandes-conge`, dto, { headers: this.getHeaders() }); }
  uploadJustificatif(id: string, file: File): Observable<any> { 
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/rh/enhanced/demandes-conge/${id}/justificatif`, formData, { headers: this.getHeaders() }); 
  }
  getRapportPresenceUrl(sId: string, m: number, a: number, f: string = 'pdf'): string { return `${this.baseUrl}/rh/enhanced/societe/${sId}/rapport-presence?mois=${m}&annee=${a}&format=${f}`; }
  getRapportPresence(sId: string, m: number, a: number): Observable<Blob> { return this.http.get(`${this.baseUrl}/rh/enhanced/societe/${sId}/rapport-presence?mois=${m}&annee=${a}`, { responseType: 'blob', headers: this.getHeaders() }); }
  updatePointage(data: any): Observable<any> { return this.http.put(`${this.baseUrl}/pointages`, data, { headers: this.getHeaders() }); }
  createPointage(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/pointages`, data, { headers: this.getHeaders() }); }

  // Recrutement
  getOffresEmploi(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/offresemploi`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  saveOffreEmploi(data: any): Observable<any> { return data.id ? this.http.put(`${this.baseUrl}/offresemploi`, data, { headers: this.getHeaders() }) : this.http.post(`${this.baseUrl}/offresemploi`, data, { headers: this.getHeaders() }); }
  deleteOffreEmploi(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/offresemploi/${id}`, { headers: this.getHeaders() }); }
  getCandidatures(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/candidatures`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  deleteCandidature(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/candidatures/${id}`, { headers: this.getHeaders() }); }
  clearCandidatures(): void { this.http.delete(`${this.baseUrl}/candidatures`, { headers: this.getHeaders() }).subscribe(); }
  convertCandidatToEmploye(id: string): Observable<any> { return this.http.post(`${this.baseUrl}/candidatures/${id}/convert`, {}, { headers: this.getHeaders() }); }
  setOffreEmploiTemp(o: any): void { localStorage.setItem('selectedOffre', JSON.stringify(o)); }
  getOffreEmploiTemp(): any { const d = localStorage.getItem('selectedOffre'); return d ? JSON.parse(d) : null; }
  saveCandidature(c: any): Observable<any> { return this.http.post(`${this.baseUrl}/recrutement/postuler`, c, { headers: this.getHeaders() }); }
  updateCandidature(c: any): Observable<any> { return this.http.put(`${this.baseUrl}/candidatures`, c, { headers: this.getHeaders() }); }
  getCandidaturesByCandidat(id: string): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/candidatures/candidat/${id}`, { headers: this.getHeaders() }); }
  updateCandidatureStatus(id: string, status: string, score?: number, total?: number): Observable<any> { return this.http.put(`${this.baseUrl}/candidatures/${id}/status`, { status, score, total }, { headers: this.getHeaders() }); }

  // New Recrutement Methods
  postulerForm(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    const token = this.getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
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
  createNotification(sId: string, type: string, titre: string, msg: string, uId?: string): void { this.http.post(`${this.baseUrl}/notifications`, { societeId: sId, type, titre, contenu: msg, utilisateurId: uId || 'SYSTEM', estLu: false, dateCreation: new Date().toISOString() }, { headers: this.getHeaders() }).subscribe(); }
  sendTestEmail(e: string): Observable<any> { return this.http.post(`${this.baseUrl}/email/test`, { toEmail: e }, { headers: this.getHeaders() }); }
  sendEmailNotification(type: string, data: any): void { this.http.post(`${this.baseUrl}/email/${type}`, data, { headers: this.getHeaders() }).subscribe(); }

  // Others
  getRoles(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/typeutilisateurs`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  getAbonnements(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/abonnements`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  createAbonnement(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/abonnements`, data, { headers: this.getHeaders() }); }
  getPaiements(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/paiements`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  createPaiement(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/paiements`, data, { headers: this.getHeaders() }); }
  getExpiringSubscriptions(days: number): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/abonnements/expiring?days=${days}`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  sendNotification(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/notifications`, data, { headers: this.getHeaders() }); }
  getModules(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/modules`, { headers: this.getHeaders() }).pipe(catchError(() => of([]))); }
  saveModule(data: any): Observable<any> { return data.id ? this.http.put(`${this.baseUrl}/modules`, data, { headers: this.getHeaders() }) : this.http.post(`${this.baseUrl}/modules`, data, { headers: this.getHeaders() }); }
  deleteModule(id: string): Observable<any> { return this.http.delete(`${this.baseUrl}/modules/${id}`, { headers: this.getHeaders() }); }
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
}

