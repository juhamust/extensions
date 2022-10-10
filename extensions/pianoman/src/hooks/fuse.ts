import { useMemo } from "react";
import { Chord } from "../libs/chord";
import { Scale } from "../libs/scale";
import { getChordSearch, getScaleSearch, SearchFn } from "../libs/search";

export function useChordSearch(chords: Chord[]) {
  return useMemo<SearchFn<Chord>>(() => {
    return getChordSearch(chords);
  }, [chords]);
}

export function useScaleSearch(scales: Scale[]) {
  return useMemo<SearchFn<Scale>>(() => {
    return getScaleSearch(scales);
  }, [scales]);
}
