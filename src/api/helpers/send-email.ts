"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailRequest {
  to: string;
  subject: string;
  react: React.ReactNode;
  text?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  text,
}: SendEmailRequest) {
  const { error } = await resend.emails.send({
    from: "Cogskins <cogskins@fellipelorram.dev>",
    to,
    subject,
    react,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function SendLPEmail(email: string, subject: string) {
  if (!email) return;

  await sendEmail({
    to: "wasidev@wasidl.com.br",
    subject,
    react: `Email vindo do Form da LP, Salva ai: ${email}`,
  });
}
