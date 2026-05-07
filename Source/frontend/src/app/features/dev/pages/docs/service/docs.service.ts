import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Doc, UploadedFile, ExternalLinks } from '../model/docs.model';

@Injectable({
  providedIn: 'root'
})
export class DocsService {
  constructor(private api: ApiService) {}

  getCurrentUser() {
    return this.api.getCurrentUser();
  }

  getCurrentSocieteId(): string {
    return this.api.getCurrentSocieteId();
  }

  saveDocsToStorage(docs: Doc[], societeId: string) {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    if (!data.devDocs) data.devDocs = {};
    data.devDocs[societeId] = docs;
    localStorage.setItem('app_data', JSON.stringify(data));
  }

  loadDocsFromStorage(societeId: string): Doc[] | null {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const stored = data.devDocs?.[societeId];
    return stored && stored.length > 0 ? stored : null;
  }

  saveFilesToStorage(files: UploadedFile[], societeId: string) {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    if (!data.devFiles) data.devFiles = {};
    data.devFiles[societeId] = files.map((f: UploadedFile) => ({ 
      name: f.name, 
      size: f.size, 
      type: f.type, 
      date: f.date 
    }));
    localStorage.setItem('app_data', JSON.stringify(data));
  }

  loadFilesFromStorage(societeId: string): UploadedFile[] {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    return data.devFiles?.[societeId] || [];
  }

  loadExternalLinks(societeId: string): ExternalLinks {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const societe = data.societes?.find((s: any) => s.id === societeId);
    const defaultLinks: ExternalLinks = {
      git: 'https://github.com',
      jira: 'https://jira.com',
      figma: 'https://figma.com',
      confluence: 'https://confluence.com'
    };
    if (societe?.externalLinks) {
      return { ...defaultLinks, ...societe.externalLinks };
    }
    return defaultLinks;
  }

  getFileFolder(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].indexOf(ext) >= 0) return 'Images';
    if (['js', 'ts', 'html', 'css', 'json', 'md', 'txt'].indexOf(ext) >= 0) return 'Code';
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].indexOf(ext) >= 0) return 'Documents';
    return 'Autres';
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
}
