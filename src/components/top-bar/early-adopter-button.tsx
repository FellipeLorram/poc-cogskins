import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { buttonVariants } from "../ui/button";

const webSummitUrl = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_URL as string;

interface Props {
  getUserPromise: Promise<User | null>;
}

export function EarlyAdopterButton({ getUserPromise }: Props) {
  const user = use(getUserPromise);

  if (user && user.isEarlyAdopter) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button>
            <Image
              src="/badges/wsr_early_adopter.png"
              alt="Early Adopter Badge"
              width={409}
              height={270}
              className="w-12 h-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex justify-center">
            <Image
              src="/badges/wsr_early_adopter.png"
              alt="Early Adopter Badge"
              width={409}
              height={270}
              className="w-full h-auto"
            />
          </div>
          <DialogHeader className="items-center justify-center">
            <DialogTitle>Thank You for Being an Early Adopter! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Your support means the world to us. As an early adopter,
              you&apos;re helping shape the future of education.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Link
      className={buttonVariants({
        variant: "outline",
        size: "sm",
        className: "shadow-[#ff4b07] shadow-sm text-[#ff4b07]",
      })}
      href={webSummitUrl}
    >
      Early Adopter
    </Link>
  );
}
