import { Feedback } from "./feedback";

interface Props {
  params: Promise<{
    trailId: string;
    questId: string;
  }>;
  searchParams: Promise<{
    accessToken: string;
    runId: string;
  }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { trailId, questId } = await params;
  const { accessToken, runId } = await searchParams;

  return (
    <Feedback
      trailId={trailId}
      questId={questId}
      accessToken={accessToken}
      runId={runId}
    />
  );
}
