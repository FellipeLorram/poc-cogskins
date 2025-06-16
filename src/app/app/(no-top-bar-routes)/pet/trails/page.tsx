import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { dataStore } from "../data-store";
import { Trail } from "../types";
import { TopBar } from "../top-bar";

export default function Page() {
  const trails = dataStore.listTrails();

  return (
    <div className="min-h-screen w-full flex flex-col gap-8">
      <TopBar title="Trails" />
      <div className="flex flex-col gap-4 w-full">
        {trails.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
}

function TrailCard({ trail }: { trail: Trail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trail: {trail.title}</CardTitle>
        <CardDescription>{trail.summary}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`/app/pet/trails/${trail.id}`}>
          <Button>Start</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
