import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { Chord } from "../libs/chord";
import constants from "../libs/constants";
import { getChordKeyListing, trimLines, urlDecodeKey, urlEncodeChord } from "../libs/helper";
import { getKeyboardImageUrl, KeyboardOptions } from "./Keyboard";

export function getNoteListing(chord: Chord) {
  return getChordKeyListing(chord).join(" - ");
}

export function getInversionsContent({
  chord,
  options,
}: {
  chord: Chord;
  options?: KeyboardOptions;
}) {
  const inversionsMd = trimLines(
    chord.inversions.map((inversion, _index) => {
      const inversionName = inversion.fullName.length > 0 ? inversion.fullName : inversion.alias[0];
      return `
      ### Inversion: ${inversionName}
      ![](${getKeyboardImageUrl({ input: inversion, options })})
      `;
    }),
  ).join("\n");

  return trimLines(`
  # ${chord.fullName}

  ![](${getKeyboardImageUrl({ input: chord, options })})

  ${inversionsMd}
  `).join("\n");
}

export default function ChordDetails({ chord }: { chord: Chord }) {
  const options: KeyboardOptions = {
    highlightColor: "#ff6363",
    whiteWidth: 18,
    whiteHeight: 80,
    blackWidth: 9,
    blackHeight: 50,
  };

  // Build metadata
  const pianoChordIoUrl = `https://pianochord.io/chord/${urlDecodeKey(
    chord.tonic,
  )}/${urlEncodeChord(chord.fullName)}`;
  const contentMd = getInversionsContent({ chord, options });

  // Generate actions for chord and chord inversions
  const actions = [
    <Action.CopyToClipboard
      key={0}
      title={`Copy Chord Notes: ${chord.name}`}
      content={getNoteListing(chord)}
      icon={Icon.Clipboard}
    />,
  ];
  chord.inversions.forEach((inversionChord, index) => {
    actions.push(
      <Action.CopyToClipboard
        key={index + 1}
        title={`Copy Chord Notes: ${inversionChord.name}`}
        content={getNoteListing(inversionChord)}
        icon={Icon.Clipboard}
      />,
    );
  });

  return (
    <Detail
      markdown={contentMd}
      navigationTitle={chord.fullName}
      actions={<ActionPanel title="Chord">{actions}</ActionPanel>}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Topic" text={chord.tonic} />
          <Detail.Metadata.Label title="Intervals" text={chord.intervals.join(", ")} />
          <Detail.Metadata.Label title="Quality" text={chord.quality} />
          <Detail.Metadata.TagList title="Aliases">
            {chord.alias.map((alias, index) => (
              <Detail.Metadata.TagList.Item
                key={index}
                text={alias}
                color={constants.colors.green}
              />
            ))}
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link title="Links" target={pianoChordIoUrl} text="Pianochord.io" />
        </Detail.Metadata>
      }
    />
  );
}
