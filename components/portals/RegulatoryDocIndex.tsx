'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Search } from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';
import { trpc } from '@/lib/sdk';
import type { Document } from '@/lib/types';

interface RegDoc {
  id: string;
  title: string;
  category: string;
  version: string;
  status: 'approved' | 'draft' | 'under-review' | 'obsolete';
  owner: string;
  reviewDate: string;
}

const statusColor: Record<RegDoc['status'], string> = {
  approved: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  obsolete: 'bg-red-100 text-red-800',
};

interface RegulatoryDocIndexProps {
  categories: string[];
}

function mapDocumentToRegDoc(doc: Document): RegDoc {
  const category = doc.metadata?.keywords?.[0] ?? doc.type.replace(/-/g, ' ');
  const status = doc.status === 'review' ? 'under-review' : doc.status;
  return {
    id: doc.id,
    title: doc.title,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    version: `v${doc.version}.0`,
    status,
    owner: doc.createdBy,
    reviewDate: new Date(doc.updatedAt).toISOString().slice(0, 10),
  };
}

export function RegulatoryDocIndex({ categories }: RegulatoryDocIndexProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: documents = [] } = trpc.document.list.useQuery();

  const docs = useMemo(() => documents.map(mapDocumentToRegDoc), [documents]);

  const filtered = useMemo(
    () => docs.filter((doc) => {
      const matchSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.id.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === 'All' || doc.category === activeCategory;
      return matchSearch && matchCategory;
    }),
    [docs, search, activeCategory],
  );

  const allCategories = useMemo(
    () => ['All', ...new Set(categories.length ? categories : docs.map((doc) => doc.category))],
    [categories, docs],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-500" />
          Regulatory Document Index
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(docs as unknown as Record<string, unknown>[], 'regulatory-docs.csv')}>
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allCategories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.id} · {doc.version} · Owner: {doc.owner} · Review: {doc.reviewDate}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                <Badge className={`text-xs ${statusColor[doc.status]}`}>{doc.status}</Badge>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No documents found.</p>
          )}
        </div>

        <div className="flex gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500 inline-block" />Approved: {docs.filter((d) => d.status === 'approved').length}</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />Under Review: {docs.filter((d) => d.status === 'under-review').length}</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-400 inline-block" />Draft: {docs.filter((d) => d.status === 'draft').length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
