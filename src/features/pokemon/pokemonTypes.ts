// Define los tipos de dominio para pokemones, filtros y formularios.
export type PokemonOrigin = "api" | "created";
export type PokemonImageSource = "url" | "file";

export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export interface Pokemon {
  id: string;
  name: string;
  image: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  types: PokemonTypeName[];
  origin: PokemonOrigin;
  imageSource?: PokemonImageSource;
  imageWidth?: number;
  imageHeight?: number;
  createdAt?: string;
}

export type PokemonOriginFilter = "all" | PokemonOrigin;

export type PokemonSortOption =
  | "none"
  | "nameAsc"
  | "nameDesc"
  | "attackAsc"
  | "attackDesc";

export interface PokemonFormValues {
  name: string;
  image: string;
  hp: string;
  attack: string;
  defense: string;
  speed: string;
  height: string;
  weight: string;
  types: PokemonTypeName[];
}

export type PokemonFieldErrors = Partial<Record<keyof PokemonFormValues, string>>;

export interface PokemonFilters {
  search: string;
  selectedType: "all" | PokemonTypeName;
  selectedOrigin: PokemonOriginFilter;
  sortBy: PokemonSortOption;
}
