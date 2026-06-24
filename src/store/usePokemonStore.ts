// Store de pokemones con base mockeada y pokemones creados.
import { create } from "zustand";
import { pokemonMock } from "@/mocks/pokemonMock";
import { getAllPokemons, getPokemonById as selectPokemonById } from "@/features/pokemon/pokemonSelectors";
import { LOCAL_POKEMON_PREFIX } from "@/features/pokemon/pokemon.constants";
import { readCreatedPokemonsFromStorage, writeCreatedPokemonsToStorage } from "@/features/pokemon/pokemonStorage";
import { normalizeText } from "@/utils/normalizeText";
import type { Pokemon } from "@/features/pokemon/pokemonTypes";

interface PokemonStore {
  pokemons: Pokemon[];
  apiPokemons: Pokemon[];
  allPokemons: Pokemon[];
  createdPokemons: Pokemon[];
  hasHydratedCreatedPokemons: boolean;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  setStatus: (status: PokemonStore["status"], error?: string | null) => void;
  addPokemon: (pokemon: Pokemon) => void;
  addCreatedPokemon: (pokemon: Pokemon) => void;
  removeCreatedPokemon: (id: string) => void;
  hydrateCreatedPokemons: () => void;
  getPokemonById: (id: string) => Pokemon | undefined;
}

function buildPokemonCollections(apiPokemons: Pokemon[], createdPokemons: Pokemon[]): Pick<PokemonStore, "createdPokemons" | "allPokemons"> {
  return {
    createdPokemons,
    allPokemons: getAllPokemons(apiPokemons, createdPokemons),
  };
}

function hasPokemonName(pokemons: Pokemon[], name: string): boolean {
  const normalizedName = normalizeText(name);
  return pokemons.some((pokemon) => normalizeText(pokemon.name) === normalizedName);
}

function canStoreCreatedPokemon(state: PokemonStore, pokemon: Pokemon): boolean {
  if (pokemon.origin !== "created") return false;
  if (!pokemon.id.startsWith(LOCAL_POKEMON_PREFIX)) return false;
  if (hasPokemonName(state.apiPokemons, pokemon.name)) return false;
  if (hasPokemonName(state.createdPokemons, pokemon.name)) return false;
  return !state.createdPokemons.some((item) => item.id === pokemon.id);
}

function sanitizeCreatedPokemons(apiPokemons: Pokemon[], createdPokemons: Pokemon[]): Pokemon[] {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  return createdPokemons.filter((pokemon) => {
    const normalizedName = normalizeText(pokemon.name);
    if (seenIds.has(pokemon.id) || seenNames.has(normalizedName)) return false;
    if (hasPokemonName(apiPokemons, pokemon.name)) return false;

    seenIds.add(pokemon.id);
    seenNames.add(normalizedName);
    return true;
  });
}

export const usePokemonStore = create<PokemonStore>((set, get) => ({
  pokemons: pokemonMock,
  apiPokemons: pokemonMock,
  allPokemons: pokemonMock,
  createdPokemons: [],
  hasHydratedCreatedPokemons: false,
  status: "success",
  error: null,
  setStatus: (status, error = null) => set({ status, error }),
  addPokemon: (pokemon) => get().addCreatedPokemon(pokemon),
  addCreatedPokemon: (pokemon) =>
    set((state) => {
      if (!canStoreCreatedPokemon(state, pokemon)) return {};

      const nextCreatedPokemons = [...state.createdPokemons, pokemon];
      writeCreatedPokemonsToStorage(nextCreatedPokemons);
      return buildPokemonCollections(state.apiPokemons, nextCreatedPokemons);
    }),
  removeCreatedPokemon: (id) =>
    set((state) => {
      const nextCreatedPokemons = state.createdPokemons.filter((pokemon) => pokemon.id !== id);
      if (nextCreatedPokemons.length === state.createdPokemons.length) return {};

      writeCreatedPokemonsToStorage(nextCreatedPokemons);
      return buildPokemonCollections(state.apiPokemons, nextCreatedPokemons);
    }),
  hydrateCreatedPokemons: () =>
    set((state) => {
      const hydratedPokemons = sanitizeCreatedPokemons(state.apiPokemons, readCreatedPokemonsFromStorage());
      writeCreatedPokemonsToStorage(hydratedPokemons);
      return { ...buildPokemonCollections(state.apiPokemons, hydratedPokemons), hasHydratedCreatedPokemons: true };
    }),
  getPokemonById: (id) => {
    return get().createdPokemons.find((pokemon) => pokemon.id === id) ?? selectPokemonById(get().apiPokemons, id);
  },
}));
