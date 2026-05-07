import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dev-docs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './dev-docs.component.html',
  styleUrls: ['./dev-docs.component.scss']
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

