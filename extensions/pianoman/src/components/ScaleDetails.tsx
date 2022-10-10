import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { KeyboardOptions } from "../components/Keyboard";
import { colors } from "../libs/constants";
import { getScaleKeyListing, trimLines } from "../libs/helper";
import { Scale } from "../libs/scale";
import { getKeyboardImageUrl } from "./Keyboard";

export function getContent({ scale, options }: { scale: Scale; options?: KeyboardOptions }) {
  return trimLines(`
  # ${scale.name}

  ![](${getKeyboardImageUrl({ input: scale, options })})

  ${getNoteListing(scale)}

  `).join("\n");
}

export function getNoteListing(scale: Scale) {
  return getScaleKeyListing(scale).join(" - ");
}

export default function ScaleDetails({ scale }: { scale: Scale }) {
  const options: KeyboardOptions = {
    highlightColor: colors.red,
    whiteWidth: 18,
    whiteHeight: 80,
    blackWidth: 9,
    blackHeight: 50,
  };

  // Build metadata
  const contentMd = getContent({ scale: scale, options });

  return (
    <Detail
      markdown={contentMd}
      navigationTitle={scale.name}
      actions={
        <ActionPanel title="Scale">
          <Action.CopyToClipboard
            title="Copy Scale Notes"
            content={getNoteListing(scale)}
            icon={Icon.Clipboard}
          />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Type" text={scale.name} />
        </Detail.Metadata>
      }
    />
  );
}
