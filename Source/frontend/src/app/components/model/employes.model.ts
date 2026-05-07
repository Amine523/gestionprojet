export interface Employe {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  typeUtilisateurId: string;
  societeId: string;
  salaire?: number;
  adresse?: string;
  statut: 'actif' | 'inactif' | 'en_conge';
  createdAt: string;
  updatedAt: string;
  societeNom?: string;
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
  statut?: 'actif' | 'inactif' | 'en_conge';
}

export interface FiltreEmploye {
  recherche?: string;
  typeUtilisateurId?: string;
  statut?: string;
  societeId?: string;
}

export interface EmployeStats {
  total: number;
  actifs: number;
  enConge: number;
  nouveaux: number;
  parType: { [key: string]: number };
}

export interface Societe {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypeUtilisateur {
  id: string;
  nom: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
