export interface DashboardStats {
  tachesAssignees: number;
  enCours: number;
  terminees: number;
  projets: number;
}

export interface Task {
  id: string;
  titre: string;
  projetNom: string;
  dateLimite: string;
  priorite: string;
  statut: string;
  projetId?: string;
}
