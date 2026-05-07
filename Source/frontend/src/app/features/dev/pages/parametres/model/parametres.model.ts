export interface Profil {
  nom: string;
  email: string;
  role: string;
  initials: string;
  photo: string;
}

export interface Notifications {
  taches: boolean;
  bugs: boolean;
  commentaires: boolean;
  mentions: boolean;
}

export interface Preferences {
  darkMode: boolean;
  compactKanban: boolean;
}
