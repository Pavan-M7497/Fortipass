"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-accent" />
          <span className="text-lg font-bold tracking-tight">FortiPass</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-text-secondary hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-accent hover:bg-blue-600 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full border border-accent/30 text-accent">
            Zero-knowledge security
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your digital security,{" "}
            <span className="text-accent">simplified.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            FortiPass is a next-generation security workspace — password vault,
            breach monitoring, and encrypted notes in one calm, focused
            experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-xl bg-accent hover:bg-blue-600 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl border border-surface-border text-text-secondary hover:text-foreground hover:border-accent/40 transition-colors"
            >
              Log in to vault
            </Link>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 w-full max-w-3xl"
        >
          {[
            {
              icon: <Lock className="w-5 h-5 text-accent" />,
              title: "Encrypted Vault",
              desc: "AES-256 client-side encryption. Your data never leaves your device unencrypted.",
            },
            {
              icon: <Zap className="w-5 h-5 text-accent" />,
              title: "Password Generator",
              desc: "Generate high-entropy passwords tuned to any policy with one click.",
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-accent" />,
              title: "Breach Monitoring",
              desc: "k-Anonymity checks against known breach databases without exposing your data.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass-panel rounded-2xl p-6 text-left space-y-3"
            >
              <div className="p-2 rounded-lg bg-surface-hover inline-flex">
                {f.icon}
              </div>
              <p className="font-semibold">{f.title}</p>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
