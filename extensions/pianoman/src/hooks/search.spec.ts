import { Chord } from "../libs/chord";
import { getChords, getScales } from "../libs/db";
import { Scale } from "../libs/scale";
import { getChordSearch, getScaleSearch, SearchFn } from "../libs/search";

describe("search scales", () => {
  let search: SearchFn<Scale>;

  beforeAll(() => {
    const scales = getScales();
    search = getScaleSearch(scales);
  });

  it("finds C major", () => {
    const searchTerms = ["C major"];
    expect(search(searchTerms)[0].name).toEqual("C major");
  });

  it("finds F# minor", () => {
    const searchTerms = ["F# minor"];
    expect(search(searchTerms)[0].name).toEqual("F# minor");
  });

  it("finds C minor", () => {
    const searchTerms = ["min c"];
    expect(search(searchTerms)[0].name).toEqual("C minor");
  });

  it("finds scales with notes", () => {
    // FIXME: Returns less expected results
    // FIXME: More than 4 terms wont return results
    const searchTerms = ["C", "D", "E", "F"];
    const results = search(searchTerms);
    expect(results[0].name).toEqual("F melodic");
  });
});

describe("search chord", () => {
  let search: SearchFn<Chord>;

  beforeAll(() => {
    const chords = getChords();
    search = getChordSearch(chords);
  });

  it("finds C major", () => {
    const searchTerms = ["Cm7b5"];
    expect(search(searchTerms)[0].alias[0]).toEqual("Cm7b5");
  });

  it("filters with maxLength", () => {
    const searchTerms = ["C maj"];
    expect(search(searchTerms)).toHaveLength(32);
    expect(search(searchTerms, 0.5)).toHaveLength(12);
  });

  it("finds exact chord", () => {
    const searchTerms = ["D#maj9"];
    expect(search(searchTerms)[0].name).toEqual("D# major ninth");
    expect(search(searchTerms)[0].alias[0]).toEqual("D#maj9");
  });

  it("fallback to fuzz search", () => {
    const searchTerms = ["maj 9 D#"];
    expect(search(searchTerms)[0].alias[0]).toEqual("D#maj9#5");
  });
});
