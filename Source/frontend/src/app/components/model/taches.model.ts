export interface Tache {
  id: string;
  titre: string;
  description: string;
  statut: 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';
  priorite: 'basse' | 'moyenne' | 'elevee' | 'critique';
  assigneA: string;
  chefProjetId: string;
  projetId: string;
  projetNom?: string;
  sprintId?: string;
  storyPoints: number;
  dateCreation: string;
  dateEcheance?: string;
  etiquettes: string[];
  commentaires: Commentaire[];
}

export interface Sprint {
  id: string;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  projetId: string;
  projetNom?: string;
  objectifs: string;
  statut: 'planifie' | 'actif' | 'termine' | 'annule';
  taches: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TacheFormData {
  titre: string;
  description: string;
  priorite: 'basse' | 'moyenne' | 'elevee' | 'critique';
  assigneA: string;
  projetId: string;
  storyPoints: number;
  dateEcheance?: string;
  etiquettes: string[];
}

export interface SprintFormData {
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  projetId: string;
  objectifs: string;
}

export interface FiltreTache {
  projetId?: string;
  statut?: string;
  assigneA?: string;
  priorite?: string;
  sprintId?: string;
}

export interface Commentaire {
  id: string;
  auteurId: string;
  auteurNom: string;
  contenu: string;
  dateCreation: string;
  tacheId: string;
}

export interface TacheStats {
  total: number;
  backlog: number;
  todo: number;
  inprogress: number;
  review: number;
  done: number;
  enRetard: number;
}
