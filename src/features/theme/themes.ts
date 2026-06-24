// Catálogo de temas visuales usados por el sistema de diseño.
import type { ThemeDefinition } from "./themeTypes";

export const themes: ThemeDefinition[] = [
  {
    id: "mysticNight",
    name: "Mystic Night",
    primaryColor: "#713485ff",
    secondaryColor: "#54acbeff",
    backgroundColor: "#272822",
    textColor: "#f8f8f2",
  },
  {
    id: "berryLight",
    name: "Berry Light",
    primaryColor: "#35ca25ff",
    secondaryColor: "#8a95d2ff",
    backgroundColor: "#aaa7dbff",
    textColor: "#000000",
  },
  {
    id: "classicBattle",
    name: "Classic Battle",
    primaryColor: "#f44336",
    secondaryColor: "#2196f3",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  },
];

export const defaultThemeId: ThemeDefinition["id"] = "mysticNight";
