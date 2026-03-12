"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Presentation,
  FileCode,
  BookOpen,
  Lightbulb,
  Beaker,
  Map,
  MessageSquareQuote,
} from "lucide-react";
import React from "react";

const RESOURCES = [
  { name: "Notes", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { name: "PPT Slides", icon: Presentation, color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20" },
  { name: "Past Papers", icon: FileCode, color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
  { name: "Textbooks", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
  { name: "Lab Manuals", icon: Beaker, color: "text-gray-300", bg: "bg-gray-500/10 border-gray-500/20" },
  { name: "Study Guides", icon: Map, color: "text-slate-300", bg: "bg-slate-500/10 border-slate-500/20" },
  { name: "Quick Explanations", icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { name: "Senior Tips", icon: MessageSquareQuote, color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20" },
];

export function InfiniteResources() {
  return (
    <section className="relative overflow-hidden py-16 w-full z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What You{" "}
          <span className="font-serif italic text-blue-400">
            Can Find
          </span>{" "}
          Here
        </h2>
      </div>

      <div className="relative flex w-full overflow-hidden shrink-0 mt-8">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // Smooth slow scrolling
          }}
          className="flex w-max shrink-0"
        >
          {/* Duplicating the array twice guarantees a perfect loop with "-50%" width translation */}
          {[...RESOURCES, ...RESOURCES].map((resource, index) => (
            <div
              key={index}
              className="mr-6 flex w-[260px] shrink-0 items-center gap-4 rounded-2xl border border-white/5 bg-[#0a0a0a]/60 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-[#121212]/90 hover:border-white/10 select-none group focus:outline-none"
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 shadow-inner ${resource.bg}`}
              >
                <resource.icon className={`w-6 h-6 ${resource.color}`} />
              </div>
              <h3 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                {resource.name}
              </h3>
            </div>
          ))}
        </motion.div>

        {/* Left and Right Fade Masks for a seamless infinite scroll look inside dark mode */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#060A1A] to-transparent z-10"></div>
      </div>
    </section>
  );
}
