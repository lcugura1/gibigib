const UTF8_BOM = '﻿';

export function downloadCsv(fileName: string, csv: string) {
  const url = URL.createObjectURL(new Blob([UTF8_BOM, csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
