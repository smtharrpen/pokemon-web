import type { ChangeEvent } from "react";
import { Badge } from "@/components/primitives/Badge/Badge";
import { Input } from "@/components/primitives/Input/Input";
import { POKEMON_IMAGE_SIZE } from "@/features/pokemon/pokemon.constants";
import { describePokemonImageValidation } from "@/features/pokemon/pokemonImageValidation";
import type { PokemonImageValidationState } from "@/features/pokemon/pokemonImageValidation";
import type { PokemonImageSource } from "@/features/pokemon/pokemonTypes";
import styles from "./PokemonImageField.module.css";

interface PokemonImageFieldProps {
  imageMode: PokemonImageSource;
  urlValue: string;
  fileName: string | null;
  fileInputKey: number;
  error?: string;
  validation: PokemonImageValidationState;
  onUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PokemonImageField({ imageMode, urlValue, fileName, fileInputKey, error, validation, onUrlChange, onFileChange }: PokemonImageFieldProps) {
  const usingFile = imageMode === "file";
  const helperText = usingFile
    ? fileName
      ? `Archivo seleccionado: ${fileName}`
      : `Sube PNG, JPEG, WEBP o GIF de ${POKEMON_IMAGE_SIZE.width}×${POKEMON_IMAGE_SIZE.height} px.`
    : `Pega una URL válida de una imagen de ${POKEMON_IMAGE_SIZE.width}×${POKEMON_IMAGE_SIZE.height} px.`;

  return (
    <section className={styles.section} aria-label="Imagen del Pokémon">
      <div className={styles.header}>
        <div>
          <h3>Imagen del Pokémon</h3>
          <p>Usa una URL o sube un archivo local. Solo una fuente queda activa a la vez.</p>
        </div>
        <Badge tone={usingFile ? "secondary" : "muted"}>{usingFile ? "Archivo activo" : "URL activa"}</Badge>
      </div>

      <Input error={!usingFile ? error : undefined} helperText={helperText} inputMode="url" label="Pegar URL de imagen" name="image-url" onChange={onUrlChange} placeholder="https://..." type="url" value={urlValue} />

      <div className={styles.divider} aria-hidden="true">
        <span>o</span>
      </div>

      <Input
        className={styles.fileInputWrapper}
        key={fileInputKey}
        accept="image/png,image/jpeg,image/webp,image/gif"
        error={usingFile ? error : undefined}
        helperText={usingFile ? helperText : `El archivo se convertirá a data URL al guardar.`}
        label="Seleccionar archivo local"
        name="image-file"
        onChange={onFileChange}
        type="file"
      />

      <p className={styles.note}>{describePokemonImageValidation(validation)}</p>
    </section>
  );
}
