'use client'

import { create } from 'zustand'
import type { ChartAnnotation } from './types'

type AnnotationState = {
  annotations: ChartAnnotation[]
  addAnnotation: (a: Omit<ChartAnnotation, 'id'>) => void
  removeAnnotation: (id: string) => void
  setAnnotations: (next: ChartAnnotation[]) => void
}

function makeId() {
  // Prefer crypto UUID, fall back to time+random.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = globalThis.crypto
    if (c?.randomUUID) return c.randomUUID()
  } catch {}
  return `anno_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export const useChartAnnotationStore = create<AnnotationState>((set) => ({
  annotations: [],
  addAnnotation: (a) =>
    set((s) => ({
      annotations: [...s.annotations, { ...a, id: makeId() }],
    })),
  removeAnnotation: (id) => set((s) => ({ annotations: s.annotations.filter((x) => x.id !== id) })),
  setAnnotations: (next) => set({ annotations: next }),
}))

