import { Action, ActionPanel, Grid, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { useChordSearch } from "../hooks/fuse";
import { Chord } from "../libs/chord";
import { Note } from "../libs/note";
import ChordDetails from "./ChordDetails";
import { ChordError } from "./ChordError";
import { getKeyboardImageUrl } from "./Keyboard";

type ChordGridProps = {
  rootNote?: Note;
  chords: Chord[];
  isLoading?: boolean;
};

/**
 * Show the grid of chords from single key
 */
export default function ChordGrid({ rootNote, chords, isLoading = false }: ChordGridProps) {
  const [searchText, setSearchText] = useState("");
  const [filteredChords, filterChords] = useState(chords);
  const search = useChordSearch(chords);

  if (!rootNote) {
    return <ChordError details={{ rootNote, chords }} />;
  }

  useEffect(() => {
    if (searchText.trim() === "") {
      filterChords(chords);
      return;
    }
    const searchedChords = search(searchText.split(" ").map((term) => term.trim()));
    // console.log(searchText, searchedChords, "all:", chords.length);
    filterChords(searchedChords);
  }, [searchText]);

  // Create a grid of chords, based on the selected note
  const gridItems = filteredChords.map((chordData, index) => {
    const chordImageData = getKeyboardImageUrl({ input: chordData });
    // When selected, show chord details from single chord
    return (
      <Grid.Item
        key={index}
        actions={
          <ActionPanel>
            <Action.Push
              title="Open Chord Details"
              icon={Icon.AppWindowSidebarRight}
              target={<ChordDetails chord={chordData} />}
            />
          </ActionPanel>
        }
        content={chordImageData}
        title={chordData.fullName}
        subtitle={chordData.alias.join(", ")}
      />
    );
  });

  return (
    <Grid
      isLoading={isLoading}
      enableFiltering={false}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Filter chords by names"
      navigationTitle="Search Chords"
      itemSize={Grid.ItemSize.Large}
    >
      <Grid.Section title={rootNote.getChromaticName()}>{gridItems}</Grid.Section>
    </Grid>
  );
}
