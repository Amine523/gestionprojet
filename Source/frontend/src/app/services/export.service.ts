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
      headStyles: { fillBlue: [2, 132, 199] },
      styles: { fontSize: 9 }
    });

    doc.save(`${fileName}.pdf`);
  }
}
