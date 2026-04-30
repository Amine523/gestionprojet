import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportToExcel(data: any[], fileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  exportToPdf(columns: string[], data: any[][], fileName: string, title: string): void {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleString()}`, 14, 30);

    (doc as any).autoTable({
      head: [columns],
      body: data,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [2, 132, 199] },
      styles: { fontSize: 9 }
    });

    doc.save(`${fileName}.pdf`);
  }

  generateProjectIntelligenceReport(project: any, stats: any): void {
    const doc = new jsPDF();
    const primaryColor = [79, 70, 229]; // Indigo-600
    
    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('RAPPORT D\'INTELLIGENCE PROJET', 14, 25);
    
    doc.setFontSize(10);
    doc.text(`Généré par GestProjet Intelligence - ${new Date().toLocaleDateString()}`, 14, 33);

    // Project Info
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text(project.nom.toUpperCase(), 14, 55);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Client: ${project.nomClient}`, 14, 62);
    doc.text(`Chef de Projet: ${project.chef}`, 14, 67);
    doc.text(`Période: ${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`, 14, 72);

    // Health Score Block
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(140, 48, 56, 30, 3, 3, 'FD');
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(8);
    doc.text('SCORE DE SANTÉ', 145, 55);
    doc.setFontSize(24);
    doc.text(`${project.healthScore}/100`, 145, 68);
    
    // Progress Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.text('Indicateurs de Progression', 14, 85);
    
    const progressData = [
      ['Type de Mesure', 'Valeur', 'Statut'],
      ['Progression Linéaire', `${project.avancee}%`, 'Déclaratif'],
      ['Progression Pondérée (IA)', `${project.avanceeCalculee}%`, 'Calculé par Effort'],
      ['Date de Fin Prévue (IA)', project.endDatePredicted ? new Date(project.endDatePredicted).toLocaleDateString() : 'N/A', project.healthColor === 'Rouge' ? 'Retard Risqué' : 'Sous Contrôle']
    ];

    (doc as any).autoTable({
      head: [progressData[0]],
      body: progressData.slice(1),
      startY: 90,
      theme: 'striped',
      headStyles: { fillColor: primaryColor }
    });

    // Performance Summary
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Analyse de Performance de l\'Équipe', 14, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('Le score de santé est calculé en comparant la vélocité actuelle de l\'équipe par rapport à la timeline théorique.', 14, finalY + 7);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Document confidentiel généré par le moteur GestProjet Lifecycle.', 105, 285, { align: 'center' });

    doc.save(`Rapport_Intelligence_${project.nom.replace(/\s+/g, '_')}.pdf`);
  }
}
