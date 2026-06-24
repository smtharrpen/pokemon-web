import { Badge } from "@/components/primitives/Badge/Badge";
import { POKEMON_IMAGE_SIZE } from "@/features/pokemon/pokemon.constants";
import { describePokemonImageValidation } from "@/features/pokemon/pokemonImageValidation";
import type { PokemonImageValidationState } from "@/features/pokemon/pokemonImageValidation";
import type { PokemonImageSource } from "@/features/pokemon/pokemonTypes";
import styles from "./PokemonImagePreview.module.css";

/* eslint-disable @next/next/no-img-element */

interface PokemonImagePreviewProps {
  src: string;
  alt: string;
  imageMode: PokemonImageSource;
  validation: PokemonImageValidationState;
}

export function PokemonImagePreview({ src, alt, imageMode, validation }: PokemonImagePreviewProps) {
  const hasLoadedPreview = Boolean(src) && (validation.status === "valid" || validation.width !== null || validation.height !== null);
  const statusTone = validation.status === "valid" ? "success" : validation.status === "error" ? "danger" : "muted";
  const statusLabel = validation.status === "valid" ? "Imagen válida" : validation.status === "error" ? "Imagen inválida" : validation.status === "validating" ? "Validando imagen" : "Sin validar";
  const placeholderText = !src ? (imageMode === "file" ? "Selecciona un archivo para ver la imagen aquí." : "Pega una URL para ver la imagen aquí.") : validation.status === "validating" ? "Validando imagen..." : validation.error ?? "La imagen debe medir exactamente 96×96 px.";

  return (
    <section className={styles.preview} aria-label="Vista previa de la imagen">
      <div className={styles.header}>
        <div>
          <h3>Vista previa</h3>
          <p>{describePokemonImageValidation(validation)}</p>
        </div>
        <div className={styles.badges}>
          <Badge tone="muted">{imageMode === "file" ? "Archivo" : "URL"}</Badge>
          <Badge tone={statusTone}>{statusLabel}</Badge>
        </div>
      </div>
      <div className={styles.media}>
        {hasLoadedPreview ? (
          <img alt={alt || "Pokemon nuevo"} className={styles.image} height={POKEMON_IMAGE_SIZE.height} src={src} width={POKEMON_IMAGE_SIZE.width} />
        ) : (
          <p className={styles.placeholder}>{placeholderText}</p>
        )}
      </div>
      {validation.status === "error" && validation.error ? <p className={styles.error}>{validation.error}</p> : null}
      {validation.width !== null && validation.height !== null ? <p className={styles.size}>Tamaño detectado: {validation.width}×{validation.height} px</p> : null}
    </section>
  );
}
