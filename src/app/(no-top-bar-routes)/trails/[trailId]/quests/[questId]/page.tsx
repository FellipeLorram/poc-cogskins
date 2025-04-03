import { Quest } from "./quest";

interface Props {
  params: Promise<{
    trailId: string;
    questId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { trailId, questId } = await params;

  return <Quest trailId={trailId} questId={questId} />;
}
