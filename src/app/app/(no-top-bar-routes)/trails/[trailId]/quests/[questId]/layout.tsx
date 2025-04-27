import { Wrapper } from "./wrapper";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    trailId: string;
    questId: string;
  }>;
}

export default async function Layout({ children, params }: Props) {
  const { trailId, questId } = await params;

  return (
    <Wrapper trailId={trailId} questId={questId}>
      {children}
    </Wrapper>
  );
}
