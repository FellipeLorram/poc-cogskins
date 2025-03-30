"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailRequest {
  to: string;
  subject: string;
  react: React.ReactNode;
}

export async function sendEmail({ to, subject, react }: SendEmailRequest) {
  const { error } = await resend.emails.send({
    from: "Cogskins <cogskins@fellipelorram.dev>",
    to,
    subject,
    react,
  });

  if (error) {
    throw new Error(error.message);
  }
}
