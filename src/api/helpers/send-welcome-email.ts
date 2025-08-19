"use server";

import { sendEmail } from "./send-email";
import { WelcomeEmail } from "@/lib/react-email/welcome-email";

interface SendWelcomeEmailProps {
  email: string;
  name?: string;
}

export async function sendWelcomeEmail({ email, name }: SendWelcomeEmailProps) {
  const loginUrl = `${process.env.NEXT_PUBLIC_URL}/api/auth/login`;

  try {
    await sendEmail({
      to: email,
      subject: "Welcome to CogSkins - Your subscription is active!",
      react: WelcomeEmail({ name, loginUrl }),
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}:`, error);
  }
}
