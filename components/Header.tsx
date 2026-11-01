"use client";

import React from "react";
import { Github, ArrowUpRight, Sun, Moon } from "lucide-react";
import { Logo } from "@/components/Logo";

interface Props {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: Props) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center p-0.5 shadow-sm">
            <Logo size={24} className="w-6 h-6" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
            bodyindex
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Selector Modo Oscuro / Claro */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Alternar modo oscuro y claro"
            className="flex items-center gap-1.5 p-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100/80 dark:bg-zinc-900/80 transition-all active:scale-95 shadow-sm"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-zinc-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
            )}
            <span className="hidden sm:inline text-[11px] font-mono">
              {theme === "dark" ? "claro" : "oscuro"}
            </span>
          </button>

          <a
            href="https://github.com/chacaejosue/body-index"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors font-medium text-xs"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">github</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
}
