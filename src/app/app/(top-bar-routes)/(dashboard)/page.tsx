import { ContentForm } from "./content-form";
import { RecentTrails } from "./recent-trails";

export default async function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full gap-12">
      <div className="flex flex-col gap-8 w-full pt-32 md:pt-0">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl md:text-4xl">
            Master your content, earn badges
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Enter a topic or upload files (PDF, DOC, TXT) and transform your
            content into a trail of progressive challenges with exclusive
            badges.
          </p>
        </div>
        <ContentForm />
      </div>
      <RecentTrails />
    </div>
  );
}
