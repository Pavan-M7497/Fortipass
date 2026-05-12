"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, firebaseErrorMessage } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { deriveKeyFromPassword } from "@/lib/crypto";

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
      if (!auth) {
        throw new Error(firebaseErrorMessage || "Firebase authentication is not configured.");
      }

      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, masterPassword);
      const user = userCredential.user;
      
      // 2. Fetch user's salt from Firestore
      const userDoc = await getDoc(doc(db!, "users", user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("User data not found.");
      }
      
      const userData = userDoc.data();
      const saltBase64 = userData.saltBase64;
      
      if (!saltBase64) {
        throw new Error("Security salt not found. Please contact support.");
      }
      
      // 3. Derive the Master Key locally in memory
      const key = await deriveKeyFromPassword(masterPassword, saltBase64);
      setMasterKey(key);
      
      // 4. Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to authenticate";
      setError(message);
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
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Create your vault
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
