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
          width={409}
          height={270}
          data-size={size}
          className="w-12 absolute left-4 top-1/2 -translate-y-1/2 data-[size=small]:w-12 data-[size=medium]:w-16 data-[size=large]:w-20"
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
