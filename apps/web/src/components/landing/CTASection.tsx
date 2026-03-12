"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export function CTASection() {
  return (
    <section className="relative px-6 py-32 lg:px-12 overflow-hidden flex justify-center z-10">
      {/* Glow Behind Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-4xl rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/80 p-12 text-center backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] hover:bg-[#121212]/90 hover:border-white/20 transition-all"
      >
        <h2 className="text-4xl font-extrabold tracking-tight text-white flex flex-col items-center justify-center gap-2 sm:text-5xl lg:text-7xl mb-8 leading-[1.1]">
          <span>Stop Searching in</span>
          <span className="font-serif italic text-blue-500 pb-2">
            WhatsApp Groups
          </span>
        </h2>
        
        <Link href="/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-10 py-5 text-lg font-bold text-white shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all hover:shadow-[0_15px_40px_rgba(59,130,246,0.5)] cursor-pointer"
          >
            Join Now
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
