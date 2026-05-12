"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { VaultItemCard } from "@/components/dashboard/VaultItemCard";
import { getVaultItems } from "@/services/vaultService";
import { useAuth } from "@/contexts/AuthContext";
import { VaultItem } from "@/types/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ShieldAlert } from "lucide-react";

import { useDashboard } from "@/contexts/DashboardContext";

export default function DashboardPage() {
  const { user, masterKey } = useAuth();
  const { refreshVault, openAddModal } = useDashboard();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVault() {
      if (user && masterKey) {
        try {
          const vaultItems = await getVaultItems(user.uid, masterKey);
          setItems(vaultItems);
        } catch (err) {
          console.error("Failed to load vault items", err);
          setError("Failed to load vault items. Please refresh.");
        } finally {
          setLoading(false);
        }
      } else if (user && !masterKey) {
        // Vault is locked, stop loading and show empty state or prompt
        setLoading(false);
      }
    }
    loadVault();
  }, [user, masterKey, refreshVault]);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Items</h1>
          <p className="text-text-secondary">{items.length} secure items in your vault</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] sm:hidden"
        >
          <Plus className="w-5 h-5" />
          New
        </button>
      </header>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-surface/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-surface-hover flex items-center justify-center text-text-secondary mb-6">
            <Search className="w-10 h-10 opacity-20" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No items found</h2>
          <p className="text-text-secondary max-w-xs mx-auto mb-8">
            Your vault is empty. Start by adding your first password or secure note.
          </p>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Your First Item
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <VaultItemCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
