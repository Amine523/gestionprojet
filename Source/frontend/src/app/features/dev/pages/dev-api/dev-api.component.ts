// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// interface ApiResponse {
//   status: string;
//   desc: string;
//   model?: string;
// }

// interface ApiParam {
//   name: string;
//   type: string;
//   description: string;
// }

// interface ApiEndpoint {
//   method: string;
//   path: string;
//   summary: string;
//   params?: ApiParam[];
//   body?: string;
//   responses: ApiResponse[];
// }

// interface ApiResource {
//   name: string;
//   description: string;
//   endpoints: ApiEndpoint[];
// }

// @Component({
//   selector: 'app-dev-api',
//   standalone: true,
//   imports: [CommonModule],
//   template: `

//     <div class="api-container">
//       <!-- Header -->
//       <div class="api-header">
//         <div class="header-icon">
//           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//             <path d="M4 11a9 9 0 0 1 9 9"></path>
//             <path d="M4 4a16 16 0 0 1 16 16"></path>
//             <circle cx="5" cy="19" r="1"></circle>
//           </svg>
//         </div>
//         <div class="header-info">
//           <h1 class="header-title">Documentation API REST</h1>
//           <p class="header-subtitle">Spécifications techniques, Endpoints et Schémas intégrés (v1.0)</p>
//         </div>
//         <button class="btn btn-primary">
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//             <polyline points="7 10 12 15 17 10"></polyline>
//             <line x1="12" y1="15" x2="12" y2="3"></line>
//           </svg>
//           Exporter OpenAPI.json
//         </button>
//       </div>

//       <!-- API Resources -->
//       <div class="api-resources">
//         @for (resource of apiResources; track resource.name) {
//           <div class="resource-section">
//             <div class="resource-header">
//               <h2 class="resource-title">{{resource.name}}</h2>
//               <span class="resource-description">{{resource.description}}</span>
//             </div>
            
//             <div class="endpoints-list">
//               @for (endpoint of resource.endpoints; track endpoint.path; let i = $index) {
//                 <div class="endpoint-item" [class.method-get]="endpoint.method.toLowerCase() === 'get'" [class.method-post]="endpoint.method.toLowerCase() === 'post'" [class.method-put]="endpoint.method.toLowerCase() === 'put'" [class.method-delete]="endpoint.method.toLowerCase() === 'delete'">
//                   <div class="endpoint-header" (click)="toggleEndpoint(resource.name, i)">
//                     <span class="method-badge" [class.method-get]="endpoint.method.toLowerCase() === 'get'" [class.method-post]="endpoint.method.toLowerCase() === 'post'" [class.method-put]="endpoint.method.toLowerCase() === 'put'" [class.method-delete]="endpoint.method.toLowerCase() === 'delete'">{{endpoint.method}}</span>
//                     <span class="endpoint-path">{{endpoint.path}}</span>
//                     <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                       <polyline points="6 9 12 15 18 9"></polyline>
//                     </svg>
//                   </div>
                  
//                   <div class="endpoint-body" [class.expanded]="isExpanded(resource.name, i)">
//                     <p class="endpoint-summary">{{endpoint.summary}}</p>
                    
//                     @if (endpoint.params && endpoint.params.length) {
//                       <div class="params-section">
//                         <h6 class="section-title">Paramètres Requis</h6>
//                         <table class="params-table">
//                           <thead>
//                             <tr>
//                               <th>Nom</th>
//                               <th>Type</th>
//                               <th>Description</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             @for (param of endpoint.params; track param.name) {
//                               <tr>
//                                 <td><strong>{{param.name}}</strong></td>
//                                 <td><span class="type-badge">{{param.type}}</span></td>
//                                 <td>{{param.description}}</td>
//                               </tr>
//                             }
//                           </tbody>
//                         </table>
//                       </div>
//                     }

//                     @if (endpoint.body) {
//                       <div class="body-section">
//                         <h6 class="section-title">Body d'entrée (JSON)</h6>
//                         <pre class="code-block code-dark"><code>{{endpoint.body}}</code></pre>
//                       </div>
//                     }

//                     <div class="responses-section">
//                       <h6 class="section-title">Réponses</h6>
//                       <div class="responses-list">
//                         @for (res of endpoint.responses; track res.status) {
//                           <div class="response-item">
//                             <span class="status-badge" [class.status-success]="res.status.startsWith('2')" [class.status-error]="!res.status.startsWith('2')">{{res.status}}</span>
//                             <span class="response-desc">{{res.desc}}</span>
//                             @if (res?.model) {
//                               <pre class="code-block code-light"><code>{{res?.model}}</code></pre>
//                             }
//                           </div>
//                         }
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               }
//             </div>
//           </div>
//         }
//       </div>
//     </div>
//   `,
//   styles: [`
//     .api-container {
//       max-width: 1200px;
//       margin: 0 auto;
//       padding: var(--space-lg);
//       height: 100vh;
//       overflow-y: auto;
//     }

//     .api-header {
//       background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
//       border-radius: var(--radius-xl);
//       padding: var(--space-2xl);
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       gap: var(--space-lg);
//       position: relative;
//       overflow: hidden;
//       box-shadow: var(--shadow-xl);
//       margin-bottom: var(--space-xl);
//     }

//     .api-header::before {
//       content: '';
//       position: absolute;
//       top: -50%;
//       right: -20%;
//       width: 600px;
//       height: 600px;
//       background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
//       border-radius: 50%;
//     }

//     .header-icon {
//       width: 56px;
//       height: 56px;
//       background: rgba(255, 255, 255, 0.2);
//       backdrop-filter: blur(10px);
//       border-radius: var(--radius-lg);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: white;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//     }

//     .header-info {
//       flex: 1;
//     }

//     .header-title {
//       font-size: var(--font-size-2xl);
//       font-weight: var(--font-weight-bold);
//       color: white;
//       margin: 0;
//       letter-spacing: -0.02em;
//     }

//     .header-subtitle {
//       color: rgba(255, 255, 255, 0.8);
//       font-size: var(--font-size-sm);
//       margin: var(--space-xs) 0 0;
//     }

//     .btn {
//       display: inline-flex;
//       align-items: center;
//       gap: var(--space-sm);
//       padding: var(--space-sm) var(--space-lg);
//       border-radius: var(--radius-md);
//       font-weight: var(--font-weight-semibold);
//       font-size: var(--font-size-sm);
//       border: none;
//       cursor: pointer;
//       transition: all var(--transition-base);
//     }

//     .btn-primary {
//       background: white;
//       color: #6366f1;
//     }

//     .btn-primary:hover {
//       background: rgba(255, 255, 255, 0.9);
//       transform: translateY(-2px);
//     }

//     .api-resources {
//       display: flex;
//       flex-direction: column;
//       gap: var(--space-lg);
//       padding-bottom: var(--space-2xl);
//     }

//     .resource-section {
//       background: white;
//       border-radius: var(--radius-xl);
//       border: 1px solid var(--color-border);
//       box-shadow: var(--shadow-sm);
//       overflow: hidden;
//     }

//     .resource-header {
//       padding: var(--space-lg);
//       border-bottom: 2px solid var(--color-border);
//       display: flex;
//       align-items: baseline;
//       gap: var(--space-sm);
//     }

//     .resource-title {
//       font-size: var(--font-size-xl);
//       font-weight: var(--font-weight-bold);
//       color: var(--color-text);
//       margin: 0;
//     }

//     .resource-description {
//       font-size: var(--font-size-sm);
//       color: var(--color-text-muted);
//     }

//     .endpoints-list {
//       display: flex;
//       flex-direction: column;
//     }

//     .endpoint-item {
//       border-bottom: 1px solid var(--color-border);
//     }

//     .endpoint-item:last-child {
//       border-bottom: none;
//     }

//     .endpoint-item.method-get {
//       border-left: 4px solid #3b82f6;
//     }

//     .endpoint-item.method-post {
//       border-left: 4px solid #10b981;
//     }

//     .endpoint-item.method-put {
//       border-left: 4px solid #f59e0b;
//     }

//     .endpoint-item.method-delete {
//       border-left: 4px solid #ef4444;
//     }

//     .endpoint-header {
//       padding: var(--space-md) var(--space-lg);
//       display: flex;
//       align-items: center;
//       gap: var(--space-md);
//       cursor: pointer;
//       transition: background-color var(--transition-base);
//     }

//     .endpoint-header:hover {
//       background: var(--color-bg);
//     }

//     .method-badge {
//       min-width: 80px;
//       text-align: center;
//       padding: var(--space-xs) var(--space-sm);
//       border-radius: var(--radius-full);
//       font-size: var(--font-size-xs);
//       font-weight: var(--font-weight-bold);
//       text-transform: uppercase;
//       color: white;
//     }

//     .method-badge.method-get {
//       background: #3b82f6;
//     }

//     .method-badge.method-post {
//       background: #10b981;
//     }

//     .method-badge.method-put {
//       background: #f59e0b;
//     }

//     .method-badge.method-delete {
//       background: #ef4444;
//     }

//     .endpoint-path {
//       font-family: monospace;
//       font-size: var(--font-size-base);
//       font-weight: var(--font-weight-bold);
//       color: var(--color-text);
//       flex: 1;
//     }

//     .chevron {
//       transition: transform var(--transition-base);
//       color: var(--color-text-muted);
//     }

//     .endpoint-body.expanded .chevron {
//       transform: rotate(180deg);
//     }

//     .endpoint-body {
//       max-height: 0;
//       overflow: hidden;
//       transition: max-height 0.3s ease-out;
//     }

//     .endpoint-body.expanded {
//       max-height: 2000px;
//     }

//     .endpoint-body > * {
//       padding: 0 var(--space-lg) var(--space-lg);
//     }

//     .endpoint-summary {
//       color: var(--color-text-muted);
//       font-size: var(--font-size-sm);
//       margin: 0 0 var(--space-md);
//     }

//     .section-title {
//       font-size: var(--font-size-sm);
//       font-weight: var(--font-weight-bold);
//       color: var(--color-text);
//       margin: 0 0 var(--space-sm);
//     }

//     .params-section {
//       margin-bottom: var(--space-md);
//     }

//     .params-table {
//       width: 100%;
//       border-collapse: collapse;
//       font-size: var(--font-size-sm);
//     }

//     .params-table th {
//       text-align: left;
//       padding: var(--space-sm);
//       font-weight: var(--font-weight-bold);
//       color: var(--color-text-muted);
//       border-bottom: 1px solid var(--color-border);
//     }

//     .params-table td {
//       padding: var(--space-sm);
//       border-bottom: 1px solid var(--color-border);
//     }

//     .type-badge {
//       padding: var(--space-xs) var(--space-sm);
//       border-radius: var(--radius-full);
//       font-family: monospace;
//       font-size: var(--font-size-xs);
//       font-weight: var(--font-weight-bold);
//       background: var(--color-surface);
//       color: var(--color-text-muted);
//     }

//     .body-section {
//       margin-bottom: var(--space-md);
//     }

//     .code-block {
//       padding: var(--space-md);
//       border-radius: var(--radius-lg);
//       font-family: monospace;
//       font-size: var(--font-size-sm);
//       overflow-x: auto;
//       margin: 0;
//     }

//     .code-dark {
//       background: #1e293b;
//       color: #f8fafc;
//     }

//     .code-light {
//       background: var(--color-bg);
//       color: var(--color-text);
//       border: 1px solid var(--color-border);
//     }

//     .responses-section {
//       margin-bottom: var(--space-md);
//     }

//     .responses-list {
//       display: flex;
//       flex-direction: column;
//       gap: var(--space-md);
//     }

//     .response-item {
//       padding: var(--space-md);
//       border-radius: var(--radius-lg);
//       border: 1px solid var(--color-border);
//       background: var(--color-bg);
//     }

//     .status-badge {
//       padding: var(--space-xs) var(--space-sm);
//       border-radius: var(--radius-full);
//       font-weight: var(--font-weight-bold);
//       margin-right: var(--space-sm);
//     }

//     .status-badge.status-success {
//       background: #d1fae5;
//       color: #059669;
//     }

//     .status-badge.status-error {
//       background: #fee2e2;
//       color: #dc2626;
//     }

//     .response-desc {
//       font-size: var(--font-size-sm);
//       color: var(--color-text);
//     }

//     /* Dark mode */
//     :host-context(.dark) .resource-section,
//     :host-context(.dark) .response-item {
//       background: var(--color-surface);
//       border-color: var(--color-border);
//     }

//     :host-context(.dark) .resource-title,
//     :host-context(.dark) .endpoint-path,
//     :host-context(.dark) .section-title,
//     :host-context(.dark) .response-desc {
//       color: var(--color-text);
//     }

//     :host-context(.dark) .endpoint-header:hover {
//       background: rgba(255, 255, 255, 0.05);
//     }

//     :host-context(.dark) .params-table th,
//     :host-context(.dark) .endpoint-summary,
//     :host-context(.dark) .resource-description {
//       color: var(--color-text-muted);
//     }

//     :host-context(.dark) .code-light {
//       background: rgba(255, 255, 255, 0.05);
//       border-color: var(--color-border);
//       color: var(--color-text);
//     }

//     :host-context(.dark) .type-badge {
//       background: rgba(255, 255, 255, 0.05);
//       color: var(--color-text-muted);
//     }

//     @media (max-width: 768px) {
//       .api-header {
//         flex-direction: column;
//         align-items: flex-start;
//       }

//       .endpoint-header {
//         flex-wrap: wrap;
//       }

//       .endpoint-path {
//         width: 100%;
//         margin: var(--space-xs) 0;
//       }
//     }
//   `]
// })
// export class DevApiComponent {
//   expandedEndpoints: Set<string> = new Set();

//   apiResources: ApiResource[] = [
//     {
//       name: 'Authentication',
//       description: 'Opérations Firebase/JWT pour la connexion système.',
//       endpoints: [
//         {
//           method: 'POST',
//           path: '/api/auth/login',
//           summary: 'Authentifier un utilisateur et retourner le Bearer Token',
//           params: [],
//           body: '{\n  "email": "user@example.com",\n  "password": "Password123!"\n}',
//           responses: [
//             { status: '200', desc: 'Succès - Retourne l\'objet token.', model: '{\n  "token": "eyJhbG...",\n  "utilisateur": { "id": "1", "nom": "John Doe", "role": "dev" }\n}' },
//             { status: '401', desc: 'Non autorisé - Identifiants invalides.' }
//           ]
//         }
//       ]
//     },
//     {
//       name: 'Utilisateurs',
//       description: 'Gestion des talents et employés.',
//       endpoints: [
//         {
//           method: 'GET',
//           path: '/api/utilisateurs',
//           summary: 'Récupère la liste de tous les utilisateurs de la société.',
//           params: [
//             { name: 'societeId', type: 'string', description: 'ID de la société parente (Optionnel, injecté via token).' }
//           ],
//           responses: [
//             {
//               status: '200', desc: 'Succès.', model: '[\n  {
//     "id": "123",
//               "nom": "Doe",
//               "prenom": "Jane",
//               "typeUtilisateurId": "developpeur"\n
//             }\n]' }
//           ]
//     },
//     {
//       method: 'POST',
//       path: '/api/utilisateurs',
//       summary: 'Créer un nouvel employé (RH / Admin).',
//       body: '{\n  "nom": "Nom",\n  "email": "email@test.com",\n  "typeUtilisateurId": "qa"\n}',
//       responses: [
//         { status: '201', desc: 'Création réussie.' }
//       ]
//     }
//   ]
// },
// {
//   name: 'Projets & Tâches (Agile)',
//     description: 'Ressources de gestion des sprints et backlogs.',
//       endpoints: [
//         {
//           method: 'GET',
//           path: '/api/taches',
//           summary: 'Liste les tâches du développeur connecté.',
//           params: [],
//           responses: [
//             {
//               status: '200', desc: 'Succès.', model: '[\n  {
//     "id": 1,
//               "titre": "Fixer header",
//               "statut": "inprogress",
//               "priorite": "High"\n
//             }\n]' }
//           ]
// },
// {
//   method: 'PUT',
//     path: '/api/taches/{id}',
//       summary: 'Mettre à jour le statut KanBan d\'une tâche.',
//         params: [
//           { name: 'id', type: 'integer', description: 'Identifiant unique de la tâche.' }
//         ],
//           body: '{\n  "statut": "done",\n  "tempsTravaille": 4.5\n}',
//             responses: [
//               { status: '204', desc: 'Modification acceptée (No Content).' }
//             ]
// }
//       ]
//     }
//   ];

// toggleEndpoint(resourceName: string, index: number) {
//   const key = `${resourceName}-${index}`;
//   if (this.expandedEndpoints.has(key)) {
//     this.expandedEndpoints.delete(key);
//   } else {
//     this.expandedEndpoints.add(key);
//   }
// }

// isExpanded(resourceName: string, index: number): boolean {
//   return this.expandedEndpoints.has(`${resourceName}-${index}`);
// }
// }
