"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { deriveKeyFromPassword, generateRandomBytes, arrayBufferToBase64 } from "@/lib/crypto";
import { doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setMasterKey } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, masterPassword);
      
      // 2. Fetch user's salt from Firestore (simulated here for UI phase)
      // In a real flow, we query users/{uid} to get the 'saltBase64'
      const simulatedSalt = "c2ltdWxhdGVkLXNhbHQ="; // Base64 for 'simulated-salt'
      
      // 3. Derive the Master Key locally in memory
      const key = await deriveKeyFromPassword(masterPassword, simulatedSalt);
      setMasterKey(key);
      
      // 4. Redirect to dashboard (to be built)
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 glass-panel rounded-3xl z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-surface-hover">
            <Lock className="w-8 h-8 text-accent" />
          </div>
        </div>
        
        <h2 className="mb-2 text-3xl font-bold text-center font-display text-foreground">
          Welcome Back
        </h2>
        <p className="mb-8 text-center text-text-secondary">
          Enter your master password to unlock your vault
        </p>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary opacity-50" />
              <input
                type="email"
                required
                className="w-full py-3 pl-12 pr-4 text-white transition-colors bg-surface border rounded-xl border-surface-border focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Master Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary opacity-50" />
              <input
                type="password"
                required
                className="w-full py-3 pl-12 pr-4 text-white transition-colors bg-surface border rounded-xl border-surface-border focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                placeholder="••••••••"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full gap-2 py-4 mt-8 font-semibold text-white transition-all rounded-xl bg-accent hover:bg-blue-600 disabled:opacity-50 hover:shadow-[var(--shadow-glow-cyan)]"
          >
            {isLoading ? "Decrypting Vault..." : "Unlock Vault"}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-text-secondary">
          Don't have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Create your vault
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
