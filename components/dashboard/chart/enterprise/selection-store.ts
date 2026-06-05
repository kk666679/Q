'use client'

import { create } from 'zustand'
import type { SelectionTarget } from './types'

type SelectionState = {
  selected: SelectionTarget | null
  setSelected: (next: SelectionTarget | null) => void
}

export const useChartSelectionStore = create<SelectionState>((set) => ({
  selected: null,
  setSelected: (next) => set({ selected: next }),
}))

