"use server";

import { createToken } from "./session";
import { z } from "zod";
import { sendEmail } from "../helpers/send-email";
import { MagicLinkEmail } from "@/lib/react-email/magic-link";

const signInSchema = z.object({
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
});

type SignInSchema = z.infer<typeof signInSchema>;

export async function signIn(data: SignInSchema) {
  const { email } = signInSchema.parse(data);

  const token = await createToken({ email });
  const magicLink = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Log in with this magic link.",
    react: MagicLinkEmail({
      magicLink,
    }),
  });
}
