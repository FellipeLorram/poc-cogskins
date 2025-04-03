interface Props {
  questId: string;
}

export function Quest({ questId }: Props) {
  return <div>{questId}</div>;
}
