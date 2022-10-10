import { bwMap, chromaticName, Key, keys, OctaveKeyCount } from "./key";

export type Octave = 2 | 3 | 4 | 5 | 6;

class Note {
  key: Key;
  octave: Octave;

  constructor(key: Key, octave: Octave) {
    if (typeof key === "undefined") throw "undefined key";
    this.key = key;
    this.octave = octave;
  }

  play() {
    throw new Error("Not implemented");
  }

  getChromaticName() {
    return chromaticName[keys.get(this.key)];
  }

  getValue() {
    return keys.get(this.key);
  }

  toString() {
    return chromaticName[keys.get(this.key)] + this.octave;
  }

  valueOf() {
    return this.octave * OctaveKeyCount + this.key;
  }

  get bw() {
    return bwMap[keys.get(this.key)!];
  }
}

export { Note };
