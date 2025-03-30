import { ContentForm } from "./content-form";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl">Domine seu conteúdo, conquiste badges</h1>
        <p className="text-sm text-muted-foreground">
          Insira um tópico ou envie arquivos (PDF, DOC, TXT) e transforme seu
          conteúdo em uma trilha de desafios progressivos com badges exclusivos.
        </p>
      </div>
      <ContentForm />
    </div>
  );
}
