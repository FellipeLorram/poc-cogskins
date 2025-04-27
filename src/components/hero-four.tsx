"use client";

import { Button } from "@/components/ui/button";

interface HeroFourProps {
  scrollToSection: (section: string) => void;
}

export default function HeroFour({ scrollToSection }: HeroFourProps) {
  return (
    <section
      id="about"
      className="py-20 px-4 md:px-10 lg:px-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center bg-white dark:bg-black/60 rounded-full px-4 py-1 border border-gray-300 dark:border-blue-500/30 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-800 dark:text-white">
                Our Mission
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            WASI: <span className="text-orange-500">EDUCATION</span> TO CHANGE
            THE WORLD
          </h2>
        </div>

        <div className="max-w-3xl mx-auto mb-16 animate-fade-in-delay">
          <div className="bg-white dark:bg-gray-900/50 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              <span className="font-semibold text-blue-500 dark:text-blue-400">
                Wasi
              </span>{" "}
              means &quot;home&quot; in Quechua, and that&apos;s what we&apos;re
              building—a home for knowledge beyond traditional education. We
              believe learning should be dynamic, decentralized, and truly
              yours.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              With a team of experts in digital learning, gamification, and
              blockchain, we&apos;re reshaping how skills are recognized.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center animate-fade-in-delay-long">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Help Shape the Future – Join Our Research
          </h3>
          <Button
            onClick={() => scrollToSection("signup")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-lg text-lg font-medium relative overflow-hidden group"
          >
            <span className="relative z-10">Become a Co-Creator</span>
            <span className="absolute inset-0 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </Button>
        </div>
      </div>
    </section>
  );
}
