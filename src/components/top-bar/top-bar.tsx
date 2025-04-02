import { getSessionUser } from "@/api/user/get-session-user";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { UserMenu } from "./user-menu";

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
          <Suspense fallback={<Skeleton className="w-20 h-9" />}>
            <UserMenu getUserPromise={getSessionUser()} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
