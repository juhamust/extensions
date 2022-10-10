import { chordDatabase, getNote, getScale } from "./db";
import {
  findNoteByName,
  getChordKeyListing,
  getHighlightTableFromScale,
  trimLines,
} from "./helper";

describe("helper", () => {
  it("finds valid note", () => {
    expect(findNoteByName("C#")).toEqual("C#");
  });

  it("trims the lines", () => {
    const expectedLines = ["# This is title", "This is paragraph", "- This is list"];

    expect(
      trimLines(`
        # This is title
        This is paragraph
        - This is list
      `).join("\n"),
    ).toEqual(expectedLines.join("\n"));
  });

  it("returns highlight table for scale", () => {
    const scale = getScale("major", getNote("C")!);
    const table = getHighlightTableFromScale(scale);
    expect(table.slice(0, 14)).toEqual([
      true, // C
      false, // C#
      true, // D
      false, // D#
      true, // E
      true, // F
      false, // F#
      true, // G
      false, // G#
      true, // A
      false, // A#
      true, // B
      true, // C
      false, // C#
    ]);
  });

  it("returns chord key listing", () => {
    // Testing with C major listing
    const cMajorChord = chordDatabase["C"][0];
    expect(getChordKeyListing(cMajorChord)).toEqual(["C", "E", "G"]);
    expect(getChordKeyListing(cMajorChord.inversions[0])).toEqual(["E", "G", "C"]);
    expect(getChordKeyListing(cMajorChord.inversions[1])).toEqual(["G", "C", "E"]);
  });
});
