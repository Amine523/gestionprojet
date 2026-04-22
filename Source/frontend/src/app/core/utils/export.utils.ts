export class ExportUtils {
  /**
   * Export JSON data to CSV and trigger download
   * @param data Array of objects to export
   * @param filename Desired filename
   * @param headers Optional mapping of keys to localized headers
   */
  static exportToCSV(data: any[], filename: string, headers: { [key: string]: string } = {}): void {

    if (!data || !data.length) return;

    const columnKeys = Object.keys(data[0]);
    const csvHeader = columnKeys.map(key => headers[key] || key).join(';');
    
    const csvRows = data.map(row => {
      return columnKeys.map(key => {
        const val = row[key];
        // Handle strings with separators
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        // Handle dates
        if (val instanceof Date) {
          return val.toLocaleDateString('fr-FR');
        }
        return val !== null && val !== undefined ? val : '';
      }).join(';');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
