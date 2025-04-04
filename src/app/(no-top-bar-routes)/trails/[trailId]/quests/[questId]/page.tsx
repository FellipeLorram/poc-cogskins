import { Question } from "./question";

interface Props {
  params: Promise<{
    trailId: string;
    questId: string;
  }>;
  searchParams: Promise<{
    questionId: string;
  }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { trailId, questId } = await params;
  const { questionId } = await searchParams;

  if (!questionId) {
    return <div>Question ID is required</div>;
  }

  return (
    <Question trailId={trailId} questId={questId} questionId={questionId} />
  );
}
