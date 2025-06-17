export interface BackgroundOptions {
  color?: string;
  image?: string;
  size?: "auto" | "cover" | "contain" | string;
  position?: "center" | "top" | "bottom" | "left" | "right" | string;
  repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  attachment?: "scroll" | "fixed" | "local";
}

export type BackgroundType = string | BackgroundOptions;
