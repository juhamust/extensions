import { useMemo, useState } from "react";
import ChordDetails from "./components/ChordDetails";
import NoteList from "./components/NoteList";
import { useChordSearch } from "./hooks/fuse";
import { Chord } from "./libs/chord";
import { chords } from "./libs/db";
import { keySimpleList } from "./libs/key";

export default function Command(props: { arguments?: { keywords: string } }) {
  const rawValue = props?.arguments?.keywords;
  const search = useChordSearch(chords);
  const [filteredChords, setFilteredChords] = useState<Chord[]>([]);

  useMemo<void>(() => {
    if (rawValue) {
      const filteredChords = search(rawValue?.split(" "));
      setFilteredChords(filteredChords);
    }
  }, [rawValue]);

  // Show exact match directly
  if (filteredChords.length === 1) {
    return <ChordDetails chord={filteredChords[0]} />;
  }

  // Otherwise show listing
  return <NoteList noteNames={keySimpleList} />;
}
