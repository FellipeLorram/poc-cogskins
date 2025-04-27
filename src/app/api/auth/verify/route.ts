import { createSession, verifyToken } from "@/api/auth/session";
import { prisma } from "@/lib/prisma-client";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 400 }
      );
    }

    const { payload, expired } = await verifyToken(token);

    if (expired || !payload?.email) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    let user: User | null;

    user = await prisma.user.findUnique({
      where: {
        email: payload.email as string,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email as string,
        },
      });
    }

    await createSession({
      userId: user.id,
    });

    return NextResponse.redirect("https://cogskins.com.br/app");
  } catch {
    return NextResponse.json(
      { error: "Falha ao verificar token" },
      { status: 500 }
    );
  }
}
