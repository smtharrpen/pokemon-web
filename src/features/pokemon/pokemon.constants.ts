export const POKEMON_IMAGE_SIZE = {
  width: 96,
  height: 96,
} as const;

export const MIN_POKEMON_TYPES = 1;
export const MAX_POKEMON_TYPES = 2;

export const LOCAL_POKEMON_PREFIX = "local-";
export const CREATED_POKEMONS_STORAGE_KEY = "pokemon-web.createdPokemons";

export const POKEMON_STAT_LIMITS = {
  hp: { min: 1, max: 255 },
  attack: { min: 1, max: 255 },
  defense: { min: 1, max: 255 },
  speed: { min: 1, max: 255 },
  height: { min: 1, max: 100 },
  weight: { min: 1, max: 1000 },
} as const;
