// Contenedor visual para la página de creación de pokemones.
import { Card } from "@/components/primitives/Card/Card";
import { SectionTitle } from "@/components/primitives/SectionTitle/SectionTitle";
import type { Pokemon, PokemonFormValues, PokemonImageSource } from "@/features/pokemon/pokemonTypes";
import { PokemonForm } from "../PokemonForm/PokemonForm";
import styles from "./PokemonCreate.module.css";

interface PokemonCreateProps {
  existingPokemons: Pokemon[];
  onSubmit: (values: PokemonFormValues, imageSource: PokemonImageSource) => Promise<Pokemon> | Pokemon;
  onCreated?: (pokemon: Pokemon) => void;
  isStoreReady?: boolean;
}

export function PokemonCreate({ existingPokemons, onSubmit, onCreated, isStoreReady = true }: PokemonCreateProps) {
  return (
    <div className={styles.create}>
      <SectionTitle subtitle="Configura stats, tipos e imagen 96×96 px antes de guardar." title="Crear pokemon" />
      <Card className={styles.card}>
        <PokemonForm existingPokemons={existingPokemons} isStoreReady={isStoreReady} onCreated={onCreated} onSubmit={onSubmit} />
      </Card>
    </div>
  );
}
