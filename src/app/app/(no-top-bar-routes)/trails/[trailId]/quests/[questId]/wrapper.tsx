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
import { useGetTrail } from "@/hooks/trails/use-get-trail";
import { ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useQuestionStore } from "./question-store";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  trailId: string;
  questId: string;
  children: React.ReactNode;
}

export function Wrapper({ trailId, questId, children }: Props) {
  const { data: trail, isLoading: isLoadingTrail } = useGetTrail({ trailId });
  const quest = trail?.quests.find((quest) => quest.id === questId);

  if (isLoadingTrail) return <Loading>{children}</Loading>;

  return (
    <div className="mt-16 text-left w-full">
      <GoBackDialog trailId={trailId} />
      <div className="space-y-2 pb-8 border-b border-border mb-8 mt-4">
        <h1 className="text-2xl md:text-3xl font-medium">{trail?.title}</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {quest?.description}
        </p>
      </div>
      {children}
    </div>
  );
}

const goBackRoutes = ["feedback", "completed"];

function GoBackDialog({ trailId }: { trailId: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { answeredQuestions, reset } = useQuestionStore();

  if (
    answeredQuestions.length === 0 ||
    goBackRoutes.some((route) => pathname.includes(route))
  )
    return (
      <button
        onClick={() => {
          router.push(`/app/trails/${trailId}`);
          reset();
        }}
        type="button"
        className="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer hover:text-primary duration-200 h-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </button>
    );

  function handleGoBack() {
    setIsOpen(true);
    reset();
    router.push(`/app/trails/${trailId}`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer hover:text-primary duration-200 h-6"
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

function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-16 text-left w-full">
      <Skeleton className="h-6 w-12" />
      <div className="space-y-2 pb-8 border-b border-border mb-8 mt-4">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
      {children}
    </div>
  );
}
