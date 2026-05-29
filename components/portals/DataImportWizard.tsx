'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface ImportRow {
  [key: string]: string;
}

interface ImportResult {
  total: number;
  imported: number;
  errors: string[];
  preview: ImportRow[];
}

export function DataImportWizard() {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
    });
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setResult({ total: 0, imported: 0, errors: ['Only CSV files are supported.'], preview: [] });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      const errors: string[] = [];
      rows.forEach((row, i) => {
        if (!row['title'] && !row['name'] && !row['id']) {
          errors.push(`Row ${i + 2}: missing required field (title/name/id)`);
        }
      });
      setResult({
        total: rows.length,
        imported: rows.length - errors.length,
        errors,
        preview: rows.slice(0, 5),
      });
    };
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-500" />
          CSV / Excel Import Wizard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Drop CSV file here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports QMS records, risk registers, document lists, supplier data
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted p-2">
                <p className="text-lg font-bold">{result.total}</p>
                <p className="text-xs text-muted-foreground">Total Rows</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2">
                <p className="text-lg font-bold text-green-600">{result.imported}</p>
                <p className="text-xs text-muted-foreground">Ready to Import</p>
              </div>
              <div className={`rounded-lg p-2 ${result.errors.length > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className={`text-lg font-bold ${result.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.errors.length}
                </p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="rounded-lg bg-red-50 p-3 space-y-1">
                <p className="text-xs font-medium text-red-700 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Validation Errors
                </p>
                {result.errors.slice(0, 3).map((err, i) => (
                  <p key={i} className="text-xs text-red-600">{err}</p>
                ))}
                {result.errors.length > 3 && (
                  <p className="text-xs text-red-500">+{result.errors.length - 3} more errors</p>
                )}
              </div>
            )}

            {result.preview.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Preview (first 5 rows)</p>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        {Object.keys(result.preview[0]).map((h) => (
                          <th key={h} className="px-2 py-1.5 text-left font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.preview.map((row, i) => (
                        <tr key={i} className="border-t">
                          {Object.values(row).map((v, j) => (
                            <td key={j} className="px-2 py-1.5 truncate max-w-[120px]">{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {result.imported > 0 && (
              <Button className="w-full gap-2">
                <CheckCircle className="h-4 w-4" />
                Import {result.imported} Records
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
