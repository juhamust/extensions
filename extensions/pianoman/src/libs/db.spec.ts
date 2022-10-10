import { generateScaleNotes } from "./db";
import { Key } from "./key";
import { Note, Octave } from "./note";
import { ScaleTypeName } from "./scale";

class KeyOct extends Map<Key, Octave> {
  getNotes() {
    const notes: Note[] = [];
    for (const [key, octave] of super.entries()) {
      notes.push(new Note(key, octave));
    }

    return notes;
  }
}

function testScale(scaleType: ScaleTypeName, notes: Note[]) {
  const rootNote = notes[0];
  const scaleNotes = [...generateScaleNotes(scaleType, rootNote)];

  notes.forEach((note, index) => {
    expect(scaleNotes[index].key).toEqual(note.key);
    expect(scaleNotes[index].octave).toEqual(note.octave);
  });
}

describe("db", () => {
  it("generates C major scale", () => {
    const keyOct = new KeyOct([
      ["C", 2],
      ["D", 2],
      ["E", 2],
      ["F", 2],
      ["G", 2],
      ["A", 2],
      ["B", 2],
    ]);
    testScale("major", keyOct.getNotes());
  });

  it("generates C minor scale", () => {
    const keyOct = new KeyOct([
      ["C", 2],
      ["D", 2],
      ["D#", 2],
      ["F", 2],
      ["G", 2],
      ["G#", 2],
      ["A#", 2],
    ]);
    testScale("minor", keyOct.getNotes());
  });

  it("generates D major scale", () => {
    const keyOct = new KeyOct([
      ["D", 2],
      ["E", 2],
      ["F#", 2],
      ["G", 2],
      ["A", 2],
      ["B", 2],
      ["C#", 3],
    ]);
    testScale("major", keyOct.getNotes());
  });

  it("generates Ab minor scale", () => {
    const keyOct = new KeyOct([
      ["G#", 2],
      ["A#", 2],
      ["B", 2],
      ["C#", 3],
      ["D#", 3],
      ["E", 3],
      ["F#", 3],
    ]);
    testScale("minor", keyOct.getNotes());
  });
});
