"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroOne from "@/components/hero-one";
import HeroTwo from "@/components/hero-two";
import HeroThree from "@/components/hero-three";
import HeroFour from "@/components/hero-four";
import Navbar from "@/components/navbar";

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "benefits", "about", "signup"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Add a class to the body to show we're animating
      document.body.classList.add("is-navigating");

      // Add a highlight class to the target section
      element.classList.add("section-highlight");

      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });

      // Remove the highlight after animation completes
      setTimeout(() => {
        element.classList.remove("section-highlight");
        document.body.classList.remove("is-navigating");
      }, 1000);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <Navbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main>
        <HeroOne scrollToSection={scrollToSection} />
        <HeroTwo />
        <HeroThree />
        <HeroFour scrollToSection={scrollToSection} />
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="CogSkins"
            width={24}
            height={24}
            className="h-6 w-auto"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CogSkins. All rights reserved.
          </p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("features");
            }}
            className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="#benefits"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("benefits");
            }}
            className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:underline underline-offset-4"
          >
            Benefits
          </Link>
          <Link
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
            className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="#signup"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("signup");
            }}
            className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:underline underline-offset-4"
          >
            Sign Up
          </Link>
        </nav>
      </footer>
    </div>
  );
}
