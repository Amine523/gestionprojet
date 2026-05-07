export interface Projet {
  id: string;
  nom: string;
  description: string;
  statut: string;
  dateDebut?: string;
  dateFin?: string;
  avancement?: number;
  taches?: number;
  avancee?: number;
}
