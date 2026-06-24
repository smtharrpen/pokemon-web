// Provee efectos globales del cliente como la sincronización de tema.
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { applyTheme } from "@/features/theme/applyTheme";
import { useThemeStore } from "@/store/useThemeStore";
import { usePokemonStore } from "@/store/usePokemonStore";

export function Providers({ children }: { children: ReactNode }) {
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    usePokemonStore.getState().hydrateCreatedPokemons();
  }, []);

  return <>{children}</>;
}
