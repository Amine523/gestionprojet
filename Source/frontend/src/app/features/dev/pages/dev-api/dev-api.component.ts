import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ApiResponse {
  status: string;
  desc: string;
  model?: string;
}

interface ApiParam {
  name: string;
  type: string;
  description: string;
}

interface ApiEndpoint {
  method: string;
  path: string;
  summary: string;
  params?: ApiParam[];
  body?: string;
  responses: ApiResponse[];
}

interface ApiResource {
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}

@Component({
  selector: 'app-dev-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dev-api.component.html',
  styleUrls: ['./dev-api.component.scss']
})
export class DevApiComponent {
  expandedEndpoints: Set<string> = new Set();

  apiResources: ApiResource[] = [
    {
      name: 'Authentication',
      description: 'Opérations Firebase/JWT pour la connexion système.',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/login',
          summary: 'Authentifier un utilisateur et retourner le Bearer Token',
          params: [],
          body: '{\n  "email": "user@example.com",\n  "password": "Password123!"\n}',
          responses: [
            { status: '200', desc: 'Succès - Retourne l\'objet token.', model: '{\n  "token": "eyJhbG...",\n  "utilisateur": { "id": "1", "nom": "John Doe", "role": "dev" }\n}' },
            { status: '401', desc: 'Non autorisé - Identifiants invalides.' }
          ]
        }
      ]
    },
    {
      name: 'Utilisateurs',
      description: 'Gestion des talents et employés.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/utilisateurs',
          summary: 'Récupère la liste de tous les utilisateurs de la société.',
          params: [
            { name: 'societeId', type: 'string', description: 'ID de la société parente (Optionnel, injecté via token).' }
          ],
          responses: [
            {
              status: '200', desc: 'Succès.', model: '[\n  {\n    "id": "123",\n    "nom": "Doe",\n    "prenom": "Jane",\n    "typeUtilisateurId": "developpeur"\n  }\n]' }
          ]
        },
        {
          method: 'POST',
          path: '/api/utilisateurs',
          summary: 'Créer un nouvel employé (RH / Admin).',
          body: '{\n  "nom": "Nom",\n  "email": "email@test.com",\n  "typeUtilisateurId": "qa"\n}',
          responses: [
            { status: '201', desc: 'Création réussie.' }
          ]
        }
      ]
    },
    {
      name: 'Projets & Tâches (Agile)',
      description: 'Ressources de gestion des sprints et backlogs.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/taches',
          summary: 'Liste les tâches du développeur connecté.',
          params: [],
          responses: [
            {
              status: '200', desc: 'Succès.', model: '[\n  {\n    "id": 1,\n    "titre": "Fixer header",\n    "statut": "inprogress",\n    "priorite": "High"\n  }\n]' }
          ]
        },
        {
          method: 'PUT',
          path: '/api/taches/{id}',
          summary: 'Mettre à jour le statut KanBan d\'une tâche.',
          params: [
            { name: 'id', type: 'integer', description: 'Identifiant unique de la tâche.' }
          ],
          body: '{\n  "statut": "done",\n  "tempsTravaille": 4.5\n}',
          responses: [
            { status: '204', desc: 'Modification acceptée (No Content).' }
          ]
        }
      ]
    }
  ];

  toggleEndpoint(resourceName: string, index: number) {
    const key = `${resourceName}-${index}`;
    if (this.expandedEndpoints.has(key)) {
      this.expandedEndpoints.delete(key);
    } else {
      this.expandedEndpoints.add(key);
    }
  }

  isExpanded(resourceName: string, index: number): boolean {
    return this.expandedEndpoints.has(`${resourceName}-${index}`);
  }

  exportOpenApi(): void {
    const openApiSpec: any = {
      openapi: '3.0.0',
      info: {
        title: 'GestionProjet API',
        version: '1.0.0',
        description: 'API REST pour la gestion de projets'
      },
      paths: {},
      components: {
        schemas: {}
      }
    };

    this.apiResources.forEach((resource: ApiResource) => {
      resource.endpoints.forEach((endpoint: any) => {
        const pathKey = endpoint.path;
        const method = endpoint.method.toLowerCase();

        if (!openApiSpec.paths[pathKey]) {
          openApiSpec.paths[pathKey] = {};
        }

        openApiSpec.paths[pathKey][method] = {
          summary: endpoint.summary,
          parameters: endpoint.params?.map((param: any) => ({
            name: param.name,
            in: 'query',
            schema: { type: param.type },
            description: param.description,
            required: true
          })) || [],
          requestBody: endpoint.body ? {
            content: {
              'application/json': {
                schema: { type: 'object' }
              }
            }
          } : undefined,
          responses: endpoint.responses.reduce((acc: any, res: any) => {
            acc[res.status] = {
              description: res.desc
            };
            return acc;
          }, {})
        };
      });
    });

    const dataStr = JSON.stringify(openApiSpec, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'openapi.json';
    link.click();
    URL.revokeObjectURL(url);
  }
}