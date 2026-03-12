"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Users } from "lucide-react";
import React from "react";

const FEATURES = [
  {
    title: "Smart Search",
    description: "Find notes by subject, semester or keywords instantly.",
    icon: Search,
    color: "from-gray-600 to-gray-800",
  },
  {
    title: "AI Resource Discovery",
    description: 'Ask questions like "OS unit 3 important topics" and get exact resources.',
    icon: Sparkles,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Senior Contributions",
    description: "Access verified notes uploaded by brilliant seniors in your college.",
    icon: Users,
    color: "from-slate-700 to-slate-900",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative px-6 py-24 sm:py-32 lg:px-12 w-full overflow-hidden z-10">
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Built for Students <br className="hidden sm:block" />
            <span className="font-serif italic text-blue-400">
              During Exam Week
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="group relative flex flex-col items-start gap-5 rounded-[2rem] border border-white/5 bg-[#0a0a0a]/50 p-10 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all hover:bg-[#121212]/80 hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.15)] hover:border-white/10 hover:-translate-y-1"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {feature.title}
              </h3>
              <p className="text-base text-gray-400 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
