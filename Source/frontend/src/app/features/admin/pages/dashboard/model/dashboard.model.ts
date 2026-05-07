export interface DashboardStats {
  employes: number;
  projetsActifs: number;
  heuresTravaillees: number;
  productivite: number;
}

export interface Activity {
  id: string | number;
  type: string;
  action: string;
  resource: string;
  utilisateur: string;
  date: string;
  details?: string;
}

export interface AIInsight {
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend: string;
  isPositive?: boolean;
}
