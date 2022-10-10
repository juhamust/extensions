import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { chordDatabase, getNote } from "../libs/db";
import { Key } from "../libs/key";
import { Note } from "../libs/note";
import ChordGrid from "./ChordGrid";

type KeyListProps = {
  noteNames: Key[];
  isLoading?: boolean;
};

export default function NoteList({ noteNames, isLoading = false }: KeyListProps) {
  return (
    <List isLoading={isLoading}>
      {noteNames
        .filter((noteName) => Boolean(getNote(noteName)))
        .map((noteName, index) => {
          const singleKeyChords = chordDatabase[noteName];
          const rootNote = getNote(noteName) as Note;

          if (!rootNote) {
            throw new Error(`Failed to find ${noteName} -> ${rootNote}`);
          }

          const target = <ChordGrid rootNote={rootNote} chords={singleKeyChords} />;
          return (
            <List.Item
              key={index}
              icon={Icon.Music}
              title={noteName}
              accessories={[{ text: `See chords for ${noteName}` }]}
              actions={
                <ActionPanel>
                  <Action.Push
                    target={target}
                    icon={Icon.AppWindowGrid3x3}
                    title="Open Chord Details"
                  />
                </ActionPanel>
              }
            />
          );
        })}
    </List>
  );
}
