// Store de filtros, ordenamiento, búsqueda y paginado.
import { create } from "zustand";
import type { PokemonFilters, PokemonOriginFilter, PokemonSortOption, PokemonTypeName } from "@/features/pokemon/pokemonTypes";

interface FilterStore {
  search: string;
  searchVersion: number;
  selectedType: "all" | PokemonTypeName;
  selectedOrigin: PokemonOriginFilter;
  sortBy: PokemonSortOption;
  currentPage: number;
  pageSize: 12;
  setSearch: (search: string) => void;
  clearSearch: () => void;
  setSelectedType: (type: "all" | PokemonTypeName) => void;
  setSelectedOrigin: (origin: PokemonOriginFilter) => void;
  setSortBy: (sortBy: PokemonSortOption) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  resetAllControls: () => void;
  toFilters: () => PokemonFilters;
}

const baseState = {
  search: "",
  searchVersion: 0,
  selectedType: "all" as const,
  selectedOrigin: "all" as const,
  sortBy: "none" as const,
  currentPage: 1,
  pageSize: 12 as const,
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...baseState,
  setSearch: (search) => set({ search, currentPage: 1 }),
  clearSearch: () => set((state) => ({ search: "", currentPage: 1, searchVersion: state.searchVersion + 1 })),
  setSelectedType: (selectedType) => set({ selectedType, currentPage: 1 }),
  setSelectedOrigin: (selectedOrigin) => set({ selectedOrigin, currentPage: 1 }),
  setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  resetFilters: () => set({ selectedType: "all", selectedOrigin: "all", sortBy: "none", currentPage: 1 }),
  resetAllControls: () => set((state) => ({ ...baseState, searchVersion: state.searchVersion + 1 })),
  toFilters: () => ({
    search: get().search,
    selectedType: get().selectedType,
    selectedOrigin: get().selectedOrigin,
    sortBy: get().sortBy,
  }),
}));
