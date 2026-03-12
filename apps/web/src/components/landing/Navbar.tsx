"use client";

import { Radar } from "lucide-react";
import Link from "next/link";
import React from "react";

export function Navbar() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-6 lg:px-12 bg-transparent">
      <div className="flex items-center gap-2">
        <Radar className="w-6 h-6 text-white" />
        <span className="text-xl font-bold tracking-tight text-white select-none">
          StudyRadar
        </span>
      </div>

      <div className="hidden md:flex items-center gap-10">
        {["Home", "Features", "Resources", "FAQ"].map((item) => (
          <Link
            key={item}
            href="#"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/login" 
          className="hidden sm:block text-sm font-semibold text-gray-300 hover:text-white transition-colors"
        >
          Upload Notes
        </Link>
        <Link 
          href="/login"
          className="rounded-full bg-white/10 border border-white/20 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all hover:bg-white/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
