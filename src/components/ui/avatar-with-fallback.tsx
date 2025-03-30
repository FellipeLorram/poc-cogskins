import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";

interface Props {
  src: string | null;
  fallback: string;
  className?: string;
}

export function AvatarWithFallback({ src, fallback, className }: Props) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={src ?? ""} alt={fallback} />
      <AvatarFallback className="uppercase text-sm">
        {fallback.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
