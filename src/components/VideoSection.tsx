"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ y: 100, filter: "blur(8px)" }}
          animate={{ y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-20 text-center backdrop-blur-sm"
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20">
              <Play className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Guarda il video demo</h2>
            <p className="mt-2 text-white/80">
              Scopri come il nostro AI Agent può rivoluzionare il tuo business
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
