// Pantalla que conecta el formulario con el store y la navegación.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/primitives/Container/Container";
import { NavBar } from "@/components/pokemon/NavBar/NavBar";
import { PokemonCreate } from "@/components/pokemon/PokemonCreate/PokemonCreate";
import { createPokemon } from "@/services/pokemonService";
import { usePokemonStore } from "@/store/usePokemonStore";
import type { Pokemon, PokemonFormValues, PokemonImageSource } from "@/features/pokemon/pokemonTypes";
import styles from "./CreatePokemonScreen.module.css";

export function CreatePokemonScreen() {
  const router = useRouter();
  const existingPokemons = usePokemonStore((state) => state.allPokemons);
  const hasHydratedCreatedPokemons = usePokemonStore((state) => state.hasHydratedCreatedPokemons);
  const addCreatedPokemon = usePokemonStore((state) => state.addCreatedPokemon);
  const [createdPokemonId, setCreatedPokemonId] = useState<string | null>(null);

  useEffect(() => {
    if (!createdPokemonId) return;

    const timeout = window.setTimeout(() => {
      router.push(`/pokemon/${createdPokemonId}`);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [createdPokemonId, router]);

  async function handleCreate(values: PokemonFormValues, imageSource: PokemonImageSource): Promise<Pokemon> {
    const pokemon = await createPokemon(values, imageSource);
    addCreatedPokemon(pokemon);
    return pokemon;
  }

  function handleCreated(pokemon: Pokemon): void {
    setCreatedPokemonId(pokemon.id);
  }

  return (
    <div>
      <NavBar />
      <Container className={styles.create}>
        <PokemonCreate existingPokemons={existingPokemons} isStoreReady={hasHydratedCreatedPokemons} onCreated={handleCreated} onSubmit={handleCreate} />
      </Container>
    </div>
  );
}
