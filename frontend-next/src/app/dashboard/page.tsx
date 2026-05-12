"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[#06b6d4]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#8b5cf6]/10 blur-[120px] pointer-events-none" />

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="z-10 w-full max-w-2xl rounded-3xl glass-panel p-10 text-center"
      >
        <h1 className="text-4xl font-bold font-[family-name:var(--font-display)] text-foreground">
          Dashboard
        </h1>
        <p className="mt-4 text-text-secondary">
          Your secure vault workspace is loading. Core UI routes are now rendering safely.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-accent px-6 py-3 font-semibold text-white transition-all hover:bg-blue-600"
          >
            Back to Home
          </Link>
        </div>
      </motion.main>
    </div>
  );
}
