import { useMemo, useState } from "react";
import ScaleDetails from "./components/ScaleDetails";
import ScaleList from "./components/ScaleList";
import { useScaleSearch } from "./hooks/fuse";
import { getScales } from "./libs/db";
import { Scale } from "./libs/scale";

type CommandProps = { arguments?: { keywords: string | undefined } };

export default function Command(props: CommandProps) {
  const rawValue = props.arguments?.keywords;
  const [filteredScales, setFilteredScales] = useState<Scale[]>([]);

  // Generates scales for each notes
  const scales = useMemo<Scale[]>(() => {
    return getScales();
  }, []);

  const search = useScaleSearch(scales);

  useMemo<void>(() => {
    if (rawValue) {
      const filteredScales = search(rawValue?.split(" "));
      setFilteredScales(filteredScales);
    }
  }, [rawValue]);

  // Show exact match directly
  if (filteredScales.length === 1) {
    return <ScaleDetails scale={filteredScales[0]} />;
  }

  // If rootNote is not selected, show listing
  return <ScaleList scales={scales} />;
}
