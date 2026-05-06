export interface Societe { id: string; nom: string; adresse: string; telephoneContact: string; actif: boolean; }
export interface Abonnement { id: string; societeId: string; typeAbonnement: string; dateDebut: Date; dateFin?: Date; actif: boolean; }
export interface TypeUtilisateur { id: string; nom: string; description: string; actif: boolean; }
export interface Utilisateur { id: string; nom: string; email: string; emailDuBase?: string; nv?: string; typeUtilisateurId?: string; societeId?: string; actif: boolean; }
export interface Role { id: string; nom: string; actif: boolean; }
export interface Module { id: string; nom: string; actif: boolean; }
export interface Permission { id: string; nom: string; moduleId?: string; roleId?: string; actif: boolean; }
export interface Projet { id: string; nom: string; nomClient?: string; startDate?: Date; endDate?: Date; status?: string; priorite?: string; utilisateurId?: string; societeId?: string; actif: boolean; }
export interface Tache { id: string; projetId: string; nom: string; description?: string; status?: string; priorite?: string; dateDebut?: Date; tempsEstime?: number; tempsReel?: number; actif: boolean; }
export interface SousTache { id: string; tacheId: string; description?: string; status?: string; actif: boolean; }
export interface Pointage { id: string; utilisateurId?: string; typeId?: string; date?: Date; heureDebut?: string; heureFin?: string; note?: string; actif: boolean; }
export interface DemandeConge { id: string; utilisateurId?: string; typePointageId?: string; dateDebut?: Date; dateFin?: Date; status?: string; valideParId?: string; }
export interface ChatRoom { id: string; nom?: string; projetId?: string; actif: boolean; }
export interface ChatMessage { id: string; chatRoomId?: string; expediteurId?: string; message?: string; dateEnvoi?: Date; estLu: boolean; }
export interface Notification { id: string; utilisateurId?: string; titre?: string; contenu?: string; estLu: boolean; dateCreation?: Date; }
export interface Contact { id: string; societeId?: string; nom: string; email?: string; telephone?: string; actif: boolean; }
export interface Application { id: string; nommodule: string; appLogoId?: string; ordre?: number; actif: boolean; }
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { token: string; utilisateur: Utilisateur; }
