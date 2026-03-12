import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black px-6 py-12 lg:px-12 z-20">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
           <span className="text-xl font-bold tracking-tight text-white select-none">
            StudyRadar
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-500">
          {["About", "Features", "Upload Notes", "GitHub", "Contact"].map((item) => (
            <Link key={item} href="#" className="hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <a href="#" className="text-gray-500 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="mt-12 text-center text-xs text-slate-600 font-medium">
        &copy; {new Date().getFullYear()} StudyRadar. All rights reserved.
      </div>
    </footer>
  );
}
