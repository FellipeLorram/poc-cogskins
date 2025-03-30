import { createUserMagicLink } from "@/api/auth/create-user-magic-link";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  const user = await createUserMagicLink({ email });

  return NextResponse.json({ user });
}
