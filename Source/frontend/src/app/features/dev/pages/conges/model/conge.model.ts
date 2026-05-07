export interface SoldeConge {
  soldeTotal: number;
  soldeUtilise: number;
  soldeRestant: number;
  congesEnAttente: number;
  congesValides: number;
}

export interface Conge {
  id: string;
  typeNom: string;
  dateDebut: string;
  dateFin: string;
  nombreJours: number;
  status: string;
  motif?: string;
  typePointageId?: string;
}

export interface NouvelleDemande {
  typePointageId: string;
  dateDebut: string | null;
  dateFin: string | null;
  motif: string;
  periode?: string;
  heures?: number;
}
