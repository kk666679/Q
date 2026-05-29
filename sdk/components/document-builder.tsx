'use client';

import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCreateDocument, useUpdateDocument } from '../client/hooks';
import type { Document } from '../types/index';

interface DocumentSection {
  id: string;
  type: 'header' | 'paragraph' | 'list' | 'table' | 'image' | 'signature';
  content: string;
  metadata?: Record<string, any>;
}

const sectionTemplates: DocumentSection[] = [
  { id: 'header-template', type: 'header', content: 'Document Header' },
  { id: 'paragraph-template', type: 'paragraph', content: 'This is a paragraph section. Click to edit content.' },
  { id: 'list-template', type: 'list', content: '• Item 1\n• Item 2\n• Item 3' },
  { id: 'table-template', type: 'table', content: 'Column 1 | Column 2\n--- | ---\nData 1 | Data 2' },
  { id: 'image-template', type: 'image', content: '[Image Placeholder]' },
  { id: 'signature-template', type: 'signature', content: 'Signature: _________________ Date: _______' },
];

interface SortableSectionProps {
  section: DocumentSection;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

function SortableSection({ section, onEdit, onDelete }: SortableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(section.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onEdit(section.id, editContent);
    setIsEditing(false);
  };

  const getSectionIcon = (type: string) => {
    const icons = {
      header: '📝',
      paragraph: '📄',
      list: '📋',
      table: '📊',
      image: '🖼️',
      signature: '✍️',
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="mb-2 cursor-move" {...listeners}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span>{getSectionIcon(section.type)}</span>
              <Badge variant="outline">{section.type}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(section.id)}
              >
                Delete
              </Button>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Enter content..."
              />
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm">
              {section.content}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface DocumentBuilderProps {
  document?: Document;
  onSave?: (document: Document) => void;
}

export function DocumentBuilder({ document, onSave }: DocumentBuilderProps) {
  const [sections, setSections] = useState<DocumentSection[]>(
    document?.metadata?.sections || []
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState(document?.title || '');
  const [documentType, setDocumentType] = useState<Document["type"]>(document?.type || 'procedure');

  const createDocumentMutation = useCreateDocument();
  const updateDocumentMutation = useUpdateDocument();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const addSection = useCallback((template: DocumentSection) => {
    const newSection: DocumentSection = {
      ...template,
      id: `section-${Date.now()}-${Math.random()}`,
    };
    setSections(prev => [...prev, newSection]);
  }, []);

  const editSection = useCallback((id: string, content: string) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, content } : section
    ));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  }, []);

  const saveDocument = useCallback(async () => {
    const documentData = {
      title: documentTitle,
      type: documentType as any,
      content: sections.map(s => s.content).join('\n\n'),
      version: '1.0',
      status: 'draft' as any,
      tags: [],
      metadata: { sections },
    };

    try {
      if (document?.id) {
        await updateDocumentMutation.mutateAsync({
          id: document.id,
          data: documentData,
        });
      } else {
        await createDocumentMutation.mutateAsync(documentData);
      }
      // documentData matches the SDK mutation payload; the full Document type includes
      // id/createdAt/updatedAt which are typically returned by the server.
      onSave?.(documentData as unknown as Document);
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  }, [
    documentTitle,
    documentType,
    sections,
    document?.id,
    updateDocumentMutation,
    createDocumentMutation,
    onSave,
  ]);

  const activeSection = sections.find(section => section.id === activeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-12 gap-6 h-full"
    >
      {/* Section Templates */}
      <div className="col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Section Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sectionTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => addSection(template)}
              >
                <span className="mr-2">
                  {template.type === 'header' && '📝'}
                  {template.type === 'paragraph' && '📄'}
                  {template.type === 'list' && '📋'}
                  {template.type === 'table' && '📊'}
                  {template.type === 'image' && '🖼️'}
                  {template.type === 'signature' && '✍️'}
                </span>
                {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Document Builder */}
      <div className="col-span-6">
        <Card className="h-full">
          <CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Document Title</label>
                  <input
                    type="text"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter document title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Document Type</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as Document["type"])}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="procedure">Procedure</option>
                    <option value="policy">Policy</option>
                    <option value="form">Form</option>
                    <option value="template">Template</option>
                    <option value="report">Report</option>
                  </select>
                </div>
              </div>
              <Button 
                onClick={saveDocument}
                disabled={createDocumentMutation.isPending || updateDocumentMutation.isPending}
              >
                Save Document
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      onEdit={editSection}
                      onDelete={deleteSection}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeSection ? (
                  <Card className="opacity-90">
                    <CardContent className="p-4">
                      <Badge variant="outline">{activeSection.type}</Badge>
                      <div className="mt-2 text-sm">{activeSection.content}</div>
                    </CardContent>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>

            {sections.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No sections added yet.</p>
                <p>Drag and drop sections from the templates to start building your document.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document Preview */}
      <div className="col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h2 className="text-lg font-semibold">{documentTitle || 'Untitled Document'}</h2>
                <Badge variant="outline">{documentType}</Badge>
              </div>
              <div className="space-y-3 text-sm">
                {sections.map((section, index) => (
                  <div key={section.id} className="border-l-2 border-gray-200 pl-3">
                    <div className="text-xs text-gray-500 mb-1">
                      {section.type.toUpperCase()} {index + 1}
                    </div>
                    <div className="whitespace-pre-wrap">{section.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}