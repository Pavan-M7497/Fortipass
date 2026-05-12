"use client";

import { motion } from "framer-motion";
import { Shield, Key, FileText, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#06b6d4]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8b5cf6]/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="z-10 flex flex-col items-center w-full max-w-6xl px-6 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-panel"
        >
          <Lock className="w-4 h-4 text-[#3b82f6]" />
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            Zero-Knowledge Architecture
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="max-w-4xl font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
        >
          Secure Your Digital Life with <span className="text-gradient">FortiPass</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="max-w-2xl mt-8 text-lg md:text-xl text-[var(--color-text-secondary)]"
        >
          The intelligent, premium, and zero-knowledge password vault designed for modern individuals and forward-thinking businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col items-center gap-4 mt-10 sm:flex-row"
        >
          <Link
            href="/signup"
            className="flex items-center gap-2 px-8 py-4 font-semibold text-white transition-all rounded-full bg-[#3b82f6] hover:bg-blue-600 hover:shadow-[var(--shadow-glow-cyan)]"
          >
            Get Started
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-4 font-semibold transition-all rounded-full glass-panel glass-panel-hover"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Features Grid Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="grid w-full grid-cols-1 gap-6 mt-32 md:grid-cols-3"
        >
          {[
            {
              icon: <Key className="w-6 h-6 text-[#06b6d4]" />,
              title: "Smart Password Vault",
              desc: "Auto-fill, categorize, and seamlessly manage credentials across all your devices.",
            },
            {
              icon: <Shield className="w-6 h-6 text-[#8b5cf6]" />,
              title: "Breach Monitoring",
              desc: "Real-time alerts if your data appears in known security breaches on the dark web.",
            },
            {
              icon: <FileText className="w-6 h-6 text-[#3b82f6]" />,
              title: "Secure Documents",
              desc: "Store encrypted IDs, certificates, and contracts with zero-knowledge uploads.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-8 text-left transition-transform glass-panel rounded-2xl glass-panel-hover hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-full bg-[var(--color-surface-hover)]">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold font-[family-name:var(--font-display)]">
                {feature.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
