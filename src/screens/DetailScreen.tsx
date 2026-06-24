// Pantalla de detalle que resuelve el pokemon desde Zustand.
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/primitives/Button/Button";
import { EmptyState } from "@/components/primitives/EmptyState/EmptyState";
import { Container } from "@/components/primitives/Container/Container";
import { LoadingState } from "@/components/primitives/LoadingState/LoadingState";
import { PokemonDetail } from "@/components/pokemon/PokemonDetail/PokemonDetail";
import { LOCAL_POKEMON_PREFIX } from "@/features/pokemon/pokemon.constants";
import { usePokemonStore } from "@/store/usePokemonStore";
import styles from "./DetailScreen.module.css";

interface DetailScreenProps {
  id: string;
}

export function DetailScreen({ id }: DetailScreenProps) {
  const router = useRouter();
  const hasHydratedCreatedPokemons = usePokemonStore((state) => state.hasHydratedCreatedPokemons);
  const pokemon = usePokemonStore((state) => state.getPokemonById(id));
  const isLocalPokemon = id.startsWith(LOCAL_POKEMON_PREFIX);

  return (
    <Container className={styles.detail}>
      {isLocalPokemon && !hasHydratedCreatedPokemons ? (
        <LoadingState label="Cargando pokemon creado..." />
      ) : pokemon ? (
        <PokemonDetail onBack={() => router.push("/home")} pokemon={pokemon} />
      ) : (
        <EmptyState
          action={<Button onClick={() => router.push("/home")}>Volver al Home</Button>}
          description="El pokemon solicitado no existe o ya no está disponible."
          title="Pokemon no encontrado"
        />
      )}
    </Container>
  );
}
