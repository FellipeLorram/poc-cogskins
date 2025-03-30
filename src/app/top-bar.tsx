"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import Image from "next/image";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";

export function TopBar() {
  const { data: user } = useSessionUser();
  const [, setIsOpen] = useQueryState(
    "signin-dialog",
    parseAsBoolean.withDefault(false)
  );

  return (
    <div className="w-11/12 max-w-6xl mx-auto flex justify-between items-center h-16">
      <Image
        src="/cogskins-logo.png"
        alt="CogSkins Logo"
        className="w-16 h-auto"
        width={409}
        height={270}
      />

      <div className="flex gap-4">
        <Link className={buttonVariants({ variant: "ghost" })} href="/trails">
          Trilhas
        </Link>
        {!user && (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            Entrar
          </Button>
        )}
      </div>
    </div>
  );
}
