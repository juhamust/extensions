import { Note } from "./note";

export type ScaleStep = "R" | "W" | "h" | "Wh";

export type ScaleTypeName =
  | "major"
  | "minor"
  | "harmonic"
  | "melodic"
  | "dorian"
  | "down"
  | "mixolydian"
  | "blues"
  | "avaha";

type ScaleTypeDetails = {
  name: string;
  steps: ScaleStep[];
};

export class ScaleTypes extends Map<ScaleTypeName, ScaleTypeDetails> {
  constructor() {
    // prettier-ignore
    // @formatter:off
    super([
      ["major", { name: "Major Scale", steps: ["R", "W", "W", "h", "W", "W", "W", "h"] }],
      ["minor", { name: "Natural Minor Scale", steps: ["R", "W", "h", "W", "W", "h", "W", "W"] }],
      ["harmonic", { name: "Harmonic Minor Scale", steps: ["R", "W", "h", "W", "W", "h", "Wh", "h"] },],
      ["melodic", { name: "Melodic Minor Scale", steps: ["R", "W", "h", "W", "W", "W", "W", "h"] }],
      ["down", { name: "Going Down", steps: ["R", "W", "W", "h", "W", "W", "h", "W"] }],
      ["dorian", { name: "Dorian Mode", steps: ["R", "W", "h", "W", "W", "W", "h", "W"] }],
      ["mixolydian", { name: "Mixolydian Mode", steps: ["R", "W", "W", "h", "W", "W", "h", "W"] }],
      ["avaha", { name: "Ahava Raba", steps: ["R", "h", "Wh", "h", "W", "h", "W", "W"] }],
      ["blues", { name: "Minor pentatonic Blues Scale", steps: ["R", "Wh", "W", "W", "Wh", "W"] }],
    ]);
    // @formatter:on
    // prettier-ignore-end
  }

  get(key: ScaleTypeName): ScaleTypeDetails {
    return super.get(key)!;
  }
}

export const scaleTypes = new ScaleTypes();

export interface Scale {
  name: string;
  type: ScaleTypeName;
  notes: Note[];
}
