import { cookies } from "next/headers";
import { ContentForm } from "./content-form";
import { RecentTrails } from "./recent-trails";

export default async function Home() {
  const cookieStore = await cookies();
  const runId = cookieStore.get("run-task-id")?.value;
  const accessToken = cookieStore.get("run-task-access-token")?.value;

  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full gap-12">
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl">Domine seu conteúdo, conquiste badges</h1>
          <p className="text-sm text-muted-foreground">
            Insira um tópico ou envie arquivos (PDF, DOC, TXT) e transforme seu
            conteúdo em uma trilha de desafios progressivos com badges
            exclusivos.
          </p>
        </div>
        <ContentForm runId={runId} accessToken={accessToken} />
      </div>
      <RecentTrails />
    </div>
  );
}
