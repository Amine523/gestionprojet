import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dev-docs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="docs-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Documentation</h1>
          <p class="header-subtitle">Accédez aux ressources techniques - {{societeNom}}</p>
        </div>
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Rechercher..." [(ngModel)]="searchQuery" (input)="filterDocs()">
        </div>
      </div>

      <!-- Docs Grid -->
      <div class="docs-grid">
        @for (doc of filteredDocs; track doc.type) {
          <div class="doc-card" (click)="openDoc(doc)">
            <div class="doc-menu">
              <button class="btn-icon" (click)="$event.stopPropagation()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
            </div>
            <div class="doc-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h5 class="doc-title">{{doc.title}}</h5>
            <p class="doc-description">{{doc.description}}</p>
          </div>
        }
        
        <div class="doc-card doc-card-add" (click)="addNewDoc()">
          <div class="doc-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <h5 class="doc-title doc-title-muted">Ajouter</h5>
          <p class="doc-description doc-description-muted">Ajouter un document</p>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Liens rapides</h5>
          <div class="quick-links">
            <a class="quick-link" (click)="openLink('Git')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Dépôt Git
            </a>
            <a class="quick-link" (click)="openLink('Jira')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              Jira
            </a>
            <a class="quick-link" (click)="openLink('Figma')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="13.5" cy="6.5" r=".5"></circle>
                <circle cx="17.5" cy="10.5" r=".5"></circle>
                <circle cx="8.5" cy="7.5" r=".5"></circle>
                <circle cx="6.5" cy="12.5" r=".5"></circle>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
              </svg>
              Figma
            </a>
            <a class="quick-link" (click)="openLink('Confluence')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Confluence
            </a>
          </div>
        </div>
      </div>

      <!-- Files Section -->
      <div class="card">
        <div class="card-body">
          <div class="files-header">
            <h5 class="card-title">Fichiers</h5>
            <div class="folder-tabs">
              @for (folder of folders; track folder) {
                <button class="folder-tab" [class.folder-tab-active]="selectedFolder === folder" (click)="selectedFolder = folder">
                  {{folder}}
                </button>
              }
              <button class="folder-tab folder-tab-add" (click)="addFolder()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Dossier
              </button>
            </div>
            <button class="btn btn-primary" (click)="fileInput.click()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Importer vers {{selectedFolder || 'Tous'}}
            </button>
            <input #fileInput type="file" hidden multiple (change)="onFileSelected($event)" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.js,.ts,.html,.css,.json,.png,.jpg,.jpeg,.gif">
          </div>
          
          @if (uploadProgress > 0 && uploadProgress < 100) {
            <div class="progress-bar-container">
              <div class="progress-fill" [style.width.%]="uploadProgress"></div>
            </div>
          }

          <div class="files-grid">
            @for (file of getFilesInFolder(); track file.name) {
              <div class="file-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div class="file-info">
                  <span class="file-name">{{file.name}}</span>
                  <span class="file-size">{{formatFileSize(file.size)}}</span>
                </div>
                <div class="file-actions">
                  <button class="btn-icon btn-icon-sm" (click)="downloadFile(file)" title="Télécharger">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                  <button class="btn-icon btn-icon-sm btn-icon-danger" (click)="deleteFile(file)" title="Supprimer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            }
            @if (getFilesInFolder().length === 0) {
              <div class="empty-files">Aucun fichier dans ce dossier</div>
            }
          </div>
        </div>
      </div>

      <!-- Doc Form Modal -->
      @if (showDocForm) {
        <div class="modal-overlay" (click)="closeDocForm()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header modal-header-success">
              <h3 class="modal-title">{{editingDoc ? 'Modifier' : 'Ajouter'}} un Document</h3>
              <button class="btn-close btn-close-white" (click)="closeDocForm()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Titre</label>
                <input type="text" [(ngModel)]="docForm.title" class="form-input" placeholder="Titre du document">
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <input type="text" [(ngModel)]="docForm.description" class="form-input" placeholder="Description">
              </div>
              <div class="form-group">
                <label class="form-label">Icône</label>
                <select [(ngModel)]="docForm.icon" class="form-select">
                  <option value="api">api</option>
                  <option value="storage">storage</option>
                  <option value="menu_book">menu_book</option>
                  <option value="account_tree">account_tree</option>
                  <option value="code">code</option>
                  <option value="description">description</option>
                  <option value="folder">folder</option>
                  <option value="article">article</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" (click)="closeDocForm()">Annuler</button>
              <button class="btn btn-success" (click)="saveDoc()">Enregistrer</button>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Doc Detail Modal -->
    @if (selectedDoc) {
      <div class="modal-overlay" (click)="selectedDoc = null">
        <div class="modal-card modal-card-lg" (click)="$event.stopPropagation()">
          <div class="modal-header modal-header-success">
            <h3 class="modal-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              {{selectedDoc.title}}
            </h3>
            <button class="btn-close btn-close-white" (click)="selectedDoc = null">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            @switch (selectedDoc.type) {
              @case ('api') {
                <div class="doc-section">
                  <h6 class="section-title">Authentification</h6>
                  <pre class="code-block"><code>POST /api/auth/login
Body: email, password
Response: token, utilisateur</code></pre>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">Utilisateurs</h6>
                  <pre class="code-block"><code>GET  /api/utilisateurs
POST /api/utilisateurs
PUT  /api/utilisateurs/:id
DELETE /api/utilisateurs/:id</code></pre>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">Sociétés</h6>
                  <pre class="code-block"><code>GET  /api/societes
POST /api/societes
PUT  /api/societes/:id</code></pre>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">Projets</h6>
                  <pre class="code-block"><code>GET  /api/projets
POST /api/projets
PUT  /api/projets/:id</code></pre>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">Tâches</h6>
                  <pre class="code-block"><code>GET  /api/taches
POST /api/taches
PUT  /api/taches/:id</code></pre>
                </div>
              }
              @case ('db') {
                <div class="doc-section">
                  <h6 class="section-title">societes</h6>
                  <pre class="code-block"><code>id, nom, email, telephone, activite, pays, ville, adresse, dateCreation</code></pre>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">utilisateurs</h6>
                  <pre class="code-block"><code>id, nom, email, password, societeId, typeUtilisateurId, actif</code></pre>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">projets</h6>
                  <pre class="code-block"><code>id, nom, description, societeId, chefId, statut, dateDebut, dateFin</code></pre>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">taches</h6>
                  <pre class="code-block"><code>id, titre, description, projetId, assigneeId, priorite, statut, tempsEstime</code></pre>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">pointages</h6>
                  <pre class="code-block"><code>id, employeId, societeId, date, entre, sortie, totalHeures</code></pre>
                </div>
              }
              @case ('guides') {
                <div class="doc-section">
                  <h6 class="section-title">Architecture</h6>
                  <p>Frontend: Angular 17 + Material</p>
                  <p>Backend: API REST with JWT auth</p>
                  <p>Storage: LocalStorage + optional API</p>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">Bonnes pratiques</h6>
                  <ul>
                    <li>Use standalone components</li>
                    <li>Follow reactive patterns</li>
                    <li>Filter data by societeId</li>
                    <li>Handle errors gracefully</li>
                  </ul>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">Code review</h6>
                  <ul>
                    <li>Vérifier les types TypeScript</li>
                    <li>Tester les composant</li>
                    <li>Vérifier le linting</li>
                  </ul>
                </div>
              }
              @case ('workflow') {
                <div class="doc-section">
                  <h6 class="section-title">Cycle de développement</h6>
                  <ol>
                    <li>Création tâche (Chef/RH)</li>
                    <li>Assignment développeur</li>
                    <li>Implémentation code</li>
                    <li>Tests unitaires</li>
                    <li>Pull request</li>
                    <li>Code review</li>
                    <li>QA test</li>
                    <li>Déploiement</li>
                  </ol>
                </div>
                <div class="doc-section">
                  <h6 class="section-title">Rôles</h6>
                  <ul>
                    <li><strong>RH</strong>: Gestion candidats, embauche</li>
                    <li><strong>Admin Société</strong>: Gestion employés, projets</li>
                    <li><strong>Chef de Groupe</strong>: Coordination équipe, attribution tâches</li>
                    <li><strong>Développeur</strong>: Implémentation fonctionnalités</li>
                    <li><strong>QA</strong>: Tests, rapport bugs</li>
                  </ul>
                </div>
              }
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .docs-container {
      padding: var(--space-lg);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      gap: var(--space-md);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      margin: var(--space-xs) 0 0;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      width: 300px;
    }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: var(--font-size-sm);
      color: var(--color-text);
      background: transparent;
    }

    .search-box svg {
      color: var(--color-text-muted);
    }

    .docs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .doc-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      text-align: center;
      cursor: pointer;
      transition: transform var(--transition-base), box-shadow var(--transition-base);
      position: relative;
      box-shadow: var(--shadow-sm);
    }

    .doc-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .doc-card-add {
      border: 2px dashed var(--color-border);
      background: var(--color-bg);
    }

    .doc-menu {
      position: absolute;
      top: var(--space-sm);
      right: var(--space-sm);
    }

    .doc-icon {
      margin-bottom: var(--space-md);
    }

    .doc-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .doc-title-muted {
      color: var(--color-text-muted);
    }

    .doc-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0;
    }

    .doc-description-muted {
      color: var(--color-text-muted);
    }

    .card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      margin-bottom: var(--space-lg);
      box-shadow: var(--shadow-sm);
    }

    .card-body {
      padding: var(--space-lg);
    }

    .card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-md);
    }

    .quick-links {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .quick-link {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-lg);
      background: var(--color-bg);
      cursor: pointer;
      text-decoration: none;
      color: var(--color-text);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      transition: background var(--transition-base);
    }

    .quick-link:hover {
      background: var(--color-surface);
    }

    .files-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
      flex-wrap: wrap;
    }

    .folder-tabs {
      display: flex;
      gap: var(--space-xs);
      flex-wrap: wrap;
      flex: 1;
    }

    .folder-tab {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .folder-tab:hover {
      border-color: #3b82f6;
    }

    .folder-tab-active {
      background: #10b981;
      color: white;
      border-color: #10b981;
    }

    .folder-tab-add {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-text-muted);
    }

    .btn-ghost:hover {
      background: var(--color-bg);
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .btn-icon-sm {
      width: 28px;
      height: 28px;
    }

    .btn-icon-danger {
      color: #ef4444;
      border-color: #ef4444;
    }

    .btn-icon-danger:hover {
      background: #ef4444;
      color: white;
    }

    .progress-bar-container {
      height: 8px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: var(--space-md);
      border: 1px solid var(--color-border);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      border-radius: var(--radius-full);
      transition: width 0.3s ease-out;
    }

    .files-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-md);
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .file-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .file-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .file-size {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .file-actions {
      display: flex;
      gap: var(--space-xs);
    }

    .empty-files {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--color-text-muted);
      padding: var(--space-lg);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-xl);
    }

    .modal-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-card-lg {
      max-width: 800px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-header-success {
      background: #10b981;
      color: white;
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }

    .modal-header-success .modal-title {
      color: white;
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-close-white {
      color: white;
    }

    .modal-body {
      padding: var(--space-lg);
      overflow-y: auto;
      flex: 1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .form-input,
    .form-select {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
    }

    .form-input:focus,
    .form-select:focus {
      border-color: #3b82f6;
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .doc-section {
      margin-bottom: var(--space-lg);
    }

    .section-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-sm);
    }

    .code-block {
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      font-family: monospace;
      font-size: var(--font-size-sm);
      color: var(--color-text);
      overflow-x: auto;
    }

    .doc-section p,
    .doc-section ul,
    .doc-section ol {
      margin: var(--space-xs) 0;
      color: var(--color-text);
      line-height: var(--line-height-relaxed);
    }

    .doc-section ul,
    .doc-section ol {
      padding-left: var(--space-lg);
    }

    /* Dark mode */
    :host-context(.dark) .docs-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .doc-card,
    :host-context(.dark) .card,
    :host-context(.dark) .search-box,
    :host-context(.dark) .quick-link,
    :host-context(.dark) .folder-tab,
    :host-context(.dark) .file-item,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .doc-title,
    :host-context(.dark) .card-title,
    :host-context(.dark) .quick-link,
    :host-context(.dark) .folder-tab,
    :host-context(.dark) .file-name,
    :host-context(.dark) .modal-title,
    :host-context(.dark) .form-label,
    :host-context(.dark) .section-title {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .doc-description,
    :host-context(.dark) .search-box svg,
    :host-context(.dark) .file-size {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .form-input,
    :host-context(.dark) .form-select,
    :host-context(.dark) .code-block {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        width: 100%;
      }

      .files-header {
        flex-direction: column;
        align-items: stretch;
      }

      .folder-tabs {
        width: 100%;
      }
    }
  `]
})
export class DevDocsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  searchQuery = '';
  societeNom = '';
  societeId = '';
  selectedDoc: any = null;
  showDocForm = false;
  editingDoc: any = null;
  docForm: any = { title: '', description: '', icon: 'article' };
  externalLinks: any = {
    git: 'https://github.com',
    jira: 'https://jira.com',
    figma: 'https://figma.com',
    confluence: 'https://confluence.com'
  };

  folders = ['Documents', 'Images', 'Code', 'Autres'];
  selectedFolder = '';
  newFolderName = '';

  addFolder() {
    const name = prompt('Nom du nouveau dossier:');
    if (name && name.trim()) {
      const folderName = name.trim();
      if (this.folders.indexOf(folderName) < 0) {
        this.folders.push(folderName);
        this.selectedFolder = folderName;
        this.snackBar.open('Dossier ajouté: ' + folderName, 'Fermer', { duration: 3000 });
      }
    }
  }

  docs = [
    { type: 'api', title: 'API Endpoints', description: 'Documentation des endpoints REST', icon: 'api' },
    { type: 'db', title: 'Schémas Base de données', description: 'Structure des tables et relations', icon: 'storage' },
    { type: 'guides', title: 'Guides Techniques', description: 'Tutoriels et bonnes pratiques', icon: 'menu_book' },
    { type: 'workflow', title: 'Workflow', description: 'Processus de développement', icon: 'account_tree' }
  ];
  filteredDocs = this.docs;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.societeId = user?.societeId || '';
    this.loadExternalLinks();
    this.loadDocsFromStorage();
    this.loadFilesFromStorage();
  }

  loadExternalLinks() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const societe = data.societes?.find((s: any) => s.id === this.societeId);
    if (societe?.externalLinks) {
      this.externalLinks = { ...this.externalLinks, ...societe.externalLinks };
    }
  }

  filterDocs() {
    const q = this.searchQuery.toLowerCase();
    this.filteredDocs = this.docs.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.description.toLowerCase().includes(q)
    );
  }

  addNewDoc() {
    this.editingDoc = null;
    this.docForm = { title: '', description: '', icon: 'article' };
    this.showDocForm = true;
  }

  editDoc(doc: any) {
    this.editingDoc = doc;
    this.docForm = { ...doc };
    this.showDocForm = true;
  }

  deleteDoc(doc: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
      this.docs = this.docs.filter(d => d.type !== doc.type);
      this.filterDocs();
      this.saveDocsToStorage();
      this.snackBar.open('Document supprimé', 'Fermer', { duration: 3000 });
    }
  }

  closeDocForm() {
    this.showDocForm = false;
    this.editingDoc = null;
  }

  saveDoc() {
    if (!this.docForm.title || !this.docForm.description) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }

    if (this.editingDoc) {
      const idx = this.docs.findIndex((d: any) => d.type === this.editingDoc.type);
      if (idx >= 0) {
        this.docs[idx] = { ...this.docForm, type: this.editingDoc.type };
      }
      this.snackBar.open('Document modifié', 'Fermer', { duration: 3000 });
    } else {
      const newType = 'doc_' + Date.now();
      this.docs.push({ ...this.docForm, type: newType });
      this.snackBar.open('Document ajouté', 'Fermer', { duration: 3000 });
    }

    this.filterDocs();
    this.saveDocsToStorage();
    this.closeDocForm();
  }

  saveDocsToStorage() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    if (!data.devDocs) data.devDocs = {};
    data.devDocs[this.societeId] = this.docs;
    localStorage.setItem('app_data', JSON.stringify(data));
  }

  loadDocsFromStorage() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const stored = data.devDocs?.[this.societeId];
    if (stored && stored.length > 0) {
      this.docs = stored;
      this.filterDocs();
    }
  }

  openDoc(doc: any) {
    this.selectedDoc = doc;
  }

  openLink(link: string) {
    const url = this.externalLinks[link.toLowerCase()];
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
      this.snackBar.open('Ouverture: ' + link, 'Fermer', { duration: 3000 });
    } else {
      this.snackBar.open('Lien non configuré pour ' + link, 'Fermer', { duration: 3000 });
    }
  }

  uploadedFiles: any[] = [];
  uploadProgress = 0;

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.uploadFile(file, i, files.length);
      }
    }
    event.target.value = '';
  }

  uploadFile(file: File, index: number, total: number) {
    this.uploadProgress = 0;
    const folder = this.selectedFolder || this.getFileFolder(file.name);
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          data: file,
          date: new Date().toISOString().split('T')[0],
          folder: folder
        };
        this.uploadedFiles.push(fileData);
        this.saveFilesToStorage();
        this.snackBar.open('Fichier importé: ' + file.name, 'Fermer', { duration: 3000 });
      }
    }, 100);
  }

  getFileFolder(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].indexOf(ext) >= 0) return 'Images';
    if (['js', 'ts', 'html', 'css', 'json', 'md', 'txt'].indexOf(ext) >= 0) return 'Code';
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].indexOf(ext) >= 0) return 'Documents';
    return 'Autres';
  }

  getFilesInFolder() {
    if (!this.selectedFolder) return this.uploadedFiles;
    return this.uploadedFiles.filter((f: any) => f.folder === this.selectedFolder);
  }

  saveFilesToStorage() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    if (!data.devFiles) data.devFiles = {};
    data.devFiles[this.societeId] = this.uploadedFiles.map((f: any) => ({ name: f.name, size: f.size, type: f.type, date: f.date }));
    localStorage.setItem('app_data', JSON.stringify(data));
  }

  loadFilesFromStorage() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    this.uploadedFiles = data.devFiles?.[this.societeId] || [];
  }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'picture_as_pdf';
      case 'doc':
      case 'docx': return 'description';
      case 'xls':
      case 'xlsx': return 'table_chart';
      case 'txt': return 'text_snippet';
      case 'md': return 'article';
      case 'js':
      case 'ts': return 'code';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'data_object';
      default: return 'insert_drive_file';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  downloadFile(file: any) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file.data);
    link.download = file.name;
    link.click();
    this.snackBar.open('Téléchargement: ' + file.name, 'Fermer', { duration: 3000 });
  }

  deleteFile(file: any) {
    if (confirm('Voulez-vous supprimer ce fichier?')) {
      this.uploadedFiles = this.uploadedFiles.filter((f: any) => f.name !== file.name);
      this.saveFilesToStorage();
      this.snackBar.open('Fichier supprimé', 'Fermer', { duration: 3000 });
    }
  }
}

