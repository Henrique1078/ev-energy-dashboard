import { create } from 'zustand'
import type { EVParameter, VehicleMode } from '../types'

interface FilterStore {
  regions: string[]
  modes: VehicleMode[]
  selectedYears: number[]
  parameter: EVParameter
  setRegions: (regions: string[]) => void
  setModes: (modes: VehicleMode[]) => void
  setSelectedYears: (years: number[]) => void
  setParameter: (parameter: EVParameter) => void
  resetFilters: () => void
}

const defaultFilters = {
  regions: ['China', 'USA', 'Germany', 'France', 'United Kingdom'],
  modes: ['Cars'] as VehicleMode[],
  selectedYears: [2019, 2020, 2021, 2022, 2023],
  parameter: 'EV sales' as EVParameter,
}

export const useFilterStore = create<FilterStore>(set => ({
  ...defaultFilters,
  setRegions: regions => set({ regions }),
  setModes: modes => set({ modes }),
  setSelectedYears: years => set({ selectedYears: years.sort((a, b) => a - b) }),
  setParameter: parameter => set({ parameter }),
  resetFilters: () => set(defaultFilters),
}))
