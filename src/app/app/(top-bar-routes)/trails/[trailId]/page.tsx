import { Trail } from "./trail";

interface Props {
  params: Promise<{
    trailId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { trailId } = await params;

  return <Trail trailId={trailId} />;
}
