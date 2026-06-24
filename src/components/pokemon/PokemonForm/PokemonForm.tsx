// Formulario controlado para crear pokemones con validación manual.
"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Badge } from "@/components/primitives/Badge/Badge";
import { Button } from "@/components/primitives/Button/Button";
import { Input } from "@/components/primitives/Input/Input";
import { POKEMON_STAT_LIMITS } from "@/features/pokemon/pokemon.constants";
import {
  initialPokemonImageValidationState,
  isValidImageFile,
  readImageFileAsDataUrl,
  validatePokemonImage,
  validatePokemonImageFile,
  type PokemonImageValidationState,
} from "@/features/pokemon/pokemonImageValidation";
import { hasPokemonFormErrors, togglePokemonType, validatePokemonForm } from "@/features/pokemon/pokemonValidation";
import type { Pokemon, PokemonFieldErrors, PokemonFormValues, PokemonImageSource, PokemonTypeName } from "@/features/pokemon/pokemonTypes";
import { PokemonImageField } from "./PokemonImageField";
import { PokemonImagePreview } from "./PokemonImagePreview";
import { PokemonTypeSelector } from "./PokemonTypeSelector";
import { StatInput } from "./StatInput";
import styles from "./PokemonForm.module.css";

interface PokemonFormProps {
  existingPokemons: Pokemon[];
  onSubmit: (values: PokemonFormValues, imageSource: PokemonImageSource) => Promise<Pokemon> | Pokemon;
  onCreated?: (pokemon: Pokemon) => void;
  isStoreReady?: boolean;
}

const initialValues: PokemonFormValues = {
  name: "",
  image: "",
  hp: "",
  attack: "",
  defense: "",
  speed: "",
  height: "",
  weight: "",
  types: [],
};

function clearFieldError(errors: PokemonFieldErrors, field: keyof PokemonFormValues): PokemonFieldErrors {
  const nextErrors = { ...errors };
  delete nextErrors[field];
  return nextErrors;
}

export function PokemonForm({ existingPokemons, onSubmit, onCreated, isStoreReady = true }: PokemonFormProps) {
  const [values, setValues] = useState<PokemonFormValues>(initialValues);
  const [imageMode, setImageMode] = useState<PokemonImageSource>("url");
  const [errors, setErrors] = useState<PokemonFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageValidation, setImageValidation] = useState<PokemonImageValidationState>(initialPokemonImageValidationState);
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const urlValidationTimeoutRef = useRef<number | null>(null);
  const urlValidationTokenRef = useRef(0);
  const fileReadTokenRef = useRef(0);
  const fileValidationTokenRef = useRef(0);

  useEffect(() => () => { if (imagePreviewSrc.startsWith("blob:")) URL.revokeObjectURL(imagePreviewSrc); }, [imagePreviewSrc]);
  useEffect(() => () => { if (urlValidationTimeoutRef.current !== null) window.clearTimeout(urlValidationTimeoutRef.current); }, []);

  function cancelUrlValidation(): void { if (urlValidationTimeoutRef.current !== null) window.clearTimeout(urlValidationTimeoutRef.current); urlValidationTimeoutRef.current = null; urlValidationTokenRef.current += 1; }

  function resetFileSelection(): void { fileReadTokenRef.current += 1; fileValidationTokenRef.current += 1; setImagePreviewSrc(""); setFileName(null); setFileInputKey((current) => current + 1); }

  function scheduleUrlValidation(nextUrl: string): void {
    cancelUrlValidation();
    const trimmedUrl = nextUrl.trim();
    if (!trimmedUrl) { setImageValidation(initialPokemonImageValidationState); return; }

    const token = ++urlValidationTokenRef.current;
    setImageValidation({ status: "validating", width: null, height: null, error: null });
    urlValidationTimeoutRef.current = window.setTimeout(() => {
      void validatePokemonImage(trimmedUrl).then((result) => {
        if (token === urlValidationTokenRef.current) setImageValidation(result);
      });
    }, 250);
  }

  function resetForm(keepSuccess = false): void { cancelUrlValidation(); resetFileSelection(); setValues(initialValues); setImageMode("url"); setErrors({}); setSubmitError(null); setImageValidation(initialPokemonImageValidationState); if (!keepSuccess) setSuccessMessage(null); }

  function updateField<K extends keyof PokemonFormValues>(field: K, value: PokemonFormValues[K]): void {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => clearFieldError(current, field));
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function handleImageUrlChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextUrl = event.target.value;
    setImageMode("url");
    resetFileSelection();
    setValues((current) => ({ ...current, image: nextUrl }));
    setErrors((current) => clearFieldError(current, "image"));
    setSubmitError(null);
    setSuccessMessage(null);
    scheduleUrlValidation(nextUrl);
  }

  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0] ?? null;
    const selectedFileName = file?.name ?? null;
    setImageMode("file");
    cancelUrlValidation();
    setErrors((current) => clearFieldError(current, "image"));
    setSubmitError(null);
    setSuccessMessage(null);

    if (!file) { resetFileSelection(); setValues((current) => ({ ...current, image: "" })); setImageValidation(initialPokemonImageValidationState); return; }

    if (!isValidImageFile(file)) { resetFileSelection(); setValues((current) => ({ ...current, image: "" })); setFileName(selectedFileName); setImageValidation({ status: "error", width: null, height: null, error: "El archivo seleccionado no es una imagen válida." }); return; }

    setFileName(selectedFileName);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewSrc(previewUrl);
    setImageValidation({ status: "validating", width: null, height: null, error: null });

    const readToken = ++fileReadTokenRef.current;
    const validationToken = ++fileValidationTokenRef.current;

    try {
      const [dataUrl, validation] = await Promise.all([readImageFileAsDataUrl(file), validatePokemonImageFile(file)]);
      if (readToken !== fileReadTokenRef.current || validationToken !== fileValidationTokenRef.current) return;
      setValues((current) => ({ ...current, image: dataUrl }));
      setImageValidation(validation);
    } catch (error) {
      if (readToken !== fileReadTokenRef.current || validationToken !== fileValidationTokenRef.current) return;
      setValues((current) => ({ ...current, image: "" })); setImageValidation({ status: "error", width: null, height: null, error: error instanceof Error ? error.message : "No se pudo leer el archivo seleccionado." });
    }
  }

  function handleTypeChange(type: PokemonTypeName): void {
    setValues((current) => ({ ...current, types: togglePokemonType(current.types, type) }));
    setErrors((current) => clearFieldError(current, "types"));
    setSubmitError(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const nextErrors = validatePokemonForm(values, existingPokemons, imageValidation);
    setErrors(nextErrors);
    setSubmitError(null);
    setSuccessMessage(null);

    if (hasPokemonFormErrors(nextErrors)) return;

    setIsSubmitting(true);

    try {
      const createdPokemon = await onSubmit(values, imageMode);
      resetForm(true);
      setSuccessMessage(`${createdPokemon.name} se creó correctamente.`);
      onCreated?.(createdPokemon);
    } catch {
      setSubmitError("No se pudo crear el pokemon. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const imageError = errors.image ?? (imageValidation.status === "error" ? imageValidation.error ?? undefined : undefined);
  const submitDisabled = !isStoreReady || isSubmitting || imageValidation.status === "validating";
  const submitLabel = !isStoreReady ? "Cargando datos..." : isSubmitting ? "Creando..." : imageValidation.status === "validating" ? "Validando imagen..." : "Crear pokemon";
  const previewSrc = imageMode === "file" ? imagePreviewSrc : values.image.trim();

  return (
    <form aria-busy={!isStoreReady || isSubmitting || imageValidation.status === "validating"} className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <Input error={errors.name} label="Nombre" name="name" onChange={(event) => updateField("name", event.target.value)} placeholder="Ej. Pikachu" value={values.name} />
        <StatInput error={errors.hp} label="Vida / HP" max={POKEMON_STAT_LIMITS.hp.max} min={POKEMON_STAT_LIMITS.hp.min} name="hp" onChange={(event) => updateField("hp", event.target.value)} placeholder="35" value={values.hp} />
        <StatInput error={errors.attack} label="Ataque" max={POKEMON_STAT_LIMITS.attack.max} min={POKEMON_STAT_LIMITS.attack.min} name="attack" onChange={(event) => updateField("attack", event.target.value)} placeholder="55" value={values.attack} />
        <StatInput error={errors.defense} label="Defensa" max={POKEMON_STAT_LIMITS.defense.max} min={POKEMON_STAT_LIMITS.defense.min} name="defense" onChange={(event) => updateField("defense", event.target.value)} placeholder="40" value={values.defense} />
        <StatInput error={errors.speed} label="Velocidad" max={POKEMON_STAT_LIMITS.speed.max} min={POKEMON_STAT_LIMITS.speed.min} name="speed" onChange={(event) => updateField("speed", event.target.value)} placeholder="90" value={values.speed} />
        <StatInput error={errors.height} label="Altura" max={POKEMON_STAT_LIMITS.height.max} min={POKEMON_STAT_LIMITS.height.min} name="height" onChange={(event) => updateField("height", event.target.value)} placeholder="8" value={values.height} />
        <StatInput error={errors.weight} label="Peso" max={POKEMON_STAT_LIMITS.weight.max} min={POKEMON_STAT_LIMITS.weight.min} name="weight" onChange={(event) => updateField("weight", event.target.value)} placeholder="60" value={values.weight} />
        <PokemonTypeSelector error={errors.types} onToggleType={handleTypeChange} selectedTypes={values.types} />
        <PokemonImageField error={imageError} fileInputKey={fileInputKey} fileName={fileName} imageMode={imageMode} onFileChange={handleImageFileChange} onUrlChange={handleImageUrlChange} urlValue={values.image} validation={imageValidation} />
      </div>

      <PokemonImagePreview alt={values.name} imageMode={imageMode} src={previewSrc} validation={imageValidation} />

      {successMessage ? (
        <p className={styles.success} role="status" aria-live="polite">
          <Badge tone="success">Creado</Badge>
          <span>{successMessage}</span>
        </p>
      ) : null}

      {submitError ? (
        <p className={styles.error} role="alert">
          {submitError}
        </p>
      ) : null}

      <div className={styles.actions}>
        <Button disabled={submitDisabled} type="submit">
          {submitLabel}
        </Button>
        <Button onClick={() => resetForm()} type="button" variant="ghost">
          Limpiar formulario
        </Button>
      </div>
    </form>
  );
}
