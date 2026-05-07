import { Injectable } from '@angular/core';
import { ArchitectureLayer, WorkflowStep, Diagram } from '../model/diagrams.model';

@Injectable({
  providedIn: 'root'
})
export class DiagramsService {
  
  getArchitectureLayers(): ArchitectureLayer[] {
    return [
      {
        label: 'Client Tier (Angular)',
        items: ['Admin UI', 'Agile UI', 'RH UI'],
        color: 'blue'
      },
      {
        label: 'API Gateway & Logic (.NET Core REST)',
        items: ['Auth Service', 'User Service', 'Task Service', 'Calculate Service'],
        color: 'green'
      },
      {
        label: 'Data Layer',
        items: ['SQL Server'],
        color: 'red'
      }
    ];
  }

  getWorkflowSteps(): WorkflowStep[] {
    return [
      {
        id: 1,
        label: '1. Backlog & Jira',
        icon: 'star',
        highlighted: false
      },
      {
        id: 2,
        label: '2. Feature Branch',
        icon: 'git-branch',
        highlighted: false
      },
      {
        id: 3,
        label: '3. Pull Request (PR)',
        icon: 'git-pull-request',
        highlighted: true
      },
      {
        id: 4,
        label: '4. QA & Tests',
        icon: 'check-circle',
        highlighted: false
      },
      {
        id: 5,
        label: '5. Deploy (Prod)',
        icon: 'rocket',
        highlighted: false
      }
    ];
  }

  getDiagrams(): Diagram[] {
    return [
      {
        type: 'architecture',
        title: 'Architecture Globale du SaaS',
        description: 'Schémas applicatifs et flux de données'
      },
      {
        type: 'workflow',
        title: 'Workflow Git & Intégration (Agile)',
        description: 'Processus CI/CD et développement agile'
      }
    ];
  }
}
