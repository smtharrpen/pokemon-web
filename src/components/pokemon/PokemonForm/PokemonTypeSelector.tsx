import { Badge } from "@/components/primitives/Badge/Badge";
import { Button } from "@/components/primitives/Button/Button";
import { MAX_POKEMON_TYPES } from "@/features/pokemon/pokemon.constants";
import { pokemonTypeMock } from "@/mocks/typeMock";
import type { PokemonTypeName } from "@/features/pokemon/pokemonTypes";
import styles from "./PokemonTypeSelector.module.css";

interface PokemonTypeSelectorProps {
  selectedTypes: PokemonTypeName[];
  error?: string;
  onToggleType: (type: PokemonTypeName) => void;
}

export function PokemonTypeSelector({ selectedTypes, error, onToggleType }: PokemonTypeSelectorProps) {
  return (
    <section className={styles.section} aria-label="Selector de tipos">
      <div className={styles.header}>
        <h3>Tipos</h3>
        <Badge tone="muted">
          {selectedTypes.length}/{MAX_POKEMON_TYPES}
        </Badge>
      </div>
      <div className={styles.grid}>
        {pokemonTypeMock.map((type) => {
          const selected = selectedTypes.includes(type);
          const disabled = selectedTypes.length >= MAX_POKEMON_TYPES && !selected;

          return (
            <Button key={type} ariaLabel={`Seleccionar tipo ${type}`} className={selected ? styles.selected : undefined} disabled={disabled} onClick={() => onToggleType(type)} type="button" variant={selected ? "secondary" : "ghost"}>
              {type}
            </Button>
          );
        })}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  );
}
