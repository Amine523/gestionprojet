export interface ArchitectureLayer {
  label: string;
  items: string[];
  color: string;
}

export interface WorkflowStep {
  id: number;
  label: string;
  icon: string;
  highlighted?: boolean;
}

export interface Diagram {
  type: 'architecture' | 'workflow';
  title: string;
  description: string;
}
