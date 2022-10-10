import { encode } from "js-base64";
import { Chord } from "./chord";
import { chordDatabase, getNote } from "./db";
import { Key, keys, Value } from "./key";
import { Note } from "./note";
import { Scale } from "./scale";

export function getSvgBase64(svg: string): string {
  return `data:image/svg+xml;base64,${encode(svg)}`;
}

/**
 * Trims each line to help with multi-line texts
 * like markdown
 */
export function trimLines(content: string | string[]) {
  const lines = Array.isArray(content) ? content : content.split("\n");
  const firstIndex = 0;
  const lastIndex = lines.length - 1;

  return (
    lines
      // Drop the first and last line if only carriage return
      .filter(
        (line, index) => !((index === firstIndex || index === lastIndex) && line.trim() === ""),
      )
      .map((line) => line.trim())
  );
}

export function sumValues(...values: Value[]) {
  return (values as number[]).reduce((total: number, value: number) => {
    return (total += value);
  }, 0) as Value;
}

/**
 * Find the key by 1-2 first letter like C, C#, Fb
 */
export function findNoteByName(rawValue?: string) {
  if (!rawValue) {
    return undefined;
  }

  const noteValue = ["#", "b"].includes(rawValue.substring(1, 2))
    ? (rawValue.substring(0, 2) as Key)
    : (rawValue.substring(0, 1).toUpperCase() as Key);

  // Check the letter matches with value
  if (!keys.has(noteValue)) {
    return undefined;
  }

  return noteValue;
}

export function getHighlightTable(input: Chord | Scale) {
  if (input instanceof Chord) {
    return getHighlightTableFromChord(input);
  }
  return getHighlightTableFromScale(input);
}

export function getHighlightTableFromScale(scale: Scale) {
  if (scale.notes.length === 0) {
    throw new Error("Empty scale");
  }

  const highlightTable: boolean[] = Array(12 * 3).fill(false);
  const rootNote = scale.notes[0];
  const rootNoteOctave = rootNote.octave;

  scale.notes.forEach((note) => {
    const octaveValueAdd = 12 * (note.octave - rootNoteOctave);
    const keyIndex = note.getValue() + octaveValueAdd;
    highlightTable[keyIndex] = true;
  });

  return highlightTable;
}

export function getHighlightTableFromChord(chord: Chord) {
  const highlightTable: boolean[] = Array(12 * 3).fill(false);
  const startIndex = keys.get(chord.key);
  highlightTable[startIndex] = true;
  chord.intervals.reduce((previousValue, currentValue) => {
    const accumulate = previousValue + currentValue;
    highlightTable[accumulate] = true;
    return accumulate;
  }, startIndex);
  return highlightTable;
}

export function getScaleKeyListing(scale: Scale): Key[] {
  return scale.notes.map((note) => note.key);
}

export function getChordKeyListing(chord: Chord): Key[] {
  const rootNote = getNote(chord.key) as Note;
  const rootNoteValue = rootNote.getValue();
  const chordKeys: Key[] = [];

  chord.intervals.reduce((value: number, interval: number) => {
    let keyValue = value + interval;
    if (keyValue >= 12) {
      keyValue -= 12;
    }
    chordKeys.push(keys.getKeyFromValue(keyValue as Value));
    return keyValue;
  }, rootNoteValue);

  return chordKeys;
}

export function chordAlignMid(highlightTable: boolean[]): boolean[] {
  // if all the notes are in first 2/3 of the keyboard (3 octaves)
  if (highlightTable.slice(24).every((h) => h === false)) {
    // move notes to the middle octave
    return Array(12).fill(false).concat(highlightTable.slice(0, 24));
  } else {
    // otherwise, do not move notes. Notes will use octave 4 as base
    return highlightTable;
  }
}

export function findChordByName(key: string, chordName: string) {
  return chordDatabase[key].find((c) => {
    if (c.name === chordName) return true;
    return false;
  });
}

// C-flat.. -> Cb
export function urlDecodeKey(key: string | undefined): string | undefined {
  return key?.replace("-flat", "b").replace("-sharp", "#");
}

// C# -> C-sharp
export function urlEncodeKey(key: string | undefined): string | undefined {
  return key?.replace("#", "-sharp").replace("b", "-flat");
}

// #->sharp  /->_  ' '->-
export function urlEncodeChord(chordName: string): string {
  return chordName.replace(/#/g, "sharp").replace(/\//g, "_").replace(/ /g, "-");
}
