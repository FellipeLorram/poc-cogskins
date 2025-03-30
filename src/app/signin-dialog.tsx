"use client";

import { SignInForm } from "@/components/forms/sign-in-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";

export function SignInDialog() {
  const [isOpen, setIsOpen] = useQueryState(
    "signin-dialog",
    parseAsBoolean.withDefault(false)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Entrar</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2 font-medium">
              <Image
                src="/cogskins-logo.png"
                alt="CogSkins Logo"
                width={409}
                height={270}
                className="w-24 h-auto"
              />
              <span className="sr-only">CogSkins</span>
            </div>
            <h1 className="text-xl font-bold">Bem-vindo ao CogSkins.</h1>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Se cadastre
              </Link>
            </div>
          </div>
        </div>
        <SignInForm
          onSuccess={() => {
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
