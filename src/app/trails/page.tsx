import { TrailsList } from "./trails-list";

export default function Trails() {
  return (
    <>
      <div className="text-left mt-16 mb-8">
        <h1 className="text-4xl">Suas Trilhas</h1>
      </div>
      <TrailsList />
    </>
  );
}
