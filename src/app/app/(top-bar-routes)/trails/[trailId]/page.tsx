import { Trail } from "./trail";

interface Props {
  params: Promise<{
    trailId: string;
  }>;
  searchParams: Promise<{
    flag?: string;
  }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { trailId } = await params;
  const { flag } = await searchParams;

  return <Trail trailId={trailId} flag={flag} />;
}
