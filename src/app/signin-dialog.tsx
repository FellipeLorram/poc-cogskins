"use client";

import { SignInForm } from "@/components/forms/sign-in-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";
import { toast } from "sonner";

export function SignInDialog() {
  const [isOpen, setIsOpen] = useQueryState(
    "signin-dialog",
    parseAsBoolean.withDefault(false)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Signin</DialogTitle>
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
            <h1 className="text-xl font-bold">Welcome to CogSkins.</h1>
          </div>
        </div>
        <SignInForm
          onSuccess={() => {
            setIsOpen(false);
            toast.success("We sent a login link to your email.");
          }}
        />
        <DialogFooter className="flex items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">
            By logging in, you agree to the{" "}
            <Link
              className="underline"
              target="_blank"
              href="/terms-of-service.pdf"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              className="underline"
              target="_blank"
              href="/privacy-policy.pdf"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
