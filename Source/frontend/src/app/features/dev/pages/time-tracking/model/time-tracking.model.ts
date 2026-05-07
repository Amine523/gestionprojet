export interface Pointage {
  id: string | number;
  date: string;
  heureEntree: string;
  heureSortie?: string;
  heuresTravaillees?: number;
  utilisateurId?: string;
  societeId?: string;
}
