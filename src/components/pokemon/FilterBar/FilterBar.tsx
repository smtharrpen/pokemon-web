// Barra de filtros para tipo, origen y ordenamiento.
"use client";

import { Button } from "@/components/primitives/Button/Button";
import { Select } from "@/components/primitives/Select/Select";
import type { PokemonTypeName } from "@/features/pokemon/pokemonTypes";
import { pokemonTypeMock } from "@/mocks/typeMock";
import { useFilterStore } from "@/store/useFilterStore";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  availableTypes?: PokemonTypeName[];
}

export function FilterBar({ availableTypes = pokemonTypeMock }: FilterBarProps) {
  const selectedType = useFilterStore((state) => state.selectedType);
  const selectedOrigin = useFilterStore((state) => state.selectedOrigin);
  const sortBy = useFilterStore((state) => state.sortBy);
  const setSelectedType = useFilterStore((state) => state.setSelectedType);
  const setSelectedOrigin = useFilterStore((state) => state.setSelectedOrigin);
  const setSortBy = useFilterStore((state) => state.setSortBy);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const resetAllControls = useFilterStore((state) => state.resetAllControls);

  return (
    <section className={styles.filters} aria-label="Filtros y ordenamiento">
      <Select label="Tipo" onChange={(event) => setSelectedType(event.target.value as "all" | PokemonTypeName)} value={selectedType} options={[{ label: "Todos los tipos", value: "all" }, ...availableTypes.map((type) => ({ label: type, value: type }))]} />
      <Select label="Origen" onChange={(event) => setSelectedOrigin(event.target.value as "all" | "api" | "created")} value={selectedOrigin} options={[{ label: "Todos", value: "all" }, { label: "API", value: "api" }, { label: "Creados", value: "created" }]} />
      <Select label="Ordenar" onChange={(event) => setSortBy(event.target.value as typeof sortBy)} value={sortBy} options={[{ label: "Sin orden", value: "none" }, { label: "A-Z", value: "nameAsc" }, { label: "Z-A", value: "nameDesc" }, { label: "Ataque ascendente", value: "attackAsc" }, { label: "Ataque descendente", value: "attackDesc" }]} />
      <div className={styles.actions}>
        <Button onClick={resetFilters} type="button" variant="ghost">Limpiar filtros</Button>
        <Button onClick={resetAllControls} type="button" variant="ghost">Limpiar todo</Button>
      </div>
    </section>
  );
}
