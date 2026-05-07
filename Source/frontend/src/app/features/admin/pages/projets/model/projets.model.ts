export interface Projet {
  id: string;
  nom: string;
  nomClient: string;
  description?: string;
  chef: string;
  utilisateurId: string;
  status: string;
  startDate: string;
  endDate: string;
  avancee: number;
  avanceeCalculee: number;
  healthScore: number;
  healthColor: string;
  endDatePredicted: string;
  membres: number;
}

export interface ProjetStats {
  total: number;
  enCours: number;
  termines: number;
  enAttente: number;
  parStatut: { [statut: string]: number };
}

export interface FiltreProjet {
  recherche: string;
  statut: string;
}

export interface ProjetFormData {
  nom: string;
  nomClient: string;
  description?: string;
  chef: string;
  status: string;
  startDate?: string;
  endDate?: string;
  membres?: string[];
}

export interface ProjetReport {
  id: string;
  nom: string;
  nomClient: string;
  status: string;
  avancee: number;
  healthScore: number;
  recommendations: string;
  generatedAt: string;
}
