export interface Bug {
  id: string | number;
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  projet: string;
  createur: string;
  assignee?: string;
  steps?: string[];
  commentaires?: BugComment[];
}

export interface BugComment {
  id: string | number;
  auteur: string;
  texte: string;
  heure: string;
}

export interface BugStats {
  ouverts: number;
  enCours: number;
  corriges: number;
  total: number;
}
