// Valida manualmente el formulario de creación de pokemones.
import type { PokemonFieldErrors, PokemonFormValues, Pokemon, PokemonTypeName } from "./pokemonTypes";
import type { PokemonImageValidationState } from "./pokemonImageValidation";
import { describePokemonImageValidation, isValidImageUrl } from "./pokemonImageValidation";
import { MAX_POKEMON_TYPES, MIN_POKEMON_TYPES, POKEMON_STAT_LIMITS } from "./pokemon.constants";
import { normalizeText } from "@/utils/normalizeText";

function isNumberInRange(value: string, min: number, max: number): boolean {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max;
}

function getStatError(label: string, value: string, min: number, max: number): string | undefined {
  if (!value.trim()) return `${label} es obligatorio.`;
  if (!isNumberInRange(value, min, max)) return `${label} debe estar entre ${min} y ${max}.`;
  return undefined;
}

function getImageError(image: string, imageValidation?: PokemonImageValidationState): string | undefined {
  const trimmedImage = image.trim();
  if (!imageValidation) return undefined;
  if (imageValidation.status === "valid") return undefined;
  if (imageValidation.status === "error") return imageValidation.error ?? describePokemonImageValidation(imageValidation);
  if (imageValidation.status === "validating") return "La imagen se está validando.";
  if (!trimmedImage) return "La imagen es obligatoria.";
  if (!isValidImageUrl(trimmedImage)) return "Ingresa una URL de imagen válida.";
  return undefined;
}

export function validatePokemonForm(values: PokemonFormValues, existingPokemons: Pokemon[], imageValidation?: PokemonImageValidationState): PokemonFieldErrors {
  const errors: PokemonFieldErrors = {};
  const normalizedName = normalizeText(values.name);
  const duplicatedName = existingPokemons.some((pokemon) => normalizeText(pokemon.name) === normalizedName);

  if (!normalizedName) errors.name = "El nombre es obligatorio.";
  else if (normalizedName.length < 2) errors.name = "El nombre debe tener al menos 2 caracteres.";
  else if (duplicatedName) errors.name = "Ya existe un pokemon con ese nombre.";

  const imageError = getImageError(values.image, imageValidation);
  if (imageError) errors.image = imageError;

  const { hp, attack, defense, speed, height, weight } = POKEMON_STAT_LIMITS;
  const hpError = getStatError("La vida", values.hp, hp.min, hp.max);
  const attackError = getStatError("El ataque", values.attack, attack.min, attack.max);
  const defenseError = getStatError("La defensa", values.defense, defense.min, defense.max);
  const speedError = getStatError("La velocidad", values.speed, speed.min, speed.max);
  const heightError = getStatError("La altura", values.height, height.min, height.max);
  const weightError = getStatError("El peso", values.weight, weight.min, weight.max);

  if (hpError) errors.hp = hpError;
  if (attackError) errors.attack = attackError;
  if (defenseError) errors.defense = defenseError;
  if (speedError) errors.speed = speedError;
  if (heightError) errors.height = heightError;
  if (weightError) errors.weight = weightError;

  const uniqueTypes = new Set(values.types);
  if (values.types.length < MIN_POKEMON_TYPES) errors.types = "Selecciona al menos un tipo.";
  else if (values.types.length > MAX_POKEMON_TYPES) errors.types = "Solo puedes seleccionar máximo 2 tipos.";
  else if (uniqueTypes.size !== values.types.length) errors.types = "No puedes repetir tipos.";

  return errors;
}

export function hasPokemonFormErrors(errors: PokemonFieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function togglePokemonType(selectedTypes: PokemonTypeName[], type: PokemonTypeName): PokemonTypeName[] {
  if (selectedTypes.includes(type)) return selectedTypes.filter((item) => item !== type);
  if (selectedTypes.length >= MAX_POKEMON_TYPES) return selectedTypes;
  return [...selectedTypes, type];
}
