import Fuse from "fuse.js";
import { Chord } from "./chord";
import { Key } from "./key";
import { Scale, ScaleTypeName } from "./scale";
import Expression = Fuse.Expression;
import IFuseOptions = Fuse.IFuseOptions;

export type SearchFn<T> = (searchTerms: string[], maxScore?: number) => T[];

export type SearchMatch<T> = Fuse.FuseResult<T>;
export type ChordSearchMatch = SearchMatch<{ key: Key; alias: string[]; name: string }>;
export type ScaleSearchMatch = SearchMatch<{
  name: string;
  type: ScaleTypeName;
  rootNote: Key;
  notes: Key[];
}>;

export function getChordSearch(chords: Chord[], searchOptions: IFuseOptions<any> = {}) {
  const options = {
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 1,
    useExtendedSearch: true,
    findAllMatches: true,
    keys: [{ name: "name", weight: 3 }, { name: "alias", weight: 2 }, "key"],
    ...searchOptions,
  } as IFuseOptions<any>;

  const chordFields = chords.map((chord) => {
    return {
      key: chord.key,
      alias: chord.alias,
      name: chord.name,
    };
  });

  const fuse = new Fuse(chordFields, options);
  const getChordResults = (
    searchMatches: ChordSearchMatch[],
    chords: Chord[],
    maxScore?: number,
  ) => {
    return searchMatches
      .filter((searchMatch) =>
        maxScore !== undefined && searchMatch.score !== undefined
          ? searchMatch.score <= maxScore
          : true,
      )
      .map((searchMatch) => chords[searchMatch.refIndex]);
  };

  // Custom search
  const search: SearchFn<Chord> = (searchTerms, maxScore) => {
    // Use exact search 1st
    const exactPattern: Expression = {
      $or: [
        { alias: `="${searchTerms.join(" ")}"` },
        { name: `="${searchTerms.join(" ")}"` },
        { key: `="${searchTerms.join(" ")}"` },
      ],
    };
    const exactResponse = fuse.search(exactPattern);
    // Found exact match -> return only first
    if (exactResponse.length > 0) {
      return getChordResults(exactResponse, chords, maxScore).slice(0, 1);
    }

    // Use fuzz search 2nd
    const fuzzResponse = fuse.search({
      $or: [{ name: searchTerms.join(" ") }, { key: searchTerms.join(" ") }],
    });

    return getChordResults(fuzzResponse, chords, maxScore);
  };

  return search as SearchFn<Chord>;
}

export function getScaleSearch(scales: Scale[], searchOptions: IFuseOptions<any> = {}) {
  const options = {
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 1,
    useExtendedSearch: true,
    findAllMatches: false,
    keys: ["name", "type", "notes", "rootNote"],
    ...searchOptions,
  } as IFuseOptions<any>;

  const scaleFields = scales.map((scale) => {
    return {
      name: scale.name,
      type: scale.type,
      rootNote: scale.notes[0].key,
      notes: scale.notes.map((note) => note.key),
    };
  });

  const fuse = new Fuse(scaleFields, options);
  const getScaleResults = (
    searchMatches: ScaleSearchMatch[],
    scales: Scale[],
    maxScore?: number,
  ) => {
    return searchMatches
      .filter((searchMatch) =>
        maxScore !== undefined && searchMatch.score !== undefined
          ? searchMatch.score <= maxScore
          : true,
      )
      .map((searchMatch) => scales[searchMatch.refIndex]);
  };

  // Custom search
  const search: SearchFn<Scale> = (searchTerms, maxScore) => {
    // Use exact search 1st
    const exactPattern: Expression = {
      $or: [
        { notes: searchTerms.join(" ") },
        { name: `="${searchTerms.join(" ")}"` },
        { type: `="${searchTerms.join(" ")}"` },
        { rootNote: `="${searchTerms.join(" ")}"` },
      ],
    };
    const exactResponse = fuse.search(exactPattern);
    // Found exact match(es)
    if (exactResponse.length > 0) {
      return getScaleResults(exactResponse, scales, maxScore);
    }

    // Use fuzz search 2nd
    const fuzzResponse = fuse.search({
      $or: [
        { name: searchTerms.join(" ") },
        { type: searchTerms.join(" ") },
        { rootNote: searchTerms.join(" ") },
        { notes: searchTerms.join(" ") },
      ],
    });

    return getScaleResults(fuzzResponse, scales, maxScore);

    // Group terms for both notes and name-like entries
    /*
    const { nameTerms, noteTerms } = searchTerms.reduce<{
      nameTerms: string[];
      noteTerms: string[];
    }>(
      (previousValue, searchTerm, currentIndex) => {
        const note = getNote(searchTerm as Key);
        if (note) {
          previousValue.noteTerms.push(note.key);
        } else {
          previousValue.nameTerms.push(searchTerm);
        }
        return previousValue;
      },
      { nameTerms: [], noteTerms: [] },
    );

    const namePatterns = [];
    let notePatterns = [];

    if (nameTerms.length > 0) {
      namePatterns.push({
        name: nameTerms.join(" "),
      });
    }

    if (noteTerms.length > 0) {
      notePatterns = noteTerms.map<any>((noteTerm) => ({
        notes: noteTerm,
      }));
    }

    const pattern =
      namePatterns.length > 0
        ? {
            $and: namePatterns,
          }
        : { $and: notePatterns };

    const response = fuse.search(pattern);
    const searchedScales = response
      .filter((scale) =>
        maxScore !== undefined && scale.score !== undefined ? scale.score <= maxScore : true,
      )
      .map((scale) => scales[scale.refIndex]);

    */
  };

  return search as SearchFn<Scale>;
}
