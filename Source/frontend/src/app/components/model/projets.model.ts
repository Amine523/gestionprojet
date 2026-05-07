export interface Projet {
  id: string;
  nom: string;
  description: string;
  clientId: string;
  chefProjetId: string;
  dateDebut: string;
  dateFin?: string;
  budget?: number;
  statut: 'en_cours' | 'termine' | 'en_pause' | 'annule';
  progression?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  clientNom?: string;
  chefProjetNom?: string;
}

export interface ProjetFormData {
  nom: string;
  description: string;
  clientId: string;
  chefProjetId: string;
  dateDebut: string;
  dateFin?: string;
  budget?: number;
  statut?: 'en_cours' | 'termine' | 'en_pause' | 'annule';
}

export interface FiltreProjet {
  recherche?: string;
  statut?: string;
  clientId?: string;
  chefProjetId?: string;
  dateDebut?: string;
  dateFin?: string;
}

export interface ProjetStats {
  total: number;
  enCours: number;
  termines: number;
  enPause: number;
  annules: number;
}

export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  createdAt: string;
  updatedAt: string;
}

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
  statut: 'actif' | 'inactif';
  createdAt: string;
  updatedAt: string;
}
