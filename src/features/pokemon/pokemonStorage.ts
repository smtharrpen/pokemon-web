import { CREATED_POKEMONS_STORAGE_KEY, LOCAL_POKEMON_PREFIX, POKEMON_IMAGE_SIZE, POKEMON_STAT_LIMITS } from "./pokemon.constants";
import { pokemonTypeMock } from "@/mocks/typeMock";
import type { Pokemon, PokemonImageSource, PokemonTypeName } from "./pokemonTypes";

const allowedTypes = new Set<PokemonTypeName>(pokemonTypeMock);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return isNumber(value) && value >= min && value <= max;
}

function isPokemonImageSource(value: unknown): value is PokemonImageSource {
  return value === "url" || value === "file";
}

function isPokemonTypeName(value: unknown): value is PokemonTypeName {
  return typeof value === "string" && allowedTypes.has(value as PokemonTypeName);
}

function isStoredPokemon(value: unknown): value is Pokemon {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || !value.id.startsWith(LOCAL_POKEMON_PREFIX)) return false;
  if (typeof value.name !== "string" || typeof value.image !== "string") return false;
  if (value.origin !== "created") return false;
  if (!Array.isArray(value.types) || value.types.length < 1 || value.types.length > 2) return false;
  if (!value.types.every(isPokemonTypeName)) return false;
  if (new Set(value.types).size !== value.types.length) return false;
  if (value.imageSource !== undefined && !isPokemonImageSource(value.imageSource)) return false;
  if (!isNumberInRange(value.hp, POKEMON_STAT_LIMITS.hp.min, POKEMON_STAT_LIMITS.hp.max)) return false;
  if (!isNumberInRange(value.attack, POKEMON_STAT_LIMITS.attack.min, POKEMON_STAT_LIMITS.attack.max)) return false;
  if (!isNumberInRange(value.defense, POKEMON_STAT_LIMITS.defense.min, POKEMON_STAT_LIMITS.defense.max)) return false;
  if (!isNumberInRange(value.speed, POKEMON_STAT_LIMITS.speed.min, POKEMON_STAT_LIMITS.speed.max)) return false;
  if (!isNumberInRange(value.height, POKEMON_STAT_LIMITS.height.min, POKEMON_STAT_LIMITS.height.max)) return false;
  if (!isNumberInRange(value.weight, POKEMON_STAT_LIMITS.weight.min, POKEMON_STAT_LIMITS.weight.max)) return false;
  if (value.imageWidth !== undefined && value.imageWidth !== POKEMON_IMAGE_SIZE.width) return false;
  if (value.imageHeight !== undefined && value.imageHeight !== POKEMON_IMAGE_SIZE.height) return false;
  return true;
}

function normalizeStoredPokemon(value: Pokemon): Pokemon {
  const imageSource = isPokemonImageSource(value.imageSource) ? value.imageSource : value.image.startsWith("data:") ? "file" : "url";

  return {
    ...value,
    imageSource,
    imageWidth: isNumber(value.imageWidth) ? value.imageWidth : POKEMON_IMAGE_SIZE.width,
    imageHeight: isNumber(value.imageHeight) ? value.imageHeight : POKEMON_IMAGE_SIZE.height,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
  };
}

export function readCreatedPokemonsFromStorage(): Pokemon[] {
  if (typeof window === "undefined") return [];

  try {
    const rawPokemons = window.localStorage.getItem(CREATED_POKEMONS_STORAGE_KEY);
    if (!rawPokemons) return [];

    const parsedPokemons: unknown = JSON.parse(rawPokemons);
    if (!Array.isArray(parsedPokemons)) return [];

    return parsedPokemons.filter(isStoredPokemon).map(normalizeStoredPokemon);
  } catch {
    return [];
  }
}

export function writeCreatedPokemonsToStorage(createdPokemons: Pokemon[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CREATED_POKEMONS_STORAGE_KEY, JSON.stringify(createdPokemons));
  } catch {
    // Ignore storage write failures.
  }
}
