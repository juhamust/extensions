import { Detail } from "@raycast/api";

type ChordErrorProps = {
  details?: any;
};

export function ChordError({ details }: ChordErrorProps) {
  const content = `
  # Failed to find piano chord

  Error occured.

  \`\`\`
  ${JSON.stringify(details)}
  \`\`\`
  
  `;

  return <Detail markdown={content} />;
}
