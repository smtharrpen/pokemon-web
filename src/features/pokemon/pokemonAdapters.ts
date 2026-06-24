// Convierte datos de formulario y mocks al formato interno del dominio.
import { createLocalPokemon } from "./createLocalPokemon";
import type { Pokemon, PokemonFormValues, PokemonImageSource } from "./pokemonTypes";

export function adaptPokemonFromForm(values: PokemonFormValues, imageSource: PokemonImageSource = "url"): Pokemon {
  return createLocalPokemon({ values, imageSource });
}

export function adaptPokemonFromMock(pokemon: Pokemon): Pokemon {
  return { ...pokemon };
}
