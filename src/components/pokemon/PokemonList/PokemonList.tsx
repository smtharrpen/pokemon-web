// Lista renderizada de pokemones con estados y paginación.
"use client";

import { EmptyState } from "@/components/primitives/EmptyState/EmptyState";
import { ErrorState } from "@/components/primitives/ErrorState/ErrorState";
import { LoadingState } from "@/components/primitives/LoadingState/LoadingState";
import { Pagination } from "@/components/primitives/Pagination/Pagination";
import { Button } from "@/components/primitives/Button/Button";
import type { Pokemon } from "@/features/pokemon/pokemonTypes";
import { PokemonCard } from "../PokemonCard/PokemonCard";
import styles from "./PokemonList.module.css";

interface PokemonListProps {
  pokemons: Pokemon[];
  currentPage: number;
  totalPages: number;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  onPageChange: (page: number) => void;
  onPokemonSelect: (pokemon: Pokemon) => void;
  onReset?: () => void;
}

export function PokemonList({ pokemons, currentPage, totalPages, status, error, onPageChange, onPokemonSelect, onReset }: PokemonListProps) {
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState description={error ?? "No se pudieron cargar los pokemones."} title="Hubo un problema" onAction={onReset} actionLabel="Reintentar" />;
  if (pokemons.length === 0) {
    return <EmptyState description="Prueba limpiar búsqueda o filtros para volver a ver resultados." title="No hay pokemones para mostrar" action={onReset ? <Button onClick={onReset}>Limpiar todo</Button> : null} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {pokemons.map((pokemon) => <PokemonCard key={pokemon.id} onSelect={onPokemonSelect} pokemon={pokemon} />)}
      </div>
      <Pagination currentPage={currentPage} onPageChange={onPageChange} totalPages={totalPages} />
    </div>
  );
}
