// Pantalla principal para explorar pokemones con filtros y paginado.
"use client";

import { useState } from "react";
import { Container } from "@/components/primitives/Container/Container";
import { SectionTitle } from "@/components/primitives/SectionTitle/SectionTitle";
import { FilterBar } from "@/components/pokemon/FilterBar/FilterBar";
import { NavBar } from "@/components/pokemon/NavBar/NavBar";
import { PokemonList } from "@/components/pokemon/PokemonList/PokemonList";
import { PokemonDetailModal } from "@/components/pokemon/PokemonDetailModal/PokemonDetailModal";
import { getAvailableTypes, getPaginatedPokemons, getVisiblePokemons, getVisiblePokemonPageCount } from "@/features/pokemon/pokemonSelectors";
import type { Pokemon } from "@/features/pokemon/pokemonTypes";
import { useFilterStore } from "@/store/useFilterStore";
import { usePokemonStore } from "@/store/usePokemonStore";
import styles from "./HomeScreen.module.css";

export function HomeScreen() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const allPokemons = usePokemonStore((state) => state.allPokemons);
  const status = usePokemonStore((state) => state.status);
  const error = usePokemonStore((state) => state.error);
  const search = useFilterStore((state) => state.search);
  const selectedType = useFilterStore((state) => state.selectedType);
  const selectedOrigin = useFilterStore((state) => state.selectedOrigin);
  const sortBy = useFilterStore((state) => state.sortBy);
  const currentPage = useFilterStore((state) => state.currentPage);
  const pageSize = useFilterStore((state) => state.pageSize);
  const setCurrentPage = useFilterStore((state) => state.setCurrentPage);
  const resetAllControls = useFilterStore((state) => state.resetAllControls);

  const filters = { search, selectedType, selectedOrigin, sortBy };
  const visiblePokemons = getVisiblePokemons(allPokemons, filters);
  const totalPages = getVisiblePokemonPageCount(allPokemons, filters, pageSize);
  const pagePokemons = getPaginatedPokemons(visiblePokemons, currentPage, pageSize);
  const availableTypes = getAvailableTypes(allPokemons);

  function handleCloseDetail(): void {
    setSelectedPokemon(null);
  }

  return (
    <div>
      <NavBar />
      <Container className={styles.home}>
        <SectionTitle subtitle="Busca exacto, filtra por origen o tipo y navega 12 por página." title="Home" />
        <FilterBar availableTypes={availableTypes} />
        <PokemonList currentPage={currentPage} error={error} onPageChange={setCurrentPage} onPokemonSelect={setSelectedPokemon} onReset={resetAllControls} pokemons={pagePokemons} status={status} totalPages={totalPages} />
      </Container>
      {selectedPokemon ? <PokemonDetailModal onClose={handleCloseDetail} pokemon={selectedPokemon} /> : null}
    </div>
  );
}
