"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Link as LinkIcon, FileText, RefreshCw, X, Shield, User } from "lucide-react";
import { addVaultItem } from "@/services/vaultService";
import { useAuth } from "@/contexts/AuthContext";
import { generatePassword } from "@/utils/password";

export function AddItemModal({ isOpen, onClose, onAdded }: { isOpen: boolean; onClose: () => void; onAdded: () => void }) {
  const { user, masterKey } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
    category: "General",
  });

  const handleGeneratePassword = () => {
    const newPass = generatePassword(16);
    setFormData({ ...formData, password: newPass });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !masterKey) return;

    setLoading(true);
    try {
      await addVaultItem(user.uid, masterKey, {
        ...formData,
        tags: [],
      });
      onAdded();
      onClose();
      setFormData({ title: "", username: "", password: "", url: "", notes: "", category: "General" });
    } catch (error) {
      console.error("Failed to add item", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface border border-surface-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-surface-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Item</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Title</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary opacity-50" />
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-background border border-surface-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-accent transition-colors"
                    placeholder="e.g. Google, GitHub, Netflix"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary opacity-50" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-background border border-surface-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-accent transition-colors"
                      placeholder="Email or username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary opacity-50" />
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-background border border-surface-border rounded-xl py-2 pl-10 pr-10 focus:outline-none focus:border-accent transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="absolute right-3 top-2.5 text-text-secondary hover:text-accent transition-colors"
                      title="Generate Password"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Website URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary opacity-50" />
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full bg-background border border-surface-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-accent transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Notes</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary opacity-50" />
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-background border border-surface-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-accent transition-colors min-h-[100px] resize-none"
                    placeholder="Additional details..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-surface-border rounded-xl font-semibold hover:bg-surface-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-accent hover:bg-blue-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? "Encrypting..." : "Save Securely"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
