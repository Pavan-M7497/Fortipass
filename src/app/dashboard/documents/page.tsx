"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getDocuments, uploadDocument, downloadAndDecryptDocument } from "@/services/documentService";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentItem } from "@/types/schema";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Download, Trash2, Shield, MoreVertical, File } from "lucide-react";

export default function DocumentsPage() {
  const { user, masterKey } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadDocs() {
      if (user) {
        try {
          const docs = await getDocuments(user.uid);
          setDocuments(docs);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    }
    loadDocs();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !masterKey) return;

    setUploading(true);
    try {
      await uploadDocument(user.uid, masterKey, file);
      const docs = await getDocuments(user.uid);
      setDocuments(docs);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: DocumentItem) => {
    if (!masterKey) return;
    try {
      const blob = await downloadAndDecryptDocument(doc, masterKey);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Document Vault</h1>
            <p className="text-text-secondary">Securely store and encrypt your sensitive files.</p>
          </div>
          <label className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {uploading ? "Uploading..." : "Upload File"}
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-surface/40 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-dashed border-surface-border">
            <div className="w-20 h-20 rounded-3xl bg-surface-hover flex items-center justify-center text-text-secondary mb-6">
              <FileText className="w-10 h-10 opacity-20" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
            <p className="text-text-secondary max-w-xs mx-auto mb-8">
              Keep your sensitive IDs, certificates, and recovery keys in your encrypted document vault.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group glass-panel rounded-3xl p-6 border border-surface-border hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-hover flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <File className="w-6 h-6" />
                    </div>
                    <button className="p-2 text-text-secondary hover:text-foreground transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-foreground truncate mb-1" title={doc.fileName}>
                    {doc.fileName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-secondary mb-6">
                    <span>{formatSize(doc.fileSize)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Encrypted
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownload(doc)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-hover hover:bg-accent hover:text-white transition-all text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download & Decrypt
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
