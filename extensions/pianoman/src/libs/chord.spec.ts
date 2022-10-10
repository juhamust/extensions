import { chordDatabase } from "./db";
import { keys } from "./key";

describe("chord", () => {
  it("returns chord from value", () => {
    const valueKey = keys.getKeyFromValue(0);
    // Validate first: C major
    const [{ key, quality }] = chordDatabase[valueKey];
    expect(key).toEqual("C");
    expect(quality).toEqual("Major");
  });
});
