// Selecciona y deriva colecciones de pokemones sin efectos secundarios.
import { getPaginatedSlice, getTotalPages } from "@/utils/pagination";
import { filterByOrigin, filterBySearch, filterByType } from "./pokemonFilters";
import { sortStrategies } from "./pokemonSorters";
import type { Pokemon, PokemonFilters, PokemonTypeName, PokemonSortOption } from "./pokemonTypes";

export function getAllPokemons(basePokemons: Pokemon[], createdPokemons: Pokemon[]): Pokemon[] {
  return [...basePokemons, ...createdPokemons];
}

export function getPokemonById(allPokemons: Pokemon[], id: string): Pokemon | undefined {
  return allPokemons.find((pokemon) => pokemon.id === id);
}

export function getFilteredPokemons(allPokemons: Pokemon[], filters: PokemonFilters): Pokemon[] {
  const bySearch = filterBySearch(allPokemons, filters.search);
  const byType = filterByType(bySearch, filters.selectedType);
  return filterByOrigin(byType, filters.selectedOrigin);
}

export function getSortedPokemons(pokemons: Pokemon[], sortBy: PokemonSortOption): Pokemon[] {
  return sortStrategies[sortBy](pokemons);
}

export function getPaginatedPokemons(pokemons: Pokemon[], currentPage: number, pageSize: number): Pokemon[] {
  return getPaginatedSlice(pokemons, currentPage, pageSize);
}

export function getAvailableTypes(pokemons: Pokemon[]): PokemonTypeName[] {
  const types = new Set<PokemonTypeName>();
  pokemons.forEach((pokemon) => pokemon.types.forEach((type) => types.add(type)));
  return [...types].sort((a, b) => a.localeCompare(b));
}

function getVisiblePokemonsFromAll(allPokemons: Pokemon[], filters: PokemonFilters): Pokemon[] {
  return getSortedPokemons(getFilteredPokemons(allPokemons, filters), filters.sortBy);
}

export function getVisiblePokemons(allPokemons: Pokemon[], filters: PokemonFilters): Pokemon[];
export function getVisiblePokemons(basePokemons: Pokemon[], createdPokemons: Pokemon[], filters: PokemonFilters): Pokemon[];
export function getVisiblePokemons(...args: [Pokemon[], PokemonFilters] | [Pokemon[], Pokemon[], PokemonFilters]): Pokemon[] {
  if (args.length === 2) {
    const [allPokemons, filters] = args;
    return getVisiblePokemonsFromAll(allPokemons, filters);
  }

  const [basePokemons, createdPokemons, filters] = args;
  return getVisiblePokemonsFromAll(getAllPokemons(basePokemons, createdPokemons), filters);
}

export function getVisiblePokemonPageCount(allPokemons: Pokemon[], filters: PokemonFilters, pageSize: number): number;
export function getVisiblePokemonPageCount(basePokemons: Pokemon[], createdPokemons: Pokemon[], filters: PokemonFilters, pageSize: number): number;
export function getVisiblePokemonPageCount(...args: [Pokemon[], PokemonFilters, number] | [Pokemon[], Pokemon[], PokemonFilters, number]): number {
  if (args.length === 3) {
    const [allPokemons, filters, pageSize] = args;
    return getTotalPages(getVisiblePokemonsFromAll(allPokemons, filters).length, pageSize);
  }

  const [basePokemons, createdPokemons, filters, pageSize] = args;
  return getTotalPages(getVisiblePokemonsFromAll(getAllPokemons(basePokemons, createdPokemons), filters).length, pageSize);
}

export function getFilteredPokemonById(allPokemons: Pokemon[], id: string): Pokemon | undefined;
export function getFilteredPokemonById(basePokemons: Pokemon[], createdPokemons: Pokemon[], id: string): Pokemon | undefined;
export function getFilteredPokemonById(...args: [Pokemon[], string] | [Pokemon[], Pokemon[], string]): Pokemon | undefined {
  if (args.length === 2) {
    const [allPokemons, id] = args;
    return getPokemonById(allPokemons, id);
  }

  const [basePokemons, createdPokemons, id] = args;
  return getPokemonById(getAllPokemons(basePokemons, createdPokemons), id);
}
