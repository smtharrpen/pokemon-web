// Tarjeta interactiva con resumen de pokemon para Home.
"use client";

import Image from "next/image";
import { Badge } from "@/components/primitives/Badge/Badge";
import { Card } from "@/components/primitives/Card/Card";
import { cx } from "@/utils/cx";
import type { KeyboardEvent } from "react";
import type { Pokemon } from "@/features/pokemon/pokemonTypes";
import { TypeBadgeList } from "../TypeBadgeList/TypeBadgeList";
import styles from "./PokemonCard.module.css";

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, onSelect }: PokemonCardProps) {
  const isCreated = pokemon.origin === "created";

  function handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(pokemon);
    }
  }

  return (
    <Card aria-label={`Abrir detalle de ${pokemon.name}`} className={cx(styles.card, isCreated && styles.createdCard)} onClick={() => onSelect(pokemon)} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
      <Image alt={pokemon.name} className={styles.image} height={256} src={pokemon.image} unoptimized width={256} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{pokemon.name}</h3>
          <Badge tone={isCreated ? "accent" : "muted"}>{isCreated ? "Creado" : "API"}</Badge>
        </div>
        <TypeBadgeList types={pokemon.types} />
        <div className={styles.footer}>
          <span>Poder</span>
          <strong>{pokemon.attack}</strong>
        </div>
      </div>
    </Card>
  );
}
