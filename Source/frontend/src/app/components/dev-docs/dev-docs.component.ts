import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dev-docs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 class="fw-bold" style="font-size: 28px; color: #1a1a2e;">Documentation</h1>
          <p class="text-muted">Accédez aux ressources techniques - {{societeNom}}</p>
        </div>
        <div class="input-group" style="width: 300px;">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" placeholder="Rechercher..." [(ngModel)]="searchQuery" (input)="filterDocs()">
        </div>
      </div>

      <div class="row g-4 mb-4">
        @for (doc of filteredDocs; track doc.type) {
          <div class="col-md-3">
            <div class="card border-0 shadow-sm text-center" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" (click)="openDoc(doc)">
              <div class="card-body">
                <div class="position-absolute top-0 end-0 p-2">
                  <div class="dropdown">
                    <button class="btn btn-sm" data-bs-toggle="dropdown" (click)="$event.stopPropagation()"><i class="bi bi-three-dots-vertical"></i></button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="javascript:void(0)" (click)="editDoc(doc); $event.stopPropagation()"><i class="bi bi-pencil me-2"></i>Modifier</a></li>
                      <li><a class="dropdown-item" href="javascript:void(0)" (click)="deleteDoc(doc); $event.stopPropagation()"><i class="bi bi-trash me-2"></i>Supprimer</a></li>
                    </ul>
                  </div>
                </div>
                <i class="bi bi-journal-code" style="font-size: 40px; color: #4caf50; margin-bottom: 12px;"></i>
                <h5 class="fw-bold mb-2" style="font-size: 16px;">{{doc.title}}</h5>
                <p class="text-muted mb-0" style="font-size: 13px;">{{doc.description}}</p>
              </div>
            </div>
          </div>
        }
        
        <div class="col-md-3">
          <div class="card border-0 shadow-sm d-flex flex-column align-items-center justify-content-center" style="border: 2px dashed #ccc; background: #fafafa; cursor: pointer;" (click)="addNewDoc()">
            <div class="card-body">
              <i class="bi bi-plus" style="font-size: 40px; color: #999; margin-bottom: 12px;"></i>
              <h5 class="fw-bold mb-2 text-muted" style="font-size: 16px;">Ajouter</h5>
              <p class="text-muted mb-0" style="font-size: 13px;">Ajouter un document</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <h5 class="fw-bold mb-3">Liens rapides</h5>
          <div class="d-flex gap-3">
            <a class="d-flex align-items-center gap-2 p-3 rounded-3" style="background: #f9f9f9; cursor: pointer; text-decoration: none; color: inherit;" (click)="openLink('Git')">
              <i class="bi bi-code" style="color: #2196f3;"></i> Dépôt Git
            </a>
            <a class="d-flex align-items-center gap-2 p-3 rounded-3" style="background: #f9f9f9; cursor: pointer; text-decoration: none; color: inherit;" (click)="openLink('Jira')">
              <i class="bi bi-bug" style="color: #2196f3;"></i> Jira
            </a>
            <a class="d-flex align-items-center gap-2 p-3 rounded-3" style="background: #f9f9f9; cursor: pointer; text-decoration: none; color: inherit;" (click)="openLink('Figma')">
              <i class="bi bi-palette" style="color: #2196f3;"></i> Figma
            </a>
            <a class="d-flex align-items-center gap-2 p-3 rounded-3" style="background: #f9f9f9; cursor: pointer; text-decoration: none; color: inherit;" (click)="openLink('Confluence')">
              <i class="bi bi-file-text" style="color: #2196f3;"></i> Confluence
            </a>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
            <h5 class="fw-bold mb-0">Fichiers</h5>
            <div class="d-flex gap-2 flex-grow-1">
              @for (folder of folders; track folder) {
                <button class="btn" [class.btn-success]="selectedFolder === folder" [class.btn-outline-secondary]="selectedFolder !== folder" (click)="selectedFolder = folder">
                  {{folder}}
                </button>
              }
              <button class="btn btn-outline-secondary" (click)="addFolder()">
                <i class="bi bi-plus"></i> Dossier
              </button>
            </div>
            <button class="btn btn-primary" style="background: #2196f3; border: none;" (click)="fileInput.click()">
              <i class="bi bi-upload me-1"></i> Importer vers {{selectedFolder || 'Tous'}}
            </button>
            <input #fileInput type="file" hidden multiple (change)="onFileSelected($event)" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.js,.ts,.html,.css,.json,.png,.jpg,.jpeg,.gif">
          </div>
          
          @if (uploadProgress > 0 && uploadProgress < 100) {
            <div class="progress mb-3">
              <div class="progress-bar" [style.width.%]="uploadProgress"></div>
            </div>
          }

          <div class="row g-3">
            @for (file of getFilesInFolder(); track file.name) {
              <div class="col-md-3">
                <div class="card border-0 shadow-sm">
                  <div class="card-body d-flex align-items-center gap-2">
                    <i class="bi bi-file-earmark" style="color: #666; font-size: 24px;"></i>
                    <div class="flex-grow-1">
                      <div class="fw-medium" style="font-size: 14px;">{{file.name}}</div>
                      <div class="text-muted" style="font-size: 12px;">{{formatFileSize(file.size)}}</div>
                    </div>
                    <div class="d-flex gap-1">
                      <button class="btn btn-sm btn-outline-primary" (click)="downloadFile(file)" title="Télécharger"><i class="bi bi-download"></i></button>
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteFile(file)" title="Supprimer"><i class="bi bi-trash"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="col-12 text-center text-muted p-4">Aucun fichier dans ce dossier</div>
            }
          </div>
        </div>
      </div>

      @if (showDocForm) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header" style="background: #4caf50; color: white; border-radius: 16px 16px 0 0;">
                <h5 class="modal-title">{{editingDoc ? 'Modifier' : 'Ajouter'}} un Document</h5>
                <button type="button" class="btn-close" style="color: white;" (click)="closeDocForm()"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Titre</label>
                  <input type="text" class="form-control" [(ngModel)]="docForm.title" placeholder="Titre du document">
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <input type="text" class="form-control" [(ngModel)]="docForm.description" placeholder="Description">
                </div>
                <div class="mb-3">
                  <label class="form-label">Icône</label>
                  <select class="form-select" [(ngModel)]="docForm.icon">
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
                <button class="btn btn-outline-secondary" (click)="closeDocForm()">Annuler</button>
                <button class="btn" style="background: #4caf50; color: white;" (click)="saveDoc()">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="closeDocForm()"></div>
      }
    </div>

    @if (selectedDoc) {
      <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header" style="background: #4caf50; color: white; border-radius: 16px 16px 0 0;">
              <h5 class="modal-title"><i class="bi bi-journal-code me-2"></i>{{selectedDoc.title}}</h5>
              <button type="button" class="btn-close" style="color: white;" (click)="selectedDoc = null"></button>
            </div>
            <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
              @switch (selectedDoc.type) {
                @case ('api') {
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Authentification</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>POST /api/auth/login
Body: email, password
Response: token, utilisateur</code></pre>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Utilisateurs</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>GET  /api/utilisateurs
POST /api/utilisateurs
PUT  /api/utilisateurs/:id
DELETE /api/utilisateurs/:id</code></pre>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Sociétés</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>GET  /api/societes
POST /api/societes
PUT  /api/societes/:id</code></pre>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Projets</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>GET  /api/projets
POST /api/projets
PUT  /api/projets/:id</code></pre>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Tâches</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>GET  /api/taches
POST /api/taches
PUT  /api/taches/:id</code></pre>
                  </div>
                }
                @case ('db') {
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">societes</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>id, nom, email, telephone, activite, pays, ville, adresse, dateCreation</code></pre>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">utilisateurs</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>id, nom, email, password, societeId, typeUtilisateurId, actif</code></pre>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">projets</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>id, nom, description, societeId, chefId, statut, dateDebut, dateFin</code></pre>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">taches</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>id, titre, description, projetId, assigneeId, priorite, statut, tempsEstime</code></pre>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">pointages</h6>
                    <pre class="p-3 rounded-3" style="background: #f5f5f5;"><code>id, employeId, societeId, date, entre, sortie, totalHeures</code></pre>
                  </div>
                }
                @case ('guides') {
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Architecture</h6>
                    <p>Frontend: Angular 17 + Material</p>
                    <p>Backend: API REST with JWT auth</p>
                    <p>Storage: LocalStorage + optional API</p>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Bonnes pratiques</h6>
                    <ul>
                      <li>Use standalone components</li>
                      <li>Follow reactive patterns</li>
                      <li>Filter data by societeId</li>
                      <li>Handle errors gracefully</li>
                    </ul>
                  </div>
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Code review</h6>
                    <ul>
                      <li>Vérifier les types TypeScript</li>
                      <li>Tester les composant</li>
                      <li>Vérifier le linting</li>
                    </ul>
                  </div>
                }
                @case ('workflow') {
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Cycle de développement</h6>
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
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">Rôles</h6>
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
      </div>
      <div class="modal-backdrop fade show" (click)="selectedDoc = null"></div>
    }
  `,
  styles: [``]
})
export class DevDocsComponent implements OnInit {
  private api = inject(ApiService);
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
        alert('Dossier ajouté: ' + folderName);
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
      alert('Document supprimé');
    }
  }

  closeDocForm() {
    this.showDocForm = false;
    this.editingDoc = null;
  }

  saveDoc() {
    if (!this.docForm.title || !this.docForm.description) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (this.editingDoc) {
      const idx = this.docs.findIndex((d: any) => d.type === this.editingDoc.type);
      if (idx >= 0) {
        this.docs[idx] = { ...this.docForm, type: this.editingDoc.type };
      }
      alert('Document modifié');
    } else {
      const newType = 'doc_' + Date.now();
      this.docs.push({ ...this.docForm, type: newType });
      alert('Document ajouté');
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
      alert('Ouverture: ' + link);
    } else {
      alert('Lien non configuré pour ' + link);
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
        alert('Fichier importé: ' + file.name);
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
    alert('Téléchargement: ' + file.name);
  }

  deleteFile(file: any) {
    if (confirm('Voulez-vous supprimer ce fichier?')) {
      this.uploadedFiles = this.uploadedFiles.filter((f: any) => f.name !== file.name);
      this.saveFilesToStorage();
      alert('Fichier supprimé');
    }
  }
}
