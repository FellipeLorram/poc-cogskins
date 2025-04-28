import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
  async function handleStart() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set("sawIntro", "true", { path: "/" });
    redirect("/app/web-summit/trails");
  }

  return (
    <div className="w-full flex flex-col gap-16 justify-center items-center h-screen">
      <Image
        src="/cogskins-logo.png"
        alt="Web Summit 2025 Logo"
        width={409}
        height={270}
        className="w-40"
      />
      <div className="flex flex-col gap-4 items-center justify-center text-center">
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription className="text-lg">
          You have been invited to be a CogSkins Alpha Tester.
        </CardDescription>
        <form className="w-full" action={handleStart}>
          <Button className="w-full" type="submit">
            Start
          </Button>
        </form>
      </div>
    </div>
  );
}
