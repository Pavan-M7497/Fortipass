"use client";

import { VaultItem } from "@/types/schema";
import { Copy, ExternalLink, MoreVertical, Globe, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { decryptData } from "@/lib/crypto";
import { useAuth } from "@/contexts/AuthContext";

interface DecryptedData {
  title: string;
  username: string;
  password?: string;
  url?: string;
  notes?: string;
}

export function VaultItemCard({ item }: { item: VaultItem }) {
  const { masterKey } = useAuth();
  const [data, setData] = useState<DecryptedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function decrypt() {
      if (masterKey) {
        try {
          const decrypted = await decryptData<DecryptedData>(item.encryptedData, item.iv, masterKey);
          setData(decrypted);
        } catch (e) {
          console.error("Failed to decrypt item", e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    decrypt();
  }, [item, masterKey]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here later
  };

  if (loading) {
    return (
      <div className="bg-surface/50 border border-surface-border rounded-2xl p-4 animate-pulse h-24" />
    );
  }

  return (
    <div className="group bg-surface/40 hover:bg-surface/60 border border-surface-border hover:border-accent/30 rounded-2xl p-4 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            {data?.url ? <Globe className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{data?.title || "Untitled"}</h3>
            <p className="text-sm text-text-secondary">{data?.username || "No username"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {data?.url && (
            <a 
              href={data.url.startsWith("http") ? data.url : `https://${data.url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button 
            onClick={() => data?.password && copyToClipboard(data.password)}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
            title="Copy Password"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 text-text-secondary hover:text-foreground transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
