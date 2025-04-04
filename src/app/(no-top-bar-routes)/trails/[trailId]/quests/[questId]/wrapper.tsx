"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetQuest } from "@/hooks/quests/use-get-quest";
import { useGetTrail } from "@/hooks/trails/use-get-trail";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuestionStore } from "./question-store";

interface Props {
  trailId: string;
  questId: string;
  children: React.ReactNode;
}

export function Wrapper({ trailId, questId, children }: Props) {
  const { data: trail } = useGetTrail({ trailId });
  const { data: quest } = useGetQuest({ trailId, questId });

  return (
    <div className="mt-16 text-left w-full">
      <GoBackDialog trailId={trailId} />
      <div className="space-y-2 pb-8 border-b border-border mb-8 mt-4">
        <h1 className="text-3xl font-medium">{trail?.title}</h1>
        <p className="text-muted-foreground">{quest?.description}</p>
      </div>
      {children}
    </div>
  );
}

function GoBackDialog({ trailId }: { trailId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { answeredQuestions, reset } = useQuestionStore();

  if (!answeredQuestions.length)
    return (
      <button
        onClick={() => router.push(`/trails/${trailId}`)}
        type="button"
        className="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer hover:text-primary duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </button>
    );

  function handleGoBack() {
    setIsOpen(true);
    reset();
    router.back();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer hover:text-primary duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voltar</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Você já respondeu algumas questões. Deseja voltar mesmo assim? <br />
          Seu progresso será perdido.
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleGoBack}
          >
            Voltar e perder o progresso
          </Button>
          <Button className="cursor-pointer" onClick={() => setIsOpen(false)}>
            Continuar e finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
