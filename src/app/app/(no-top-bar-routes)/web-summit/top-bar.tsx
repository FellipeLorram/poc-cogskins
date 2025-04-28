import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  size?: "small" | "medium" | "large";
}

export function TopBar({ title, size = "medium" }: Props) {
  return (
    <div className="flex justify-center items-center py-4 gap-4 text-center relative w-full">
      <Link href="/app">
        <Image
          src="/cogskins-logo.png"
          alt="CogSkins Logo"
          className="min-w-12 w-12 h-auto"
          width={409}
          height={270}
        />
      </Link>
      <h1
        data-size={size}
        className="data-[size=small]:text-sm data-[size=medium]:text-xl data-[size=large]:text-2xl font-bold"
      >
        {title}
      </h1>
    </div>
  );
}
