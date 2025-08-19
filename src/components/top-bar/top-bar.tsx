import { getSessionUser } from "@/api/user/get-session-user";
import { buttonVariants } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Link from "next/link";
import { EarlyAdopterButton } from "./early-adopter-button";
import { Button } from "../ui/button";

export async function TopBar() {
  const user = await getSessionUser();

  return (
    <div className="fixed top-0 left-0 w-screen bg-background z-50">
      <div className="w-11/12 max-w-6xl mx-auto flex justify-between items-center h-16 bg-background">
        <Link href="/app">
          <Image
            src="/cogskins-logo.png"
            alt="CogSkins Logo"
            className="min-w-12 w-12 h-auto"
            width={409}
            height={270}
          />
        </Link>

        <div className="flex items-center justify-center gap-1 md:gap-2">
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "shadow-[#075aff] shadow-sm text-[#075aff]",
            })}
            href="/app/pet"
          >
            Pet, o dragão
          </Link>
          <EarlyAdopterButton getUserPromise={getSessionUser()} />

          {user ? (
            <Link
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
              href={`${process.env.KINDE_ISSUER_URL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              My Account
            </Link>
          ) : (
            <LoginLink>
              <Button size="sm">Sign in</Button>
            </LoginLink>
          )}
        </div>
      </div>
    </div>
  );
}
