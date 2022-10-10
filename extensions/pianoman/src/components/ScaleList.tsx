import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useScaleSearch } from "../hooks/fuse";
import { Scale } from "../libs/scale";
import ScaleDetails, { getNoteListing } from "./ScaleDetails";

type KeyListProps = {
  scales: Scale[];
  isLoading?: boolean;
};

export default function ScaleList({ scales, isLoading = false }: KeyListProps) {
  const [searchText, setSearchText] = useState("");
  const [filteredScales, filterScales] = useState(scales);
  const search = useScaleSearch(scales);

  useEffect(() => {
    if (searchText === "") {
      filterScales(scales);
      return;
    }
    const searchedScales = search(searchText.split(" ").map((term) => term.trim()));
    filterScales(searchedScales);
  }, [searchText]);

  return (
    <List isLoading={isLoading} enableFiltering={false} onSearchTextChange={setSearchText}>
      {filteredScales.map((scale, index) => {
        return (
          <List.Item
            key={index}
            icon={Icon.Music}
            title={scale.name}
            subtitle={getNoteListing(scale)}
            actions={
              <ActionPanel>
                <Action.Push
                  title="Open Scale Details"
                  icon={Icon.AppWindowSidebarRight}
                  target={<ScaleDetails scale={scale} />}
                />
              </ActionPanel>
            }
            accessories={[
              {
                text: "Open scale details",
              },
            ]}
          />
        );
      })}
    </List>
  );
}
