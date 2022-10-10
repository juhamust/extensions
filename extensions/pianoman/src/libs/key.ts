export type Key =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B"
  | "Abb"
  | "Bbb"
  | "Cbb"
  | "Dbb"
  | "Ebb"
  | "Fbb"
  | "Gbb"
  | "A##"
  | "B##"
  | "C##"
  | "D##"
  | "E##"
  | "F##"
  | "G##";

export type Value = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export class Keys extends Map<Key, Value> {
  constructor() {
    super([
      ["C", 0],
      ["C#", 1],
      ["Db", 1],
      ["D", 2],
      ["D#", 3],
      ["Eb", 3],
      ["E", 4],
      ["F", 5],
      ["F#", 6],
      ["Gb", 6],
      ["G", 7],
      ["G#", 8],
      ["Ab", 8],
      ["A", 9],
      ["A#", 10],
      ["Bb", 10],
      ["B", 11],
      ["Abb", 7],
      ["Bbb", 9],
      ["Cbb", 10],
      ["Dbb", 0],
      ["Ebb", 2],
      ["Fbb", 3],
      ["Gbb", 5],
      ["A##", 11],
      ["B##", 1],
      ["C##", 2],
      ["D##", 4],
      ["E##", 6],
      ["F##", 7],
      ["G##", 9],
    ]);
  }

  get(key: Key): Value {
    return super.get(key)!;
  }

  getKeyFromValue(value: Value) {
    let valueKey: Key;
    for (const [entryKey, entryValue] of this.entries()) {
      if (value === entryValue) {
        valueKey = entryKey;
        break;
      }
    }

    return valueKey!;
  }
}

export const keys = new Keys();

export enum bw {
  "white" = 0,
  "black" = 1,
}

export const bwMap = [
  bw.white,
  bw.black,
  bw.white,
  bw.black,
  bw.white,
  bw.white,
  bw.black,
  bw.white,
  bw.black,
  bw.white,
  bw.black,
  bw.white,
];

export const keySimpleList: Key[] = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
];

export type NoteMap = {
  name: string;
  key: Key;
  aliases?: Key[];
};
export const noteMap: NoteMap[] = [
  { name: "C", key: "C" },
  { name: "Db", key: "Db", aliases: ["C#"] },
  { name: "D", key: "D" },
  { name: "Eb", key: "Eb", aliases: ["D#"] },
  { name: "E", key: "E" },
  { name: "F", key: "F" },
  { name: "F#", key: "F#" },
  { name: "G", key: "G" },
  { name: "Ab", key: "Ab", aliases: ["G#"] },
  { name: "A", key: "A" },
  { name: "Bb", key: "Bb", aliases: ["A#"] },
  { name: "B", key: "B" },
];

export const chromaticName: string[] = noteMap.map((entry) => entry.name);
export const OctaveKeyCount = 12;
