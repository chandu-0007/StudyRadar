"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { FileText, Presentation, FileCode, NotebookPen } from "lucide-react";
import Link from "next/link";
import React from "react";

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section 
      className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 lg:px-12 pb-20 z-0 group"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor Reactive Glow - Slight Blue */}
      <motion.div
        className="pointer-events-none absolute inset-[-100%] z-[-5] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Futuristic Radar Arcs SVG - Adjusted for Black/Gray/Blue mode visibility */}
      <svg className="absolute w-[1400px] h-[1400px] right-[-350px] top-1/2 -translate-y-1/2 opacity-60 hidden lg:block pointer-events-none -z-10" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base Large Circle shadow/glow */}
        <circle cx="600" cy="600" r="540" fill="#0f172a" opacity="0.3" filter="drop-shadow(0px 0px 40px rgba(59,130,246,0.3))" />
        
        {/* The Tick Ring */}
        <circle cx="600" cy="600" r="460" stroke="#334155" strokeWidth="40" opacity="0.4" />
        <g className="origin-center">
          {Array.from({ length: 120 }).map((_, i) => (
            <line key={i} x1="600" y1="120" x2="600" y2="160" stroke="#64748b" strokeWidth="2.5" opacity="0.6" transform={`rotate(${i * 3} 600 600)`} />
          ))}
        </g>
        
        {/* Inner circles */}
        <circle cx="600" cy="600" r="370" fill="#1e293b" opacity="0.2" />
        <circle cx="600" cy="600" r="369" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

        <circle cx="600" cy="600" r="230" fill="#020617" opacity="0.4" />
        <circle cx="600" cy="600" r="229" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
        
        <circle cx="600" cy="600" r="90" fill="#3b82f6" opacity="0.15" filter="drop-shadow(0px 0px 20px rgba(59,130,246,0.6))" />
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8 items-center mt-12">
        {/* Left Column: Text Content */}
        <div className="flex flex-col gap-8 text-center lg:text-left pt-12 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6 items-center lg:items-start"
          >
            <div className="inline-flex w-fit items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-300 backdrop-blur-md shadow-sm">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
              Platform is Live
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-[5rem] leading-[1.05]">
              Find the Right <br className="hidden lg:block" />
              <span className="font-serif italic text-white/95">Notes</span> in Seconds.
            </h1>

            <p className="max-w-xl text-lg text-gray-400 font-light leading-relaxed">
              Discover notes, PPTs, past papers, textbooks and exam summaries shared by seniors in your college.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] transition-all hover:shadow-[0_15px_30px_rgba(59,130,246,0.5)]"
                >
                  Get Started
                </motion.button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 group border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md"
                >
                  Explore Resources
                  <span className="opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all">→</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Floating Cards over the Arcs */}
        <div className="relative hidden w-full h-[600px] lg:flex items-center justify-center">
          <FloatingCard
            title="OS Notes"
            subtitle="Unit 1-5 Complete"
            icon={<FileText className="w-5 h-5 text-gray-300" />}
            delay={0.1}
            initY={-30}
            className="absolute top-[5%] left-[5%] z-20"
          />
          <FloatingCard
            title="DBMS PPT"
            subtitle="Normalization Guide"
            icon={<Presentation className="w-5 h-5 text-blue-400" />}
            delay={0.4}
            initY={10}
            className="absolute top-[45%] left-[-15%] z-30"
          />
          <FloatingCard
            title="DSA Past Paper"
            subtitle="2023 End Semester"
            icon={<FileCode className="w-5 h-5 text-slate-400" />}
            delay={0.7}
            initY={-10}
            className="absolute top-[20%] right-[10%] z-10"
          />
          <FloatingCard
            title="AI Cheat Sheet"
            subtitle="Quick Revision"
            icon={<NotebookPen className="w-5 h-5 text-gray-200" />}
            delay={1.0}
            initY={30}
            className="absolute top-[65%] right-[15%] z-20"
          />
        </div>
      </div>
    </section>
  );
}

interface FloatingCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  delay: number;
  className?: string;
  initY?: number;
}

function FloatingCard({ title, subtitle, icon, delay, className, initY = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      className={className}
    >
      <motion.div
        animate={{ y: [initY, initY - 20, initY] }}
        transition={{ repeat: Infinity, duration: 5 + delay, ease: "easeInOut" }}
        className="flex min-w-[220px] items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-4 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all hover:bg-[#121212]/90 hover:shadow-[0_20px_50px_-5px_rgba(59,130,246,0.2)] hover:border-white/20 cursor-pointer"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
