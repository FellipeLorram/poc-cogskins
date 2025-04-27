"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  activeSection: string;
  scrollToSection: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({
  activeSection,
  scrollToSection,
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-md"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <Link
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("home");
        }}
        className="flex items-center"
      >
        <Image
          src="/icon.png"
          alt="CogSkins"
          width={40}
          height={40}
          className="h-8 w-auto"
        />
      </Link>

      {/* Mobile menu button */}
      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          className="text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <NavLink
          href="#home"
          label="Home"
          isActive={activeSection === "home"}
          onClick={() => scrollToSection("home")}
        />
        <NavLink
          href="#features"
          label="Features"
          isActive={activeSection === "features"}
          onClick={() => scrollToSection("features")}
        />
        <NavLink
          href="#benefits"
          label="Benefits"
          isActive={activeSection === "benefits"}
          onClick={() => scrollToSection("benefits")}
        />
        <NavLink
          href="#about"
          label="About"
          isActive={activeSection === "about"}
          onClick={() => scrollToSection("about")}
        />
        <ThemeToggle />
        <a
          href="https://cogskins.com.br/app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white relative overflow-hidden group">
            <span className="relative z-10">Enter Cogskins</span>
            <span className="absolute inset-0 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </Button>
        </a>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm shadow-md p-4 flex flex-col space-y-4 md:hidden">
          <NavLink
            href="#home"
            label="Home"
            isActive={activeSection === "home"}
            onClick={() => scrollToSection("home")}
            mobile
          />
          <NavLink
            href="#features"
            label="Features"
            isActive={activeSection === "features"}
            onClick={() => scrollToSection("features")}
            mobile
          />
          <NavLink
            href="#benefits"
            label="Benefits"
            isActive={activeSection === "benefits"}
            onClick={() => scrollToSection("benefits")}
            mobile
          />
          <NavLink
            href="#about"
            label="About"
            isActive={activeSection === "about"}
            onClick={() => scrollToSection("about")}
            mobile
          />
          <a
            href="https://cogskins.com.br/app"
            className="w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
              Enter Cogskins
            </Button>
          </a>
        </div>
      )}
    </header>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  mobile?: boolean;
}

function NavLink({
  href,
  label,
  isActive,
  onClick,
  mobile = false,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`
        relative 
        ${mobile ? "w-full block" : ""}
        ${isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-800 dark:text-white"} 
        hover:text-blue-500 dark:hover:text-blue-400
        transition-colors
        nav-link
      `}
    >
      {label}
      <span
        className={`
        absolute 
        bottom-0 
        left-0 
        w-full 
        h-0.5 
        bg-blue-500 dark:bg-blue-400
        transform 
        scale-x-0 
        transition-transform 
        duration-300
        ${isActive ? "scale-x-100" : ""}
        origin-left
        nav-link-indicator
      `}
      ></span>
    </Link>
  );
}
