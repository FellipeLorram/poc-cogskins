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
import { createCustomerLinkPortal } from "@/lib/stripe/create-customer-link-portal";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Badge, BookOpen, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";
import { use } from "react";
import { useStore } from "@/app/app/(no-top-bar-routes)/web-summit/store";
import { useRouter } from "next/navigation";
interface Props {
  getUserPromise: Promise<User | null>;
}

export function UserMenu({ getUserPromise }: Props) {
  const router = useRouter();
  const user = use(getUserPromise);
  const [, setIsOpen] = useQueryState(
    "signin-dialog",
    parseAsBoolean.withDefault(false)
  );

  const { clear } = useStore();

  const { invalidate } = useInvalidateQuery({
    queryKey: ["session-user"],
  });

  const { mutate } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      clear();
      invalidate();
      router.push("/app");
      window.location.reload();
    },
  });

  if (!user) {
    return (
      <Button size="sm" onClick={() => setIsOpen(true)}>
        Sign in
      </Button>
    );
  }

  const fallback = user?.name ?? user?.email ?? "";

  async function handleProfileClick() {
    if (!user) return;

    const url = await createCustomerLinkPortal(user.stripeCustomerId as string);
    window.open(url, "_blank");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarWithFallback
          src={user?.image ?? null}
          fallback={fallback}
          className="w-8 h-8 cursor-pointer border border-transparent hover:border-border duration-200"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user.stripeCustomerId && (
          <DropdownMenuItem onClick={handleProfileClick}>
            <CreditCard className="w-4 h-4" />
            Subscription
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link className="flex items-center gap-2 w-full" href="/app/badges">
            <Badge className="w-4 h-4" />
            Badges
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="flex items-center gap-2 w-full" href="/app/trails">
            <BookOpen className="w-4 h-4" />
            Trails
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => mutate()}>
          <LogOut className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
