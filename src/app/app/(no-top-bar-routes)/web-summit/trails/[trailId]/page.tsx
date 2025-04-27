import { Trail } from "./trail";
import { TopBar } from "../../top-bar";
import { dataStore } from "../../data-store";
import { TrailId } from "../../types";

interface Props {
  params: Promise<{
    trailId: TrailId;
  }>;
}

export default async function Page({ params }: Props) {
  const { trailId } = await params;
  const trail = dataStore.getTrailById(trailId);

  if (!trail) {
    return <div>Trail not found</div>;
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <TopBar title="Quests" />
      <Trail trail={trail} />
    </div>
  );
}
