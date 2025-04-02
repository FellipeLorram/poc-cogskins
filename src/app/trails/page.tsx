import { TrailsList } from "./trails-list";

export default function Trails() {
  return (
    <div className="min-h-screen mt-16 w-full px-4 pb-16">
      <div className="text-left mt-16 mb-8">
        <h1 className="text-4xl">Suas Trilhas</h1>
      </div>
      <TrailsList />
    </div>
  );
}
