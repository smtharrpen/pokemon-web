import { POKEMON_IMAGE_SIZE } from "./pokemon.constants";

export type PokemonImageValidationStatus = "idle" | "validating" | "valid" | "error";

export interface PokemonImageValidationState {
  status: PokemonImageValidationStatus;
  width: number | null;
  height: number | null;
  error: string | null;
}

export const initialPokemonImageValidationState: PokemonImageValidationState = {
  status: "idle",
  width: null,
  height: null,
  error: null,
};

export function isValidImageUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) return true;

  try {
    return Boolean(new URL(trimmed));
  } catch {
    return false;
  }
}

export function isValidImageFile(file: File | null | undefined): file is File {
  return Boolean(file && file.type.startsWith("image/") && file.size > 0);
}

export function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo seleccionado."));
    reader.readAsDataURL(file);
  });
}

export function describePokemonImageValidation(validation: PokemonImageValidationState): string {
  if (validation.status === "validating") {
    return "Validando la imagen...";
  }

  if (validation.status === "valid") {
    return `Tamaño detectado: ${validation.width}×${validation.height} px`;
  }

  if (validation.status === "error" && validation.width !== null && validation.height !== null) {
    return `Tamaño detectado: ${validation.width}×${validation.height} px. La imagen debe medir exactamente ${POKEMON_IMAGE_SIZE.width}×${POKEMON_IMAGE_SIZE.height} px.`;
  }

  return `La imagen debe medir exactamente ${POKEMON_IMAGE_SIZE.width}×${POKEMON_IMAGE_SIZE.height} px.`;
}

function validateLoadedImage(image: HTMLImageElement): PokemonImageValidationState {
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  if (width !== POKEMON_IMAGE_SIZE.width || height !== POKEMON_IMAGE_SIZE.height) {
    return {
      status: "error",
      width,
      height,
      error: `La imagen debe medir exactamente ${POKEMON_IMAGE_SIZE.width}×${POKEMON_IMAGE_SIZE.height} px.`,
    };
  }

  return {
    status: "valid",
    width,
    height,
    error: null,
  };
}

export function validatePokemonImage(imageUrl: string): Promise<PokemonImageValidationState> {
  const trimmedUrl = imageUrl.trim();

  if (!trimmedUrl) {
    return Promise.resolve({
      status: "error",
      width: null,
      height: null,
      error: "La imagen es obligatoria.",
    });
  }

  if (!isValidImageUrl(trimmedUrl)) {
    return Promise.resolve({
      status: "error",
      width: null,
      height: null,
      error: "Ingresa una URL de imagen válida.",
    });
  }

  if (typeof window === "undefined" || typeof Image === "undefined") {
    return Promise.resolve({
      status: "error",
      width: null,
      height: null,
      error: "La validación de imagen solo está disponible en el navegador.",
    });
  }

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      resolve(validateLoadedImage(image));
    };

    image.onerror = () => {
      resolve({
        status: "error",
        width: null,
        height: null,
        error: "No se pudo cargar la imagen.",
      });
    };

    image.src = trimmedUrl;
  });
}

export function validatePokemonImageFile(file: File): Promise<PokemonImageValidationState> {
  if (!isValidImageFile(file)) {
    return Promise.resolve({
      status: "error",
      width: null,
      height: null,
      error: "El archivo seleccionado no es una imagen válida.",
    });
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    const cleanup = () => URL.revokeObjectURL(objectUrl);

    image.onload = () => {
      cleanup();
      resolve(validateLoadedImage(image));
    };

    image.onerror = () => {
      cleanup();
      resolve({
        status: "error",
        width: null,
        height: null,
        error: "No se pudo cargar la imagen.",
      });
    };

    image.src = objectUrl;
  });
}
