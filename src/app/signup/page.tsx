"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, KeyRound, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, firebaseErrorMessage } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { deriveKeyFromPassword, generateRandomBytes, arrayBufferToBase64 } from "@/lib/crypto";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setMasterKey } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (masterPassword.length < 12) {
      setError("Master password must be at least 12 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      if (!auth || !db) {
        throw new Error(firebaseErrorMessage || "Firebase is not configured.");
      }

      // 1. Authenticate with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, masterPassword);
      const user = userCredential.user;
      
      // 2. Generate a unique cryptographic salt for this user
      const saltBytes = generateRandomBytes(16);
      const saltBase64 = arrayBufferToBase64(saltBytes);
      
      // 3. Derive the Master Key locally in memory
      const key = await deriveKeyFromPassword(masterPassword, saltBase64);
      setMasterKey(key);
      
      // 4. Save user profile to Firestore (including the salt, BUT NOT the password)
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name,
        email,
        mode: "personal",
        subscriptionPlan: "free",
        securityScore: 100,
        saltBase64, // Crucial for deriving the key on future logins
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      // 5. Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 glass-panel rounded-3xl z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-surface-hover border border-surface-border">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <h2 className="mb-2 text-3xl font-bold text-center font-display text-foreground">
          Create Your Vault
        </h2>
        <p className="mb-8 text-center text-text-secondary">
          Your master password is your only key. <strong className="text-white">Do not lose it.</strong>
        </p>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary opacity-50" />
              <input
                type="text"
                required
                className="w-full py-3 pl-12 pr-4 text-white transition-colors bg-surface border rounded-xl border-surface-border focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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
                minLength={12}
                className="w-full py-3 pl-12 pr-4 text-white transition-colors bg-surface border rounded-xl border-surface-border focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                placeholder="Minimum 12 characters"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full gap-2 py-4 mt-8 font-semibold text-white transition-all rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
          >
            {isLoading ? "Generating Keys..." : "Create Secure Vault"}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-text-secondary">
          Already have a vault?{" "}
          <Link href="/login" className="text-purple-400 hover:underline">
            Unlock it here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
