"use client";

import { signOut } from "@/api/auth/sign-out";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useInvalidateQuery } from "@/hooks/use-invalidate-query";
import { useMutation } from "@tanstack/react-query";
import { LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 w-screen">
      <div className="w-11/12 max-w-6xl mx-auto flex justify-between items-center h-16">
        <Link href="/">
          <Image
            src="/cogskins-logo.png"
            alt="CogSkins Logo"
            className="w-16 h-auto"
            width={409}
            height={270}
          />
        </Link>

        <div className="flex gap-4">
          <div className="flex gap-2">
            <Link
              className={buttonVariants({ variant: "ghost" })}
              href="/badges"
            >
              Badges
            </Link>
            <Link
              className={buttonVariants({ variant: "ghost" })}
              href="/trails"
            >
              Trilhas
            </Link>
          </div>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}

function UserMenu() {
  const [, setIsOpen] = useQueryState(
    "signin-dialog",
    parseAsBoolean.withDefault(false)
  );
  const { data: user, isPending } = useSessionUser();

  const { invalidate } = useInvalidateQuery({
    queryKey: ["session-user"],
  });

  const { mutate } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      invalidate();
    },
  });

  if (isPending) return <Skeleton className="w-20 h-9" />;

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
