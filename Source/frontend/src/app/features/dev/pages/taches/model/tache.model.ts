export interface Tache {
  id: string | number;
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  projet: string;
  projetId?: string;
  deadline: string;
  dateLimite?: string;
  tempsEstime: number;
  tempsTravaille?: number;
  assigneeNom?: string;
  utilisateurId?: string;
  gitLink?: string;
  techNotes?: string;
  piecesJointes?: string[];
  commentaires?: Commentaire[];
}

export interface Commentaire {
  id: string | number;
  auteur: string;
  texte: string;
  heure: string;
}

export interface Column {
  id: string;
  title: string;
}
