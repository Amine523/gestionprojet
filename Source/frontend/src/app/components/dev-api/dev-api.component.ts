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
  template: `
    <div class="container-fluid p-4" style="max-width: 1200px; margin: 0 auto; height: 100vh; overflow-y: auto;">
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 28px; background: linear-gradient(135deg, #2196f3, #1976d2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Documentation API REST</h1>
          <p class="text-muted" style="font-size: 14px; margin: 4px 0 0;">Spécifications techniques, Endpoints et Schémas intégrés (v1.0)</p>
        </div>
        <button class="btn btn-primary" style="background: #2196f3; border: none;"><i class="bi bi-download me-2"></i>Exporter OpenAPI.json</button>
      </div>

      <div class="d-flex flex-column gap-4 pb-5">
        @for (resource of apiResources; track resource.name) {
          <div class="resource-block">
            <h2 class="fw-bold" style="font-size: 24px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: baseline; gap- 3;">
              {{resource.name}} <span class="fw-normal" style="font-size: 14px; color: #64748b;">{{resource.description}}</span>
            </h2>
            
            <div class="accordion" id="accordion-{{resource.name}}">
              @for (endpoint of resource.endpoints; track endpoint.path; let i = $index) {
                <div class="accordion-item" [class.border-primary]="endpoint.method.toLowerCase() === 'get'" [class.border-success]="endpoint.method.toLowerCase() === 'post'" [class.border-warning]="endpoint.method.toLowerCase() === 'put'" [class.border-danger]="endpoint.method.toLowerCase() === 'delete'">
                  <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" [attr.data-bs-target]="'#collapse-' + resource.name + '-' + i" [class.bg-light]="endpoint.method.toLowerCase() === 'get'" [class.bg-success-subtle]="endpoint.method.toLowerCase() === 'post'" [class.bg-warning-subtle]="endpoint.method.toLowerCase() === 'put'" [class.bg-danger-subtle]="endpoint.method.toLowerCase() === 'delete'" style="font-weight: normal;">
                      <span class="badge rounded-pill text-white me-2" [class.bg-primary]="endpoint.method.toLowerCase() === 'get'" [class.bg-success]="endpoint.method.toLowerCase() === 'post'" [class.bg-warning]="endpoint.method.toLowerCase() === 'put'" [class.bg-danger]="endpoint.method.toLowerCase() === 'delete'" style="min-width: 80px; text-align: center; font-weight: 800; text-transform: uppercase;">{{endpoint.method}}</span>
                      <span style="font-family: monospace; font-size: 15px; font-weight: 700; color: #1e293b;">{{endpoint.path}}</span>
                    </button>
                  </h2>
                  <div [id]="'collapse-' + resource.name + '-' + i" class="accordion-collapse collapse" [attr.data-bs-parent]="'#accordion-' + resource.name">
                    <div class="accordion-body">
                      <div class="mb-2 text-muted">{{endpoint.summary}}</div>
                      
                      @if (endpoint.params && endpoint.params.length) {
                        <h6 class="fw-bold mb-2">Paramètres Requis</h6>
                        <table class="table table-bordered mb-3">
                          <thead class="table-light">
                            <tr>
                              <th>Nom</th>
                              <th>Type</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (param of endpoint.params; track param.name) {
                              <tr>
                                <td><strong>{{param.name}}</strong></td>
                                <td><span class="badge rounded-pill bg-secondary" style="font-family: monospace;">{{param.type}}</span></td>
                                <td>{{param.description}}</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      }

                      @if (endpoint.body) {
                        <h6 class="fw-bold mb-2">Body d'entrée (JSON)</h6>
                        <pre class="p-3 rounded-3 mb-3" style="background: #1e293b; color: #f8fafc; font-family: monospace; font-size: 13px; overflow-x: auto;"><code>{{endpoint.body}}</code></pre>
                      }

                      <h6 class="fw-bold mb-2">Réponses</h6>
                      <div class="d-flex flex-column gap-3">
                        @for (res of endpoint.responses; track res.status) {
                          <div class="p-3 rounded-3 border">
                            <span class="badge rounded-pill fw-bold me-2" [class.bg-success]="res.status.startsWith('2')" [class.bg-danger]="!res.status.startsWith('2')">{{res.status}}</span>
                            <span style="font-size: 14px; font-weight: 500;">{{res.desc}}</span>
                            @if (res?.model) {
                              <pre class="p-3 rounded-3 mt-2 mb-0" style="background: #f8fafc; color: #1e293b; border: 1px solid #e2e8f0; font-family: monospace; font-size: 13px; overflow-x: auto;"><code>{{res?.model}}</code></pre>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [``]
})
export class DevApiComponent {
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
            { status: '200', desc: 'Succès.', model: '[\n  {\n    "id": "123",\n    "nom": "Doe",\n    "prenom": "Jane",\n    "typeUtilisateurId": "developpeur"\n  }\n]' }
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
            { status: '200', desc: 'Succès.', model: '[\n  {\n    "id": 1,\n    "titre": "Fixer header",\n    "statut": "inprogress",\n    "priorite": "High"\n  }\n]' }
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
}
