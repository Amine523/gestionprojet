export interface Projet {
  id: string;
  nom: string;
  nomClient?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  priorite?: string;
  utilisateurId?: string;
  societeId?: string;
  avancee?: number;
  tachesCount?: number;
  membresCount?: number;
  actif: boolean;
}

export interface ProjetCreate {
  nom: string;
  nomClient?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  priorite?: string;
  utilisateurId?: string;
  societeId?: string;
}

export interface ProjetUpdate extends Partial<ProjetCreate> {
  id: string;
}
