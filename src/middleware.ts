import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const protectedRoutes = ["/app/trails", "/app/badges"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookie = await cookies();
  const session = cookie.get("session")?.value;
  const sawIntro = cookie.get("sawIntro")?.value;

  if (path.includes("/app") && path !== "/app/web-summit" && !sawIntro) {
    return NextResponse.redirect(new URL("/app/web-summit", req.url));
  }

  // Handle intro page logic
  if (path === "/app/web-summit" && sawIntro === "true") {
    return NextResponse.redirect(new URL("/app/web-summit/trails", req.url));
  }

  if (!session && isProtectedRoute) {
    const url = new URL(req.nextUrl.origin);
    url.searchParams.set("signin-dialog", "true");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
