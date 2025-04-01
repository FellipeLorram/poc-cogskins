import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const protectedRoutes = ["/trails", "/badges"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookie = await cookies();
  const session = cookie.get("session")?.value;

  if (isProtectedRoute && !session) {
    const url = new URL(req.nextUrl.origin);
    url.searchParams.set("signin-dialog", "true");
    return NextResponse.redirect(url);
  }

  if (!session && isProtectedRoute) {
    const url = new URL(req.nextUrl.origin);
    url.searchParams.set("signin-dialog", "true");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
