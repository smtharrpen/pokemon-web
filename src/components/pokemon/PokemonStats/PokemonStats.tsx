// Sección de stats visuales para el detalle de un pokemon.
import { StatBar } from "@/components/primitives/StatBar/StatBar";
import type { Pokemon } from "@/features/pokemon/pokemonTypes";
import styles from "./PokemonStats.module.css";

interface PokemonStatsProps {
  pokemon: Pokemon;
}

export function PokemonStats({ pokemon }: PokemonStatsProps) {
  return (
    <section className={styles.stats} aria-label="Estadísticas del pokemon">
      <StatBar label="Vida" value={pokemon.hp} />
      <StatBar label="Ataque" value={pokemon.attack} />
      <StatBar label="Defensa" value={pokemon.defense} />
      <StatBar label="Velocidad" value={pokemon.speed} />
    </section>
  );
}
