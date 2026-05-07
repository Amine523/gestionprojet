export interface Employe {
  id: string | number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  typeUtilisateurId: string;
  typeUtilisateurLabel: string;
  societeId: string;
  dateEmbauche?: string;
  salaire?: number;
  statut: 'actif' | 'inactif' | 'en_conge';
  photo?: string;
  adresse?: string;
  competence?: string[];
  projets?: Projet[];
}

export interface Projet {
  id: string | number;
  nom: string;
  description?: string;
  statut: 'actif' | 'en_cours' | 'termine' | 'en_pause';
  dateDebut?: string;
  dateFin?: string;
  budget?: number;
  chefId?: string;
  chefNom?: string;
  equipe?: string[];
  progression?: number;
}

export interface EmployeStats {
  total: number;
  actifs: number;
  enConge: number;
  nouveaux: number;
  parType: { [typeId: string]: number };
}

export interface FiltreEmploye {
  recherche?: string;
  typeUtilisateurId?: string;
  statut?: string;
  societeId?: string;
}

export interface EmployeFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  typeUtilisateurId: string;
  societeId: string;
  salaire?: number;
  adresse?: string;
  competence?: string[];
  statut?: 'actif' | 'inactif';
}

export interface NotificationEmploye {
  id: string | number;
  type: 'success' | 'error' | 'warning' | 'info';
  titre: string;
  message: string;
  timestamp: string;
  employeId?: string | number;
}
