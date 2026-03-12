"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import React, { useEffect, useRef } from "react";

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(from);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, {
        duration: duration,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [inView, count, to, duration]);

  const value = useTransform(count, (current) => {
    return Math.floor(current).toLocaleString();
  });

  return <motion.span ref={ref}>{value}</motion.span>;
}

export function SocialProofSection() {
  const stats = [
    { label: "Resources", value: 10000, suffix: "+" },
    { label: "Subjects", value: 200, suffix: "+" },
    { label: "Colleges", value: 50, suffix: "+" },
  ];

  return (
    <section className="relative px-6 py-20 lg:px-12 w-full overflow-hidden z-20">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xl font-semibold tracking-wide text-gray-500 mb-16 uppercase"
        >
          Made for Real College Workflows
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center pt-8 sm:pt-0"
            >
              <div className="text-5xl md:text-6xl font-black text-white mb-3 font-sans tracking-tighter flex items-center gap-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <Counter from={0} to={stat.value} duration={2.5} />
                <span className="text-blue-500">{stat.suffix}</span>
              </div>
              <p className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
