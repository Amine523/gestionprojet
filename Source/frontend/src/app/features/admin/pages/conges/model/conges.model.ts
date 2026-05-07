export interface Conge {
  id: string;
  utilisateurId: string;
  utilisateurNom: string;
  typeNom: string;
  typePointageId: string;
  dateDebut: string;
  dateFin: string;
  nombreJours: number;
  motif: string;
  status: string;
  justificatif?: string;
  dateDemande?: string;
  dateValidation?: string;
}

export interface CongeStats {
  totalEmployes: number;
  totalConges: number;
  congesValidesCeMois: number;
  congesEnAttente: number;
  soldeConges: number;
  parType: { [type: string]: number };
  parStatut: { [statut: string]: number };
}

export interface FiltreConge {
  utilisateurId?: string;
  typeConge?: string;
  statut?: string;
  periode?: {
    debut: string;
    fin: string;
  };
  recherche?: string;
}

export interface CongeFormData {
  utilisateurId: string;
  typeCongeId: string;
  dateDebut: string;
  dateFin: string;
  motif: string;
  justificatif?: File;
  commentaire?: string;
}

export interface NotificationConge {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  titre: string;
  message: string;
  timestamp: string;
  congeId?: string;
}
