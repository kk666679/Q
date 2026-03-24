export const downloadCSV = (data: any[], filename: string, columns?: string[]) => {
  const header = columns ? columns.join(',') : Object.keys(data[0] || {}).join(',');
  const csv = [
    header,
    ...data.map(row => 
      columns 
        ? columns.map(col => JSON.stringify(row[col] || '')).join(',')
        : Object.values(row).map(value => JSON.stringify(value || '')).join(',')
    )
  ].join('\\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
