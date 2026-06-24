// Barra de búsqueda exacta con commit manual al store.
"use client";

import { useRef, type FormEvent } from "react";
import { Button } from "@/components/primitives/Button/Button";
import { Input } from "@/components/primitives/Input/Input";
import { useFilterStore } from "@/store/useFilterStore";
import styles from "./SearchBar.module.css";

export function SearchBar() {
  const appliedSearch = useFilterStore((state) => state.search);
  const searchVersion = useFilterStore((state) => state.searchVersion);
  const setSearch = useFilterStore((state) => state.setSearch);
  const clearSearch = useFilterStore((state) => state.clearSearch);
  const draftSearchRef = useRef(appliedSearch);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSearch(draftSearchRef.current);
  }

  function handleClear(): void {
    draftSearchRef.current = "";
    clearSearch();
  }

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <Input key={searchVersion} defaultValue={appliedSearch} label="Buscar pokemon" name="pokemon-search" onChange={(event) => {
        draftSearchRef.current = event.target.value;
      }} placeholder="Nombre exacto" />
      <div className={styles.actions}>
        <Button type="submit">Buscar</Button>
        <Button onClick={handleClear} type="button" variant="ghost">Limpiar</Button>
      </div>
    </form>
  );
}
