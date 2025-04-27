import { Earned } from "./earned";

interface Props {
  params: Promise<{
    trailId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { trailId } = await params;

  return <Earned trailId={trailId} />;
}
