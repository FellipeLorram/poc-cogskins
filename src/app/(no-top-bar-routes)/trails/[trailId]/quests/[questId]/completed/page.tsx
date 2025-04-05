import { Completed } from "./completed";

interface Props {
  params: Promise<{
    trailId: string;
    questId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { trailId, questId } = await params;
  return <Completed trailId={trailId} questId={questId} />;
}
