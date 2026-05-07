import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DocsService } from '../service/docs.service';
import { Doc, UploadedFile, ExternalLinks, DocForm } from '../model/docs.model';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  private docsService = inject(DocsService);
  private snackBar = inject(MatSnackBar);
  
  searchQuery = '';
  societeNom = '';
  societeId = '';
  selectedDoc: Doc | null = null;
  showDocForm = false;
  editingDoc: Doc | null = null;
  docForm: DocForm = { title: '', description: '', icon: 'article' };
  externalLinks: ExternalLinks = {
    git: 'https://github.com',
    jira: 'https://jira.com',
    figma: 'https://figma.com',
    confluence: 'https://confluence.com'
  };

  folders = ['Documents', 'Images', 'Code', 'Autres'];
  selectedFolder = '';
  newFolderName = '';

  docs: Doc[] = [
    { type: 'api', title: 'API Endpoints', description: 'Documentation des endpoints REST', icon: 'api' },
    { type: 'db', title: 'Schémas Base de données', description: 'Structure des tables et relations', icon: 'storage' },
    { type: 'guides', title: 'Guides Techniques', description: 'Tutoriels et bonnes pratiques', icon: 'menu_book' },
    { type: 'workflow', title: 'Workflow', description: 'Processus de développement', icon: 'account_tree' }
  ];
  filteredDocs = this.docs;

  uploadedFiles: UploadedFile[] = [];
  uploadProgress = 0;

  ngOnInit() {
    const user = this.docsService.getCurrentUser();
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.societeId = this.docsService.getCurrentSocieteId();
    this.loadExternalLinks();
    this.loadDocsFromStorage();
    this.loadFilesFromStorage();
  }

  loadExternalLinks() {
    this.externalLinks = this.docsService.loadExternalLinks(this.societeId);
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

  editDoc(doc: Doc) {
    this.editingDoc = doc;
    this.docForm = { ...doc };
    this.showDocForm = true;
  }

  deleteDoc(doc: Doc) {
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
      const idx = this.docs.findIndex(d => d.type === this.editingDoc!.type);
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
    this.docsService.saveDocsToStorage(this.docs, this.societeId);
  }

  loadDocsFromStorage() {
    const stored = this.docsService.loadDocsFromStorage(this.societeId);
    if (stored) {
      this.docs = stored;
      this.filterDocs();
    }
  }

  openDoc(doc: Doc) {
    this.selectedDoc = doc;
  }

  openLink(link: string) {
    const url = this.externalLinks[link.toLowerCase() as keyof ExternalLinks];
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
      this.snackBar.open('Ouverture: ' + link, 'Fermer', { duration: 3000 });
    } else {
      this.snackBar.open('Lien non configuré pour ' + link, 'Fermer', { duration: 3000 });
    }
  }

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
    const folder = this.selectedFolder || this.docsService.getFileFolder(file.name);
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        const fileData: UploadedFile = {
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

  getFilesInFolder() {
    if (!this.selectedFolder) return this.uploadedFiles;
    return this.uploadedFiles.filter(f => f.folder === this.selectedFolder);
  }

  saveFilesToStorage() {
    this.docsService.saveFilesToStorage(this.uploadedFiles, this.societeId);
  }

  loadFilesFromStorage() {
    this.uploadedFiles = this.docsService.loadFilesFromStorage(this.societeId);
  }

  getFileIcon(filename: string): string {
    return this.docsService.getFileIcon(filename);
  }

  formatFileSize(bytes: number): string {
    return this.docsService.formatFileSize(bytes);
  }

  downloadFile(file: UploadedFile) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file.data);
    link.download = file.name;
    link.click();
    this.snackBar.open('Téléchargement: ' + file.name, 'Fermer', { duration: 3000 });
  }

  deleteFile(file: UploadedFile) {
    if (confirm('Voulez-vous supprimer ce fichier?')) {
      this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== file.name);
      this.saveFilesToStorage();
      this.snackBar.open('Fichier supprimé', 'Fermer', { duration: 3000 });
    }
  }
}
