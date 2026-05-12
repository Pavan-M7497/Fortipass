"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { ShieldCheck, ShieldAlert, Shield, Info, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { generatePassword } from "@/utils/password";

// Initialize zxcvbn options
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnEnPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnEnPackage.commonWords,
    ...zxcvbnEnPackage.firstnames,
    ...zxcvbnEnPackage.lastnames,
    ...zxcvbnEnPackage.wikipedia,
  },
};
zxcvbnOptions.setOptions(options);

export default function SecurityPage() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (password) {
      setResult(zxcvbn(password));
    } else {
      setResult(null);
    }
  }, [password]);

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0: return "bg-red-500";
      case 1: return "bg-orange-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-emerald-500";
      default: return "bg-surface-border";
    }
  };

  const getScoreText = (score: number) => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Strong";
      case 4: return "Very Strong";
      default: return "Enter a password";
    }
  };

  const handleGenerate = () => {
    setPassword(generatePassword(16));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Security Hub</h1>
          <p className="text-text-secondary">Analyze your password strength and security health.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="glass-panel rounded-3xl p-8 border border-surface-border">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                Password Strength Checker
              </h2>

              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Test a password..."
                    className="w-full bg-background border border-surface-border rounded-2xl py-4 pl-6 pr-12 text-lg focus:outline-none focus:border-accent transition-all"
                  />
                  <button 
                    onClick={handleGenerate}
                    className="absolute right-4 top-4 p-1 text-text-secondary hover:text-accent transition-colors"
                    title="Generate random password"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-text-secondary">Security Score: <span className={result.score >= 3 ? "text-emerald-400" : "text-orange-400"}>{getScoreText(result.score)}</span></span>
                        <span className="text-text-secondary">{result.score}/4</span>
                      </div>
                      <div className="flex gap-2 h-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-500 ${
                              i <= result.score - 1 ? getScoreColor(result.score) : "bg-surface-border"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-hover rounded-2xl border border-surface-border">
                        <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">Time to crack</p>
                        <p className="text-lg font-semibold text-foreground">
                          {result.crackTimesDisplay.offlineFastHashing1e10PerSecond}
                        </p>
                      </div>
                      <div className="p-4 bg-surface-hover rounded-2xl border border-surface-border">
                        <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">Complexity</p>
                        <p className="text-lg font-semibold text-foreground">
                          {Math.round(result.guessesLog10)} bits
                        </p>
                      </div>
                    </div>

                    {result.feedback.warning && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-red-200">Warning</p>
                          <p className="text-sm text-red-200/80">{result.feedback.warning}</p>
                        </div>
                      </div>
                    )}

                    {result.feedback.suggestions.length > 0 && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-blue-200">Suggestions</p>
                          <ul className="text-sm text-blue-200/80 list-disc list-inside space-y-1">
                            {result.feedback.suggestions.map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="glass-panel rounded-3xl p-6 border border-surface-border">
              <h3 className="font-bold mb-4">Security Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-hover border border-surface-border">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Encryption</p>
                    <p className="text-xs text-text-secondary">AES-256 Enabled</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-hover border border-surface-border">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Zero-Knowledge</p>
                    <p className="text-xs text-text-secondary">Local Decryption</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-panel rounded-3xl p-6 border border-surface-border bg-gradient-to-br from-accent/10 to-transparent">
              <h3 className="font-bold mb-2">Did you know?</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                A 12-character password with mixed cases and symbols takes billions of years to crack. Focus on length over complexity.
              </p>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
