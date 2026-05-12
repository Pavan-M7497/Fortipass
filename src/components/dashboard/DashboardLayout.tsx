"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { AddItemModal } from "./AddItemModal";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading, isVaultLocked } = useAuth();
  const router = useRouter();
  const { isAddModalOpen, closeAddModal, triggerRefresh } = useDashboard();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={closeAddModal} 
        onAdded={triggerRefresh} 
      />
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardContent>{children}</DashboardContent>
    </DashboardProvider>
  );
}
