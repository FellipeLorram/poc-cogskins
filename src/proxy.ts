import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  return withAuth(req);
}

export const config = {
  matcher: ["/app/trails/:path*", "/app/badges/:path*"],
};
