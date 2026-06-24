// Modal de detalle para mostrar un pokemon sin salir de Home.
"use client";

import { useEffect, useRef } from "react";
import { PokemonDetail } from "@/components/pokemon/PokemonDetail/PokemonDetail";
import type { Pokemon } from "@/features/pokemon/pokemonTypes";
import styles from "./PokemonDetailModal.module.css";

interface PokemonDetailModalProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export function PokemonDetailModal({ pokemon, onClose }: PokemonDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div aria-label={`Detalle de ${pokemon.name}`} aria-modal="true" className={styles.modal} onClick={(event) => event.stopPropagation()} ref={modalRef} role="dialog" tabIndex={-1}>
        <PokemonDetail backLabel="Cerrar" onBack={onClose} pokemon={pokemon} />
      </div>
    </div>
  );
}
