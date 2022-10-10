import { keys, Value } from "./key";

describe("key", () => {
  it("returns key from value", () => {
    const key = keys.getKeyFromValue(0);
    expect(key).toEqual("C");
  });

  it("returns key for first matching value", () => {
    const key = keys.getKeyFromValue(1);
    expect(key).toEqual("C#");
  });
});
