import { POKEMON_IMAGE_SIZE } from "./pokemon.constants";
import { createPokemonId } from "@/utils/createPokemonId";
import type { Pokemon, PokemonFormValues, PokemonImageSource } from "./pokemonTypes";

interface CreateLocalPokemonOptions {
  values: PokemonFormValues;
  imageSource: PokemonImageSource;
  createdAt?: string;
  imageSize?: typeof POKEMON_IMAGE_SIZE;
}

export function createLocalPokemon({ values, imageSource, createdAt = new Date().toISOString(), imageSize = POKEMON_IMAGE_SIZE }: CreateLocalPokemonOptions): Pokemon {
  return {
    id: createPokemonId(values.name),
    name: values.name.trim(),
    image: values.image.trim(),
    hp: Number(values.hp),
    attack: Number(values.attack),
    defense: Number(values.defense),
    speed: Number(values.speed),
    height: Number(values.height),
    weight: Number(values.weight),
    types: [...values.types],
    origin: "created",
    imageSource,
    imageWidth: imageSize.width,
    imageHeight: imageSize.height,
    createdAt,
  };
}
