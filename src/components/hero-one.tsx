"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendLPEmail } from "@/api/helpers/send-email";

interface HeroOneProps {
  scrollToSection: (section: string) => void;
}

export default function HeroOne({ scrollToSection }: HeroOneProps) {
  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 md:px-10 lg:px-20 relative bg-white dark:bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col items-center md:items-start">
              <Image
                src="/logo.svg"
                alt="CogSkins"
                width={200}
                height={80}
                className="h-auto w-48 mb-6"
              />
              <div className="inline-flex items-center bg-gray-100 dark:bg-black/60 rounded-full px-4 py-1 border border-gray-300 dark:border-blue-500/30">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-800 dark:text-white">
                  Revolutionizing Education
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                YOUR DEGREE IS OUTDATED.
                <br />
                YOUR{" "}
                <span className="text-blue-500 dark:text-blue-400">
                  REAL SKILLS
                </span>{" "}
                AREN&apos;T.
              </h1>

              <div className="space-y-1 mt-6">
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                  Fortnite taught you leadership.
                </p>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                  YouTube was your MBA.
                </p>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                  Prove it.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-8 py-2 font-medium relative overflow-hidden group"
                onClick={() => scrollToSection("signup")}
              >
                <span className="relative z-10">Join Early Access</span>
                <span className="absolute inset-0 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 animate-fade-in-delay">
            <div className="w-full max-w-md border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-gray-50 dark:bg-black/40 hover:border-blue-500/30 transition-colors duration-300 shadow-sm">
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Join the Early Adopters &
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Co-Creators Club and help shape the future.
                  </p>
                </div>

                <form
                  action={async (formData) => {
                    const email = formData.get("email") as string;
                    if (!email) return;
                    await SendLPEmail(email, "Co-Creator Early Adopter");
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your best email..."
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  />
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white relative overflow-hidden group">
                    <span className="relative z-10">Submit</span>
                    <span className="absolute inset-0 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
