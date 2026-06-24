// Servicio mock que simula acceso a datos de pokemones y tipos.
import { pokemonMock } from "@/mocks/pokemonMock";
import { pokemonTypeMock } from "@/mocks/typeMock";
import { createLocalPokemon } from "@/features/pokemon/createLocalPokemon";
import { LOCAL_POKEMON_PREFIX } from "@/features/pokemon/pokemon.constants";
import type { Pokemon, PokemonFormValues, PokemonImageSource, PokemonTypeName } from "@/features/pokemon/pokemonTypes";

function delay<T>(value: T, timeout = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), timeout));
}

export async function getPokemons(): Promise<Pokemon[]> {
  return delay(pokemonMock);
}

export async function getPokemonTypes(): Promise<PokemonTypeName[]> {
  return delay(pokemonTypeMock);
}

export async function getPokemonById(id: string): Promise<Pokemon | undefined> {
  if (id.startsWith(LOCAL_POKEMON_PREFIX)) {
    return delay(undefined);
  }

  return delay(pokemonMock.find((pokemon) => pokemon.id === id));
}

export async function createPokemon(values: PokemonFormValues, imageSource: PokemonImageSource): Promise<Pokemon> {
  return delay(createLocalPokemon({ values, imageSource }));
}
