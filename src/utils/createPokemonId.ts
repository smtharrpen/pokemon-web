// Genera un ID local con prefijo estable para evitar colisiones con la API.
import { LOCAL_POKEMON_PREFIX } from "@/features/pokemon/pokemon.constants";

export function createPokemonId(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `${LOCAL_POKEMON_PREFIX}${slug || "pokemon"}-${suffix}`;
}
