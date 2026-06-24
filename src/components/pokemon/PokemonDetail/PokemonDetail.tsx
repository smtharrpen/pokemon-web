// Vista detallada de un pokemon con stats y metadatos.
"use client";

import Image from "next/image";
import { Badge } from "@/components/primitives/Badge/Badge";
import { Button } from "@/components/primitives/Button/Button";
import { Card } from "@/components/primitives/Card/Card";
import { cx } from "@/utils/cx";
import type { Pokemon } from "@/features/pokemon/pokemonTypes";
import { PokemonStats } from "../PokemonStats/PokemonStats";
import { TypeBadgeList } from "../TypeBadgeList/TypeBadgeList";
import styles from "./PokemonDetail.module.css";

interface PokemonDetailProps {
  pokemon: Pokemon;
  onBack: () => void;
  backLabel?: string;
}

export function PokemonDetail({ pokemon, onBack, backLabel = "Volver" }: PokemonDetailProps) {
  const isCreated = pokemon.origin === "created";

  return (
    <div className={styles.detail}>
      <Button onClick={onBack} variant="ghost">{backLabel}</Button>
      <Card className={cx(styles.card, isCreated && styles.createdCard)}>
        <div className={styles.media}>
          <Image alt={pokemon.name} className={styles.image} height={420} src={pokemon.image} unoptimized width={420} />
        </div>
        <div className={styles.content}>
          <div className={styles.topline}>
            <h1>{pokemon.name}</h1>
            <Badge tone={isCreated ? "accent" : "muted"}>{isCreated ? "Creado" : "API"}</Badge>
          </div>
          <p className={styles.id}>#{pokemon.id}</p>
          <TypeBadgeList types={pokemon.types} />
          <PokemonStats pokemon={pokemon} />
          <dl className={styles.meta}>
            <div><dt>Altura</dt><dd>{pokemon.height}</dd></div>
            <div><dt>Peso</dt><dd>{pokemon.weight}</dd></div>
          </dl>
        </div>
      </Card>
    </div>
  );
}
