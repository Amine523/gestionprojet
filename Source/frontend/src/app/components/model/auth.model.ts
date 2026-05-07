export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  typeUtilisateurId: string;
  societeId: string;
  salaire?: number;
  adresse?: string;
  statut: 'actif' | 'inactif' | 'en_conge';
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  societeNom?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  typeUtilisateurId: string;
  societeId?: string;
  adresse?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
