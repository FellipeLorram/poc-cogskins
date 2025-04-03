"use client";

import { signOut } from "@/api/auth/sign-out";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInvalidateQuery } from "@/hooks/use-invalidate-query";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useMutation } from "@tanstack/react-query";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Skeleton } from "../ui/skeleton";

export function UserMenu() {
  const { data: user, isPending } = useSessionUser();
  const [, setIsOpen] = useQueryState(
    "signin-dialog",
    parseAsBoolean.withDefault(false)
  );

  const { invalidate } = useInvalidateQuery({
    queryKey: ["session-user"],
  });

  const { mutate } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      invalidate();
    },
  });

  if (isPending) {
    return <Skeleton className="w-20 h-9" />;
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        className="w-20"
        onClick={() => setIsOpen(true)}
      >
        Entrar
      </Button>
    );
  }

  const fallback = user?.name ?? user?.email ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AvatarWithFallback
          src={user?.image ?? null}
          fallback={fallback}
          className="w-8 h-8 cursor-pointer border border-transparent hover:border-border duration-200"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link className="flex items-center gap-2 w-full" href="/profile">
            <UserIcon className="w-4 h-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => mutate()}>
          <LogOut className="w-4 h-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
